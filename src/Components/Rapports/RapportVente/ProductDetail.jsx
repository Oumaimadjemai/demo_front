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
import ProduitDetail from "../../Produits/ProduitDEtail";
import CloseIcon from "@mui/icons-material/Close";

export default function ProductDetail({ topProduits }) {
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [loadingProduit, setLoadingPRoduit] = useState(false);
  // ✅ Tri décroissant par montant_total_produit
  const sortedProduits = [...topProduits]
    .filter((p) => p.quantite_vendue_produit > 0) // ✅ On ignore ceux avec 0
    .sort((a, b) => b.montant_total_produit - a.montant_total_produit);
  const handleOpenDialog = async (produitId) => {
    setOpenDetailDialog(true);
    setLoadingPRoduit(true);
    setSelectedProduit(null);

    try {
      // Fetch client info + ventes stats in parallel
      const [ProduitRes] = await Promise.all([
        axios.get(`/prod/produits/${produitId}/`),
      ]);

      const produitData = ProduitRes.data;

      // ✅ Merge stats from ventes into client object
      const mergedProduit = {
        ...produitData,
      };

      setSelectedProduit(mergedProduit);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des données produit:", err);
    } finally {
      setLoadingPRoduit(false);
    }
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            الأكثر مبيعا بالتقسيط
          </Typography>
          <Table size="small">
            <TableBody>
              {sortedProduits.map((p, i) => (
                <TableRow key={i}>
                  <TableCell
                    sx={{ color: "primary.main", cursor: "pointer" }}
                    onClick={() => handleOpenDialog(p.id)}
                  >
                    {p.produit}
                  </TableCell>
                  <TableCell>{p.quantite_vendue_produit}</TableCell>
                  <TableCell>
                    {p.montant_total_produit}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* ✅ Produit Detail Dialog */}
      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="xl"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          تفاصيل المنتج
          <IconButton onClick={() => setOpenDetailDialog(false)} color="error">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ minHeight: 400 }}>
          {loadingProduit ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            selectedProduit && <ProduitDetail produit={selectedProduit} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
