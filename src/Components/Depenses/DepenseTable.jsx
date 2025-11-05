import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import axios from "../../api/axiosInstance";
import { useState } from "react";
import ConfirmationDialog from "../Cards/ConfirmationDialog";
export default function DepenseTable({ rows, setRows, onEditClick }) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleDelete = (id) => {
    setSelectedId(id);
    setConfirmationOpen(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`/depense/depenses/${selectedId}/`, {
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
    { field: "id", headerName: "الرقم", minWidth: 30 },
    {
      field: "date",
      headerName: "التاريخ",
      minWidth: 150,
    },
    {
      field: "mode_paiement",
      headerName: "السداد",
      minWidth: 150,
    },
    {
      field: "type_depense",
      headerName: "النوع",
      minWidth: 150,
    },
    {
      field: "libelle",
      headerName: "المصاريف",
      minWidth: 150,
    },
    {
      field: "montant",
      headerName: "القيمة",
      minWidth: 150,
    },
    {
      field: "utilisateur",
      headerName: "المستخدم",
      minWidth: 150,
      renderCell: (params) => {
        const utilisateur = params.row?.utilisateur;
        if (utilisateur && utilisateur.username) {
          return utilisateur.username;
        }
        return "غير معروف";
      },
    },
    {
      field: "edit",
      headerName: "تعديل",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={() => onEditClick(params.row)} color="primary">
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
        <IconButton onClick={() => handleDelete(params.row.id)} color="error">
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
          قائمة المصاريف
        </Typography>

        <Box sx={{ height: 300, width: "100%", overflowY: "auto" }}>
          <DataGrid
            rows={rows || []}
            columns={columns}
            hideFooter
            getRowId={(row) => row.id} // 🔐 Important for correct ID handling
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
            }}
          />
        </Box>
      </Paper>
      <ConfirmationDialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={confirmDelete}
        text="هل أنت متأكد من الحذف؟"
      />
    </>
  );
}
