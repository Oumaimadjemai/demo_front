import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper, Dialog, DialogTitle, DialogContent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import axios from "../../api/axiosInstance";
import { useState } from "react";
import ConfirmationDialog from "../Cards/ConfirmationDialog";
import ClientDetail from "./ClientDetail";
import CloseIcon from "@mui/icons-material/Close";
export default function ClientTable({ rows, setRows, onEditClick }) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleDelete = (id) => {
    setSelectedId(id);
    setConfirmationOpen(true);
  };
  const [selectedClient, setSelectedClient] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  const confirmDelete = () => {
    axios
      .delete(`/auth/clients/${selectedId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then(() => {
        setRows((prev) => prev.filter((row) => row.id !== selectedId));
      })
      .catch((err) => {
        console.error("Erreur de suppression :", err);
      })
      .finally(() => {
        setConfirmationOpen(false);
        setSelectedId(null);
      });
  };
  const columns = [
    { field: "id", headerName: "الرقم", width: 10 },
    {
      field: "prenom_ar",
      headerName: "الإسم",
      minWidth: 200,
    },
    {
      field: "nom_famille_ar",
      headerName: "اللقب",
      minWidth: 200,
    },
    {
      field: "adresse",
      headerName: "العنوان",
      minWidth: 200,
    },
    {
      field: "telephone",
      headerName: "الهاتف",
      minWidth: 200,
    },
    {
      field: "ccp",
      headerName: "الحساب",
      minWidth: 200,
    },
    {
      field: "date_debut",
      headerName: "بداية التقسيط",
      minWidth: 200,
    },

    {
      field: "date_fin",
      headerName: "نهاية التقسيط",
      minWidth: 200,
    },
    {
      field: "last_payment_date",
      headerName: "أخر تسديد",
      minWidth: 200,
    },
    {
      field: "dette_totale_client",
      headerName: "الدين الإجمالي",
      minWidth: 200,
    },
    {
      field: "dette_actuelle_client",
      headerName: "الدين الساري",
      minWidth: 200,
    },
    {
      field: "montant_verse",
      headerName: "دفعات إضافية",
      minWidth: 200,
    },
    {
      field: "total-jsp",
      headerName: "م.م",
      minWidth: 200,
    },
  {
      field: "edit",
      headerName: "تعديل",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={(e) => {
            e.stopPropagation(); // 🛑 Stop row click
            onEditClick(params.row);
          }}
          color="primary"
        >
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "حذف",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={(e) => {
            e.stopPropagation(); // 🛑 Stop row click
            handleDelete(params.row.id);
          }}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  
  ];

  return (
    <>
      <Paper
        elevation={3}
        sx={{ p: 3, borderRadius: 3, backgroundColor: "#fff", mb: 2 }}
      >
        <Typography
          variant="h4"
          sx={{ mb: 2, color: "primary.main", textAlign: "center" }}
        >
          قائمة العملاء
        </Typography>

        <Box sx={{ height: 300, width: "100%", overflowY: "auto" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            hideFooter
            getRowId={(row) => row.id}
            onRowClick={(params) => {
              setSelectedClient(params.row); // Save the clicked row
              setOpenDetailDialog(true); // Open the dialog
            }} // 🔐 Important for correct ID handling
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "primary.main",
                fontWeight: "bold",
                color: "black",
                textAlign: "center",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f5f5f5",
              },
              border: "none",

              fontFamily: 'Arial, "Noto Kufi Arabic", sans-serif',
              cursor:"pointer"
            }}
          />
        </Box>
      </Paper>
      <ConfirmationDialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={confirmDelete}
        text="هل أنت متأكد من حذف هذا الزبون؟"
      />
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          تفاصيل العميل
          <IconButton onClick={() => setOpenDetailDialog(false)} color="error">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedClient && <ClientDetail client={selectedClient} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
