import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import {
  Box,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function DetailAchatProduit({ produitId }) {
  const [achats, setAchats] = useState([]);
  const role = localStorage.getItem("role");
  useEffect(() => {
    if (!produitId) return;

    axios
      .get(`/achat/par-group/?produit=${produitId}`)
      .then((res) => {
        const data = res.data;
        let achatsData = data.achats_groupes || [];

        // 🔹 Sort by date_formatee DESC (most recent first)
        achatsData.sort((a, b) => {
          const [dayA, monthA, yearA] = (a.date_formatee || "01/01/1900").split("/").map(Number);
          const [dayB, monthB, yearB] = (b.date_formatee || "01/01/1900").split("/").map(Number);
          const dateA = new Date(yearA, monthA - 1, dayA);
          const dateB = new Date(yearB, monthB - 1, dayB);
          return dateB - dateA; // descending
        });

        setAchats(achatsData);
      })
      .catch((err) => {
        console.error("Error fetching achat:", err);
      });
  }, [produitId]);
  // ✅ If not admin, hide this component
  if (role !== "admin") return null;



  return (
    <Box sx={{ width: "99%" }}>
      {achats.length > 0 ? (
        achats.map((achat) => {
          // 🔹 Filter only the lines for the selected product
          const filteredLignes =
            achat.achats?.filter((ligne) => ligne.produit === produitId) || [];

          // 🔹 Calculate total for this product only
          const totalFiltered = filteredLignes.reduce(
            (sum, ligne) =>
              sum + (parseFloat(ligne.prix_achat || 0) * (ligne.quantite || 0)),
            0
          );

          // 🔹 Skip groups without this product
          if (filteredLignes.length === 0) return null;

          return (
            <Box key={achat.id} sx={{ mb: 3 }}>
              {/* 🔹 Header for each achat group */}
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
                    <strong>تاريخ الشراء :</strong> {achat.date_formatee || "--"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>الممون :</strong>{" "}
                    {achat.fournisseur_detail?.nom || "--"}
                  </Typography>
                </Stack>

                <Divider flexItem orientation="vertical" />

                <Typography variant="h6" color="primary" fontWeight="bold">
                  الإجمالي : {totalFiltered}
                </Typography>
              </Paper>

              {/* 🔹 Table for filtered lignes */}
              <TableContainer
                component={Paper}
                sx={{ maxHeight: "40vh", overflowY: "auto" }}
              >
                <Table aria-label="achat table" stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell align="right">
                        <Typography fontWeight="bold">الرقم</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">السعر</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">الكمية</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">المحل</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">المجموع</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLignes.map((ligne) => (
                      <TableRow key={ligne.id}>
                        <TableCell align="right">{ligne.id}</TableCell>
                        <TableCell align="right">
                          {parseFloat(ligne.prix_achat || 0)}
                        </TableCell>
                        <TableCell align="right">{ligne.quantite || 0}</TableCell>
                        <TableCell align="right">
                          {ligne.magasin_detail?.nom || ""}
                        </TableCell>
                        <TableCell align="right">
                          {(
                            parseFloat(ligne.prix_achat || 0) * (ligne.quantite || 0)
                          )}
                        </TableCell>
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
    </Box>
  );
}
