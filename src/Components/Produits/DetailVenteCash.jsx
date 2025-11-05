import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Divider,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close"; // ✅ Close icon
import ClientDetail from "../Clients/ClientDetail"; // ✅ adjust path

export default function DetailVenteCash({ produitId }) {
  const [ventes, setVentes] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (!produitId) return;

    axios
      .get(`/vente/liste/?produit=${produitId}`)
      .then((res) => {
        let ventesData = res.data.ventes || [];

        // 🔹 Filter lignes_detail to include only this produitId
        ventesData = ventesData
          .map((vente) => ({
            ...vente,
            lignes_detail: (vente.lignes_detail || []).filter(
              (ligne) => ligne.produit === produitId
            ),
          }))
          // 🔹 Keep only ventes that still have lines for this product
          .filter((vente) => vente.lignes_detail.length > 0);

        // 🔹 Sort ventes by date_vente descending
        ventesData.sort((a, b) => {
          const dateA = new Date(a.date_vente || a.date_formatee);
          const dateB = new Date(b.date_vente || b.date_formatee);
          return dateB - dateA;
        });

        setVentes(ventesData);
      })
      .catch((err) => {
        console.error("Error fetching ventes:", err);
      });
  }, [produitId]);

  return (
    <Box sx={{ width: "99%" }}>
      {ventes.length > 0 ? (
        ventes.map((vente) => (
          <Box key={vente.id} sx={{ mb: 3 }}>
            {/* 🔹 Header for each vente */}
            <Paper
              sx={{
                p: 2,
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#e3f2fd",
              }}
              elevation={1}
            >
              <Stack direction="row" spacing={4}>
                <Typography variant="body1">
                  <strong>تاريخ البيع :</strong> {vente.date_formatee || "--"}
                </Typography>
                <Typography variant="body1">
                  <strong>رقم البيع :</strong> {vente.id}
                </Typography>
              </Stack>

              <Divider flexItem orientation="vertical" />

              <Typography variant="h6" color="primary" fontWeight="bold">
                الإجمالي :{" "}
                {vente.lignes_detail
                  .reduce(
                    (sum, ligne) => sum + parseFloat(ligne.sous_total || 0),
                    0
                  )
                 }
              </Typography>
            </Paper>

            {/* 🔹 Table for lignes */}
            <TableContainer
              component={Paper}
              sx={{ maxHeight: "40vh", overflowY: "auto" }}
            >
              <Table aria-label="vente table" stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell align="right">
                      <Typography fontWeight="bold">الرقم</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">الزبون</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">السعر</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">الكمية</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="bold">المجموع</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vente.lignes_detail.length > 0 ? (
                    vente.lignes_detail.map((ligne) => (
                      <TableRow key={ligne.id}>
                        <TableCell align="right">{ligne.id}</TableCell>
                        <TableCell
                          align="right"
                          sx={{ cursor: "pointer", color: "blue" }}
                          onClick={() => setSelectedClient(vente.client_detail)}
                        >
                          {vente.client_detail
                            ? `${vente.client_detail.nom_famille_ar || ""} ${
                                vente.client_detail.prenom_ar || ""
                              }`
                            : ""}
                        </TableCell>
                        <TableCell align="right">
                          {parseFloat(ligne.prix_unitaire || 0)}
                        </TableCell>
                        <TableCell align="right">
                          {ligne.quantite || 0}
                        </TableCell>
                        <TableCell align="right">
                          {parseFloat(ligne.sous_total || 0)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">
                          لا توجد تفاصيل لهذا البيع
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))
      ) : (
        <Typography align="center" color="text.secondary" mt={4}>
          لا توجد بيانات لعرضها
        </Typography>
      )}

      {/* 🔹 Client Detail Dialog */}
      <Dialog
        open={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        maxWidth="xl"
        fullWidth
      >
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={() => setSelectedClient(null)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
            zIndex: 1,
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          {selectedClient && <ClientDetail client={selectedClient} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
