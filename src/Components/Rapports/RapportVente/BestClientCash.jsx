import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "../../../api/axiosInstance";
import ClientDetail from "../../Clients/ClientDetail";
import CloseIcon from "@mui/icons-material/Close";

export default function BestClientCash({ topClientsCash }) {
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loadingClient, setLoadingClient] = useState(false);

  // ✅ Tri décroissant par montant_total_produit
  const sortedclients = [...topClientsCash]
    .filter((c) => c.total_montant > 0) // ✅ On ignore ceux avec 0
    .sort((a, b) => b.total_montant - a.total_montant);
  const handleOpenDialog = async (clientId) => {
    setOpenDetailDialog(true);
    setLoadingClient(true);
    setSelectedClient(null);

    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      };

      // Fetch client info + ventes stats in parallel
      const [clientRes, venteRes] = await Promise.all([
        axios.get(`/auth/clients/${clientId}/`, { headers }),
        axios.get(`/vente/ventes-facilite/?client=${clientId}`, { headers }),
      ]);

      const clientData = clientRes.data;
      const venteData = venteRes.data;

      // ✅ Merge stats from ventes into client object
      const mergedClient = {
        ...clientData,
        dette_actuelle_client: venteData.total_montant_restant || 0,
        montant_paye_effectif: venteData.total_montant_verse || 0,
        dette_totale_client: venteData.total_montant_total || 0,
        ventes_facilite: venteData.ventes || [],
      };

      setSelectedClient(mergedClient);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des données client:", err);
    } finally {
      setLoadingClient(false);
    }
  };
  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            أفضل الزبائن كاش
          </Typography>
          <Table size="small">
           <TableBody>
  {sortedclients.slice(0, 10).map((c, i) => (
    <TableRow key={i}>
      <TableCell
        sx={{ color: "primary.main", cursor: "pointer" }}
        onClick={() => handleOpenDialog(c.id)}
      >
        {c.client}
      </TableCell>
      <TableCell>{c.total_montant}</TableCell>
    </TableRow>
  ))}
</TableBody>

          </Table>
        </CardContent>
      </Card>
       <Dialog
              open={openDetailDialog}
              onClose={() => setOpenDetailDialog(false)}
              maxWidth="xl"
              fullWidth
            >
              <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                تفاصيل العميل
                <IconButton
                 onClick={() => setOpenDetailDialog(false)} color="error">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
      
              <DialogContent sx={{ minHeight: 400 }}>
                {loadingClient ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  selectedClient && <ClientDetail client={selectedClient} />
                )}
              </DialogContent>
            </Dialog>
    </>
  );
}
