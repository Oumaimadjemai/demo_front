import Grid from "@mui/material/GridLegacy";
import Side from "./Side";
import Buttom from "./Buttom";
import { useState, useEffect } from "react";
import axios from "../../../api/axiosInstance";
import FeedbackCard from "../../Cards/FeedbackCard";
import VenteInfos from "./VenteInfos";

export default function AddVente({ isEditMode = false, initialData = null }) {
  const [rows, setRows] = useState([]);
  const [formData, setFormData] = useState({
    client: "",
    lignes: [],
  });
  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Initialize form if in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        client: initialData.client_detail?.id || "",
        lignes: initialData.ligne || [],
      });

      const initialRows = (initialData.ligne || []).map((item, index) => ({
        id: index + 1,
        produitId: item.produit_detail?.id,
        reference: item.produit_detail?.reference || "",
        nom: item.produit_detail?.nom || "",
        prix_vente_cache: parseFloat(item.prix_vente_cache),
        quantite: item.quantite,
        magasin: item.magasin_detail?.id || item.magasin || "",
        magasin_nom: item.magasin_detail?.nom || "",
        total: parseFloat(item.prix_vente_cache) * item.quantite,
      }));
      setRows(initialRows);
    }
  }, [isEditMode, initialData]);

  // Update lignes when rows change
  useEffect(() => {
    const lignes = rows.map((row) => ({
      produit: row.produitId,
      quantite: row.quantite,
    }));
    setFormData((prev) => ({ ...prev, lignes }));
  }, [rows]);

  const handleAddProduct = ({
    produit,
    quantite,
    prixVenteCache,
    magasin,
    magasin_nom,
  }) => {
    const prix = parseFloat(prixVenteCache);
    const qty = parseFloat(quantite);

    const newRow = {
      id: rows.length + 1,
      produitId: produit?.id,
      reference: produit?.reference || "",
      nom: produit?.nom || "",
      prix_vente_cache: isNaN(prix) ? 0 : prix,
      quantite: isNaN(qty) ? 0 : qty,
      magasin: parseInt(magasin) || "",
      magasin_nom: magasin_nom || "",
      total: isNaN(prix) || isNaN(qty) ? 0 : prix * qty,
    };

    setRows((prev) => [...prev, newRow]);
  };

  const handleclientChange = (value) => {
    setFormData((prev) => ({ ...prev, client: value }));
  };

  const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("access_token");

    // 🔹 1) Update product prices if they were changed
    for (const row of rows) {
      if (row.produitId && row.prix_vente_cache) {
        await axios.patch(
          `/prod/produits/${row.produitId}/`,
          { prix_vente_cache: row.prix_vente_cache },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    // 🔹 2) Build vente payload
    const lignesCorrigees = formData.lignes.map((ligne) => ({
      produit: parseInt(ligne.produit),
      quantite: parseFloat(ligne.quantite),
    }));

    const payload = {
      client: parseInt(formData.client),
      lignes: lignesCorrigees,
    };

    // 🔹 3) Create or update vente
    if (isEditMode && initialData) {
      await axios.put(`/vente/ventes-cache/${initialData.id}/`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback({
        open: true,
        severity: "success",
        message: "✅ Vente modifiée avec succès",
      });
    } else {
      await axios.post("/vente/ventes-cache/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFeedback({
        open: true,
        severity: "success",
        message: "✅ Vente enregistrée avec succès",
      });
      setRows([]);
      setFormData({ client: "", lignes: [] });
    }
  } catch (error) {
    console.error("Full error object:", error);
    let message = "❌ Une erreur est survenue lors de la soumission";

    if (error.response) {
      console.error("Error response data:", error.response.data);
      message = error.response.data.message || message;
    } else if (error.request) {
      console.error("Error request:", error.request);
      message = "Pas de réponse du serveur";
    }

    setFeedback({
      open: true,
      severity: "error",
      message,
    });
  }
};


  return (
    <>
      <Grid container sx={{ height: "100vh" }}>
        <Grid item xs={3} sx={{ borderRight: "1px solid #ddd", p: 1 }}>
          <Side
            rows={rows}
            clientId={formData.client}
            onclientChange={handleclientChange}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
          />
        </Grid>

        <Grid item xs={9} sx={{ p: 2 }}>
          <VenteInfos onAddProduct={handleAddProduct} />
          <Buttom rows={rows} setRows={setRows} />
        </Grid>
      </Grid>
      {feedback.open && (
        <FeedbackCard
          message={feedback.message}
          severity={feedback.severity}
          onClose={() => {
            setFeedback({ ...feedback, open: false });
          }}
        />
      )}
    </>
  );
}
