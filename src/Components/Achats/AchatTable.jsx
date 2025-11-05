import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import axios from "../../api/axiosInstance";
import { useState } from "react";
import ConfirmationDialog from "../Cards/ConfirmationDialog";
export default function AchatTable({
  rows,
  setRows,
  onEditClick,
  onDetailsClick,
}) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleDelete = (id) => {
    setSelectedId(id);
    setConfirmationOpen(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`/achat/par-group/${selectedId}/`, {
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
  // And implement the handlers:
  const handleEditRow = (row) => {
    // Find the row in the rows array and update it
    const updatedRows = rows.map((r) => (r.id === row.id ? row : r));
    setRows(updatedRows);
  };
  const columns = [
    { field: "id", headerName: "الرقم", minWidth: 20 },
    {
      field: "date_formatee",
      headerName: "التاريخ",
      minWidth: 150,
    },
    {
      field: "fournisseur",
      headerName: "الممون",
      minWidth: 170,
      renderCell: (params) => {
        const fournisseur = params.row?.fournisseur_detail;
        if (fournisseur && fournisseur.nom) {
          return fournisseur.nom;
        }
        return "غير معروف";
      },
    },
    {
      field: "total",
      headerName: "القيمة",
      minWidth: 100,
    },
    {
      field: "somme_payee",
      headerName: "المبلغ المدفوع",
      minWidth: 150,
    },
    {
      field: "somme_restante",
      headerName: "المبلغ المتبقي",
      minWidth: 150,
    },
    {
      field: "utilisateur",
      headerName: "المستخدم",
      minWidth: 150,
      renderCell: (params) => {
        const utilisateur = params.row?.utilisateur_detail;
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
    {
      field: "details",
      headerName: "تفاصيل",
      width: 50,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="info" onClick={() => onDetailsClick(params.row)}>
          <InfoIcon />
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
          قائمة المشتريات
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
