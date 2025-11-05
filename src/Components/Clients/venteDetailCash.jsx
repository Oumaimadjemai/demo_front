import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Stack,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

export default function VenteDetailCash({ clientId }) {
  const [ventes, setVentes] = useState([]);

  useEffect(() => {
    if (!clientId) return;

    axios
      .get(`vente/liste/?client=${clientId}`)
      .then((res) => {
        const data = res.data;
        const ventesData = data.ventes || [];

        // 🔹 Sort by date_vente descending
        const sortedVentes = ventesData.sort((a, b) => {
          const dateA = new Date(a.date_vente || a.date_formatee);
          const dateB = new Date(b.date_vente || b.date_formatee);
          return dateB - dateA; // Descending
        });

        setVentes(sortedVentes);
      })
      .catch((err) => {
        console.error("Error fetching ventes:", err);
      });
  }, [clientId]);

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
                  <strong>تاريخ البيع :</strong> {vente.date_formatee}
                </Typography>
                <Typography variant="body1">
                  <strong>رقم البيع :</strong> {vente.id}
                </Typography>
              </Stack>

              <Divider flexItem orientation="vertical" />

              <Typography variant="h6" color="primary" fontWeight="bold">
                الإجمالي : {parseFloat(vente.montant_total)}
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
                    <TableCell align="right"><Typography fontWeight="bold">الرقم</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="bold">المرجع</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="bold">الإسم</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="bold">السعر</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="bold">الكمية</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="bold">المحل</Typography></TableCell>
                    <TableCell align="right"><Typography fontWeight="bold">المجموع</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vente.lignes_detail && vente.lignes_detail.length > 0 ? (
                    vente.lignes_detail.map((ligne) => (
                      <TableRow key={ligne.id}>
                        <TableCell align="right">{ligne.produit}</TableCell>
                        <TableCell align="right">{ligne.produit_reference || ""}</TableCell>
                        <TableCell align="right">{ligne.produit_nom || ""}</TableCell>
                        <TableCell align="right">{parseFloat(ligne.prix_unitaire || 0)}</TableCell>
                        <TableCell align="right">{ligne.quantite || 0}</TableCell>
                        <TableCell align="right">{ligne.magasin_detail?.nom || ""}</TableCell>
                        <TableCell align="right">{parseFloat(ligne.sous_total || 0)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
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
    </Box>
  );
}
