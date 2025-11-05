import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import axios from "../../api/axiosInstance";
import { useState } from "react";
import ConfirmationDialog from "../Cards/ConfirmationDialog";
export default function TransfertTable({ rows, setRows }) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const handleDelete = (id) => {
    setSelectedId(id);
    setConfirmationOpen(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`/trans/transferts/${selectedId}/`, {
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
      field: "produit_details",
      headerName: "السلعة",
      minWidth: 200,
      renderCell: (params) => {
        const produit_details = params.row?.produit_details;
        if (produit_details && produit_details.nom) {
          return produit_details.nom;
        }
        return "غير معروف";
      },
    },
    {
      field: "magasin_source_details",
      headerName: "من",
      minWidth: 200,
      renderCell: (params) => {
        const magasin_source_details = params.row?.magasin_source_details;
        if (magasin_source_details && magasin_source_details.nom) {
          return magasin_source_details.nom;
        }
        return "غير معروف";
      },
    },
    {
      field: "magasin_destination_details",
      headerName: "إلى",
      minWidth: 200,
      renderCell: (params) => {
        const magasin_destination_details = params.row?.magasin_destination_details;
        if (magasin_destination_details && magasin_destination_details.nom) {
          return magasin_destination_details.nom;
        }
        return "غير معروف";
      },
    },
    {
      field: "quantite",
      headerName: "الكمية",
      minWidth: 100,
    },
    {
      field: "codes_barres_transferes",
      headerName: "كود بار",
      minWidth: 270,
    },
     {
      field: "date_formatee",
      headerName: "اليوم",
      minWidth: 150,
    },
     {
      field: "heure_formatee",
      headerName: "الوقت",
      minWidth: 80,
    },
    {
      field: "utilisateur_details",
      headerName: "المستخدم",
      minWidth: 150,
      renderCell: (params) => {
        const utilisateur = params.row?.utilisateur_details;
        if (utilisateur && utilisateur.username) {
          return utilisateur.username;
        }
        return "غير معروف";
      },
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
          قائمة التحويلات
        </Typography>

        <Box sx={{ height: 400, width: "100%", overflowY: "auto" }}>
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
