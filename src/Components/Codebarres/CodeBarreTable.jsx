import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import BarcodePrintDialog from "./BarcodePrintDialog";
import axios from "../../api/axiosInstance";

export default function CodeBarreTable({ searchTerm, magasinFilter }) {
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printedCodeBarres, setPrintedCodeBarres] = useState([]);

  // ✅ Fonction de fetch réutilisable
  const fetchProduits = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (magasinFilter) params.magasin = magasinFilter;

      const response = await axios.get("/prod/produits/", { params });
      setProduits(response.data.results || []);
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduits();
  }, [searchTerm, magasinFilter]);

  const handleClickCodeBarre = (produit, codebarre) => {
    setSelectedProduit({ ...produit, codebarre });
  };

  const handleCloseDialog = () => setSelectedProduit(null);

  const magasinsMap = {};
  produits.forEach((produit) => {
    const magasinNom = produit.magasin_detail?.nom || "Inconnu";
    if (!magasinsMap[magasinNom]) magasinsMap[magasinNom] = [];
    magasinsMap[magasinNom].push(produit);
  });

  const magasins = Object.entries(magasinsMap).map(([nom, produits]) => ({
    nom,
    produits,
  }));

  return (
    <Box sx={{ p: 2 }}>
      {loading ? (
        <CircularProgress />
      ) : (
        magasins.map((magasin, index) => (
          <Paper key={index} sx={{ mb: 2, p: 2 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                width: "96%",
                background: "#eee",
                p: 2,
                textAlign: "center",
              }}
              color="primary"
            >
              {magasin.nom}
            </Typography>
            <Table>
              <TableBody>
                {magasin.produits.map((produit) => (
                  <TableRow key={produit.id} sx={{ verticalAlign: "top" }}>
                    <TableCell>{produit.id}</TableCell>
                    <TableCell>{produit.reference || "—"}</TableCell>
                    <TableCell>{produit.nom}</TableCell>
                    <TableCell>{produit.quantite}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          rowGap: 1,
                        }}
                      >
                        {(produit.codes_barres || []).map((cb, i) => (
                          <Box
                            key={i}
                            sx={{
                              backgroundColor: printedCodeBarres.includes(cb)
                                ? "#a5d6a7"
                                : "#ccc",
                              p: 1,
                              borderRadius: 1,
                              cursor: "pointer",
                              display: "inline-block",
                            }}
                            onClick={() =>
                              handleClickCodeBarre(produit, cb)
                            }
                          >
                            {cb}
                          </Box>
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        ))
      )}

      <BarcodePrintDialog
        selectedProduit={selectedProduit}
        onClose={handleCloseDialog}
        refreshProduits={fetchProduits} // ✅ passe la fonction pour MAJ après suppression
      />
    </Box>
  );
}
