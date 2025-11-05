import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import axios from "../../api/axiosInstance";
import { useState } from "react";
import ConfirmationDialog from "../Cards/ConfirmationDialog";
export default function FournisseurTable({ rows, setRows, onEditClick }) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleDelete = (id) => {
    setSelectedId(id);
    setConfirmationOpen(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`/auth/fournisseurs/${selectedId}/`, {
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
    { field: "id", headerName: "الرقم", minWidth: 50 },
    {
      field: "nom",
      headerName: "الإسم",
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
      minWidth: 150,
    },
    {
      field: "wilaya_display",
      headerName: "الولاية",
      minWidth: 200,
    },
    {
      field: "dettes_initiales",
      headerName: "الديون الإبتدائية",
      minWidth: 150,
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
        sx={{ p: 3, borderRadius: 3, backgroundColor: "#fff"}}
      >
        <Typography
          variant="h4"
          sx={{ mb: 2, color: "primary.main", textAlign: "center" }}
        >
          قائمة الممونين
        </Typography>

        <Box sx={{ height: 370, width: "100%", overflowY: "auto" }}>
          <DataGrid
            rows={[...rows].sort((a, b) => b.id - a.id)} // ✅ sort by ID descending
            columns={columns}
            hideFooter
            getRowId={(row) => row.id}
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
        text="هل أنت متأكد من حذف هذا الممون؟"
      />
    </>
  );
}
