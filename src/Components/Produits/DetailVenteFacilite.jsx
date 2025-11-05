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
  IconButton
} from "@mui/material";
import ClientDetail from "../Clients/ClientDetail"; // ✅ adjust path
import CloseIcon from "@mui/icons-material/Close";
export default function DetailVenteFacilite({ produitId }) {
  const [ventes, setVentes] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  useEffect(() => {
    if (!produitId) return;

    axios
      .get(`/vente/ventes-facilite/?produit=${produitId}`)
      .then((res) => {
        const data = res.data;
        let ventesData = data.ventes || [];

        ventesData.sort((a, b) => {
          const [dayA, monthA, yearA] = (a.date_formatee || "01/01/1900").split("/").map(Number);
          const [dayB, monthB, yearB] = (b.date_formatee || "01/01/1900").split("/").map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateB - dateA;
        });

        setVentes(ventesData);
      })
      .catch((err) => console.error("Error fetching ventes:", err));
  }, [produitId]);

  return (
    <Box sx={{ width: "99%" }}>
      {ventes.length > 0 ? (
        ventes.map((vente) => {
          const filteredLignes =
            vente.lignes_detail?.filter((ligne) => ligne.produit === produitId) || [];
          const totalFiltered = filteredLignes.reduce(
            (sum, ligne) => sum + parseFloat(ligne.sous_total || 0),
            0
          );

          if (filteredLignes.length === 0) return null;

          return (
            <Box key={vente.id} sx={{ mb: 3 }}>
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
                  الإجمالي : {totalFiltered}
                </Typography>
              </Paper>

              <TableContainer component={Paper} sx={{ maxHeight: "40vh", overflowY: "auto" }}>
                <Table aria-label="vente table" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell align="right">الرقم</TableCell>
                      <TableCell align="right">الزبون</TableCell>
                      <TableCell align="right">السعر</TableCell>
                      <TableCell align="right">الكمية</TableCell>
                      <TableCell align="right">المجموع</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLignes.map((ligne) => (
                      <TableRow key={ligne.id}>
                        <TableCell align="right">{ligne.id}</TableCell>
                        <TableCell
                          align="right"
                          sx={{ cursor: "pointer", color: "blue" }}
                          onClick={() => setSelectedClient(vente.client_detail)}
                        >
                          {vente.client_detail
                            ? `${vente.client_detail.nom_famille_ar || ""} ${vente.client_detail.prenom_ar || ""}`
                            : ""}
                        </TableCell>
                        <TableCell align="right">{parseFloat(ligne.prix_unitaire || 0)}</TableCell>
                        <TableCell align="right">{ligne.quantite || 0}</TableCell>
                        <TableCell align="right">{parseFloat(ligne.sous_total || 0)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          );
        })
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
