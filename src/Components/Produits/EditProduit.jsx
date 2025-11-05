import { useState, useEffect } from "react";
import { Button, Grid } from "@mui/material";
import axios from "../../api/axiosInstance";
import FeedbackCard from "../Cards/FeedbackCard";
import ProductInfos from "./ProductInfos";
import CodeBar from "./CodeBar";
import DragDrop from "../Clients/dragDrop";

export default function EditProduit({
  selectedProduit,
  setOpenEditDialog,
  setRows,
}) {
  const [formData, setFormData] = useState({
    nom: "",
    reference: "",
    famille: "",
    magasin: "",
    marque: "",
    codes_barres: [],
    image: null,
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
    taux_benefice_3: 0,
    taux_benefice_5: 0,
    taux_benefice_6: 0,
    taux_benefice_8: 0,
    taux_benefice_9: 0,
    taux_benefice_10: 0,
    taux_benefice_12: 0,
    taux_benefice_15: 0,
    taux_benefice_cache: 0,
  });

  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (selectedProduit) {
      setFormData({
        nom: selectedProduit.nom,
        reference: selectedProduit.reference,
        famille: selectedProduit.famille,
        magasin: selectedProduit.magasin_detail?.id || "",
        marque: selectedProduit.marque,
        codes_barres: selectedProduit.codes_barres || [],
        codes_barres_raw: selectedProduit.codes_barres?.join(", ") || "",
        image: selectedProduit.image || null,
        prix_achat: parseFloat(selectedProduit.prix_achat),
        prix_vente_cache: parseFloat(selectedProduit.prix_vente_cache),
        prix_vente_3: parseFloat(selectedProduit.prix_vente_3),
        prix_vente_5: parseFloat(selectedProduit.prix_vente_5),
        prix_vente_6: parseFloat(selectedProduit.prix_vente_6),
        prix_vente_8: parseFloat(selectedProduit.prix_vente_8),
        prix_vente_9: parseFloat(selectedProduit.prix_vente_9),
        prix_vente_10: parseFloat(selectedProduit.prix_vente_10),
        prix_vente_12: parseFloat(selectedProduit.prix_vente_12),
        prix_vente_15: parseFloat(selectedProduit.prix_vente_15),
        taux_benefice_3: selectedProduit.taux_benefice_3,
        taux_benefice_5: selectedProduit.taux_benefice_5,
        taux_benefice_6: selectedProduit.taux_benefice_6,
        taux_benefice_8: selectedProduit.taux_benefice_8,
        taux_benefice_9: selectedProduit.taux_benefice_9,
        taux_benefice_10: selectedProduit.taux_benefice_10,
        taux_benefice_12: selectedProduit.taux_benefice_12,
        taux_benefice_15: selectedProduit.taux_benefice_15,
        taux_benefice_cache: selectedProduit.taux_benefice_cache,
      });
      setFiles([]); // reset files when loading existing produit
    }
  }, [selectedProduit]);

// const handleUpdate = async () => {
//   try {
//     const token = localStorage.getItem("access_token");
//     const { codes_barres_raw, ...dataToSend } = formData;

//     // Prepare FormData for PATCH (to support image upload)
//     const formDataToSend = new FormData();

//     Object.entries(dataToSend).forEach(([key, value]) => {
//       if (key === "codes_barres") {
//         formDataToSend.append(key, JSON.stringify(value));
//       } else if (value !== null && value !== undefined) {
//         formDataToSend.append(key, value);
//       }
//     });

//     // If new files uploaded, replace image
//     if (files.length > 0) {
//       formDataToSend.append("image", files[0]); 
//     } else if (formData.image === null) {
//       // 👇 Explicitly clear the image on backend
//       formDataToSend.append("image", "");
//     }

//     console.log("Payload envoyé :", [...formDataToSend.entries()]);

//     const response = await axios.patch(
//       `/prod/produits/${selectedProduit.id}/`,
//       formDataToSend,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     setFeedback({
//       open: true,
//       message: "✅ تم تعديل السلعة بنجاح",
//       severity: "success",
//     });

//     setRows((prev) =>
//       prev.map((m) =>
//         m.id === selectedProduit.id ? { ...m, ...response.data } : m
//       )
//     );
//   } catch (err) {
//     console.error("Erreur modification:", err);
//     setFeedback({
//       open: true,
//       message: "❌ فشل في التعديل",
//       severity: "error",
//     });
//   }
// };
const handleUpdate = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const { codes_barres_raw, ...dataToSend } = formData;

    const formDataToSend = new FormData();

    Object.entries(dataToSend).forEach(([key, value]) => {
      if (key === "codes_barres") {
        formDataToSend.append(key, JSON.stringify(value));
      } else if (value === null || value === undefined) {
        // Allow clearing a field if needed
        formDataToSend.append(key, "");
      } else {
        // ✅ Always include 0 values
        formDataToSend.append(key, value);
      }
    });

    // ✅ Handle image
    if (files.length > 0) {
      formDataToSend.append("image", files[0]);
    } else if (formData.image === null) {
      formDataToSend.append("image", ""); // clear the image
    }

    console.log("Payload envoyé :", [...formDataToSend.entries()]);

    const response = await axios.patch(
      `/prod/produits/${selectedProduit.id}/`,
      formDataToSend,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setFeedback({
      open: true,
      message: "✅ تم تعديل السلعة بنجاح",
      severity: "success",
    });

    setRows((prev) =>
      prev.map((m) =>
        m.id === selectedProduit.id ? { ...m, ...response.data } : m
      )
    );
  } catch (err) {
    console.error("Erreur modification:", err);
    setFeedback({
      open: true,
      message: "❌ فشل في التعديل",
      severity: "error",
    });
  }
};


  return (
    <>
      <Grid container>
        <Grid size={7}>
          <ProductInfos ProductInfo={formData} setProductInfo={setFormData} />
        </Grid>
        <Grid
          size={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <CodeBar ProductInfo={formData} setProductInfo={setFormData} />
          <DragDrop
            files={files}
            setFiles={setFiles}
            existingFiles={formData.image ? [formData.image] : []} // show current image if exists
            onRemoveExistingFile={() => {
              setFormData((prev) => ({ ...prev, image: null }));
            }}
          />
          <Button
            variant="contained"
            sx={{ width: "90%", height: "50px",mt:2 }}
            onClick={handleUpdate}
          >
            تعديل المعلومات
          </Button>
        </Grid>
      </Grid>
      {feedback.open && (
        <FeedbackCard
          message={feedback.message}
          severity={feedback.severity}
          onClose={() => {
            setFeedback({ ...feedback, open: false });
            if (feedback.severity === "success") setOpenEditDialog(false);
          }}
        />
      )}
    </>
  );
}
