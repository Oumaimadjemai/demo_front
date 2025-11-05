import Grid from "@mui/material/Grid";
import ProductInfos from "./ProductInfos";
import CodeBar from "./CodeBar";
import DragDrop from "../Clients/dragDrop";
import { useState } from "react";
import Button from "@mui/material/Button";
import axios from "../../api/axiosInstance";
import FeedbackCard from "../Cards/FeedbackCard";

export default function AddProduit({ setOpenAddProductDialog, fetchProduit }) {
  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const [ProductInfo, setProductInfo] = useState({
    nom: "",
    reference: "",
    famille: "",
    magasin: "",
    marque: "",
    codes_barres: [],
    prix_achat: 0,
    prix_vente_cache: 0,
    prix_vente_3: 0,
    prix_vente_5: 0,
    prix_vente_6: 0,
    prix_vente_8: 0,
    prix_vente_9: 0,
    prix_vente_10: 0,
    prix_vente_12: 0,
    prix_vente_15: 0,
    taux_benefice_cache: 0,
    taux_benefice_3: 0,
    taux_benefice_5: 0,
    taux_benefice_6: 0,
    taux_benefice_8: 0,
    taux_benefice_9: 0,
    taux_benefice_10: 0,
    taux_benefice_12: 0,
    taux_benefice_15: 0,
  });

  const handleSubmit = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      const formData = new FormData();

      // Prepare the cleaned payload
      const payload = {
        ...ProductInfo,
        prix_achat: Number(ProductInfo.prix_achat) || 0,
        prix_vente_cache: Number(ProductInfo.prix_vente_cache) || 0,
        prix_vente_3: Number(ProductInfo.prix_vente_3) || 0,
        prix_vente_5: Number(ProductInfo.prix_vente_5) || 0,
        prix_vente_6: Number(ProductInfo.prix_vente_6) || 0,
        prix_vente_8: Number(ProductInfo.prix_vente_8) || 0,
        prix_vente_9: Number(ProductInfo.prix_vente_9) || 0,
        prix_vente_10: Number(ProductInfo.prix_vente_10) || 0,
        prix_vente_12: Number(ProductInfo.prix_vente_12) || 0,
        prix_vente_15: Number(ProductInfo.prix_vente_15) || 0,
        taux_benefice_cache: Number(ProductInfo.taux_benefice_cache) || 0,
        taux_benefice_3: Number(ProductInfo.taux_benefice_3) || 0,
        taux_benefice_5: Number(ProductInfo.taux_benefice_5) || 0,
        taux_benefice_6: Number(ProductInfo.taux_benefice_6) || 0,
        taux_benefice_8: Number(ProductInfo.taux_benefice_8) || 0,
        taux_benefice_9: Number(ProductInfo.taux_benefice_9) || 0,
        taux_benefice_10: Number(ProductInfo.taux_benefice_10) || 0,
        taux_benefice_12: Number(ProductInfo.taux_benefice_12) || 0,
        taux_benefice_15: Number(ProductInfo.taux_benefice_15) || 0,
      };

      // Append fields to FormData
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "codes_barres") {
          formData.append(key, JSON.stringify(value)); // Array → JSON string
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      // Append uploaded images
      uploadedFiles.forEach((file) => formData.append("image", file));

      // ✅ POST the data
      const response = await axios.post("prod/produits/", formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Success feedback
      setFeedback({
        open: true,
        severity: "success",
        message: "✅ Produit enregistré avec succès",
      });

      console.log("Produit ajouté :", response.data);

      // Refresh product list if available
      if (typeof fetchProduit === "function") {
        fetchProduit();
      }

    } catch (err) {
      console.error("Erreur:", err);
      let message = "❌ Une erreur est survenue.";

      if (err.response?.data) {
        if (typeof err.response.data === "object") {
          message = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join(" | ");
        } else {
          message = err.response.data.toString();
        }
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
      <Grid container>
        <Grid item xs={7}>
          <ProductInfos ProductInfo={ProductInfo} setProductInfo={setProductInfo} />
        </Grid>

        <Grid
          item
          xs={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <CodeBar ProductInfo={ProductInfo} setProductInfo={setProductInfo} />
          <DragDrop files={uploadedFiles} setFiles={setUploadedFiles} />

          <Button
            variant="contained"
            sx={{ width: "90%", height: "50px", mb: "20px", mt: 2 }}
            onClick={handleSubmit}
          >
            حفظ المعلومات
          </Button>

          <Button
            variant="contained"
            sx={{ width: "90%", height: "50px", bgcolor: "green" }}
            onClick={() =>
              setProductInfo({
                nom: "",
                reference: "",
                famille: "",
                magasin: "",
                marque: "",
                codes_barres: [],
                prix_achat: 0,
                prix_vente_cache: 0,
                prix_vente_3: 0,
                prix_vente_5: 0,
                prix_vente_6: 0,
                prix_vente_8: 0,
                prix_vente_9: 0,
                prix_vente_10: 0,
                prix_vente_12: 0,
                prix_vente_15: 0,
                taux_benefice_cache: 0,
                taux_benefice_3: 0,
                taux_benefice_5: 0,
                taux_benefice_6: 0,
                taux_benefice_8: 0,
                taux_benefice_9: 0,
                taux_benefice_10: 0,
                taux_benefice_12: 0,
                taux_benefice_15: 0,
              })
            }
          >
            إضافة سلعة جديدة
          </Button>
        </Grid>
      </Grid>

      {feedback.open && (
        <FeedbackCard
          message={feedback.message}
          severity={feedback.severity}
          onClose={() => {
            setFeedback({ ...feedback, open: false });
            if (feedback.severity === "success") {
              setOpenAddProductDialog(false);
            }
          }}
        />
      )}
    </>
  );
}
