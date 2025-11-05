import { useState, useEffect } from "react";

import axios from "../../api/axiosInstance";
import FeedbackCard from "../Cards/FeedbackCard";
import DepenseInfo from "./DepenseInfos";

export default function EditDepense({
  selectedDepense,
  setOpenEditDialog,
  setRows,
}) {
  const [formData, setFormData] = useState({
  type_depense: "",
    mode_paiement: "",
    libelle: "",
    montant: "",
});
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (selectedDepense) {
      setFormData({
      type_depense: selectedDepense.type_depense,
    mode_paiement: selectedDepense.mode_paiement,
    libelle: selectedDepense.libelle,
    montant: selectedDepense.montant,
      });
    }
  }, [selectedDepense]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `/depense/depenses/${selectedDepense.id}/`,
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
        message: "✅ تم تعديل بنجاح",
        severity: "success",
      });

      // Update row locally
      setRows((prev) =>
        prev.map((m) =>
          m.id === selectedDepense.id ? { ...m, ...formData } : m
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
    <DepenseInfo
  DepenseInfos={formData}
  setDepenseInfo={setFormData}
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
