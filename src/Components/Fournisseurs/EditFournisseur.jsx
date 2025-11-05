import { useState, useEffect } from "react";

import axios from "../../api/axiosInstance";
import FeedbackCard from "../Cards/FeedbackCard";
import FournisseurInfos from "./FournisseurInfos";

export default function EditFournisseur({
  selectedFournisseur,
  setOpenEditDialog,
  setRows,
}) {
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

  useEffect(() => {
    if (selectedFournisseur) {
      setFormData({
         nom: selectedFournisseur.nom,
    adresse: selectedFournisseur.adresse,
    telephone: selectedFournisseur.telephone,
    wilaya: selectedFournisseur.wilaya,
    dettes_initiales: selectedFournisseur.dettes_initiales,
      });
    }
  }, [selectedFournisseur]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `/auth/fournisseurs/${selectedFournisseur.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setFeedback({
        open: true,
        message: "✅ تم تعديل المستخدم بنجاح",
        severity: "success",
      });

      // Update row locally
      setRows((prev) =>
        prev.map((m) =>
          m.id === selectedFournisseur.id ? { ...m, ...formData } : m
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
    <FournisseurInfos
  fournisseurInfos={formData}
  setFournisseurInfo={setFormData}
  onSave={handleUpdate}
  buttonText="تعديل المعلومات"
/>

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
