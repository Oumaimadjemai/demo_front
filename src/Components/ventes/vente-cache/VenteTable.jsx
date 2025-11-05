import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import axios from "../../../api/axiosInstance";
import { useState } from "react";
import ConfirmationDialog from "../../Cards/ConfirmationDialog";
import PrintIcon from "@mui/icons-material/Print";
import { saveAs } from "file-saver";
export default function VenteTable({ rows, setRows, onDetailsClick }) {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [selectedVente, setSelectedVente] = useState(null);

  const handleDelete = (id) => {
    setSelectedId(id);
    setConfirmationOpen(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`/vente/ventes-cache/${selectedId}/`, {
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
    { field: "id", headerName: "الرقم", minWidth: 20 },
    {
      field: "date_formatee",
      headerName: "التاريخ",
      minWidth: 120,
    },
    {
      field: "client",
      headerName: "الزبون",
      minWidth: 250,
      renderCell: (params) => {
        const client = params.row?.client_detail;
        if (client && client.nom_famille_ar + " " + client.prenom_ar) {
          return client.nom_famille_ar + " " + client.prenom_ar;
        }
        return "غير معروف";
      },
    },
    {
      field: "montant_total",
      headerName: "القيمة",
      minWidth: 150,
    },

    {
      field: "utilisateur",
      headerName: "البائع",
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
      width: 90,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="info" onClick={() => onDetailsClick(params.row)}>
          <InfoIcon />
        </IconButton>
      ),
    },
    {
      field: "print",
      headerName: "طباعة",
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => {
            setSelectedVente(params.row);
            setPrintDialogOpen(true);
          }}
        >
          <PrintIcon />
        </IconButton>
      ),
    },
  ];
  const downloadFile = async (url, filename) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(url, {
        responseType: "blob", // Important to handle binary files
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Trigger download
      saveAs(response.data, filename);
    } catch (error) {
      console.error("Erreur lors du téléchargement du fichier :", error);
    }
  };

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
          قائمة المبيعات
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
      <Dialog open={printDialogOpen} onClose={() => setPrintDialogOpen(false)}>
        <DialogTitle>خيارات الطباعة</DialogTitle>
        <Box
          sx={{
            px: 3,
            pb: 3,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography sx={{ mb: 2 }}>
            اختر نوع الطباعة لعملية البيع رقم {selectedVente?.id}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (selectedVente) {
                downloadFile(
                  `/vente/ventes-cache/${selectedVente.id}/bon/word/`,
                  `Bon.docx`
                );
                setPrintDialogOpen(false);
              }
            }}
            sx={{ mb: 2 }}
          >
            وصل البيع
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
