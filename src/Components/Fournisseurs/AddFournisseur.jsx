import { useState } from "react";
import axios from "../../api/axiosInstance";
import FeedbackCard from "../Cards/FeedbackCard";
import FournisseurInfos from "./FournisseurInfos";

export default function AddFournisseur({ setOpenAddFournisseurtDialog, fetchFournisseur }) {
  const [formData, setFormData] = useState({
    nom: "",
    adresse: "",
    telephone: "",
    wilaya: "01",
    dettes_initiales: 0,
  });

  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "success",
  });

const handleAddClick = async () => {
  setFeedback({ open: false, message: "", severity: "success" }); // ✅ reset feedback

  try {
    const token = localStorage.getItem("access_token");
    await axios.post("/auth/fournisseurs/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    setFeedback({
      open: true,
      message: "✅ Fournisseur ajouté avec succès",
      severity: "success",
    });

    // ✅ Call fetchFournisseur only if provided
    if (typeof fetchFournisseur === "function") {
      fetchFournisseur();
    }

    // ✅ Optionally reset the form after success
    setFormData({
      nom: "",
      adresse: "",
      telephone: "",
      wilaya: "01",
      dettes_initiales: 0,
    });
  } catch (error) {
    let message = "❌ Une erreur est survenue.";
    if (error.response?.data) {
      message = Object.entries(error.response.data)
        .map(
          ([key, value]) =>
            `${key}: ${Array.isArray(value) ? value.join(", ") : value}`
        )
        .join("\n");
    }

    setFeedback({
      open: true,
      message,
      severity: "error",
    });
  }
};


  return (
    <>
      <FournisseurInfos
        fournisseurInfos={formData}
        setFournisseurInfo={setFormData}
        onSave={handleAddClick}
        buttonText="حفظ المعلومات"
      />

      {feedback.open && (
        <FeedbackCard
          message={feedback.message}
          severity={feedback.severity}
          onClose={() => {
            setFeedback({ ...feedback, open: false });
            if (feedback.severity === "success") {
              setOpenAddFournisseurtDialog(false);
            }
          }}
        />
      )}
    </>
  );
}
