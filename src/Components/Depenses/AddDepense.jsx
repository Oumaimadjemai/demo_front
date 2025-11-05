import { useState } from "react";
import axios from "../../api/axiosInstance";
import FeedbackCard from "../Cards/FeedbackCard";
import DepenseInfo from "./DepenseInfos";


export default function AddDepense({ setOpenAddDepenseDialog ,fetchDepense}) {
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

  const handleAddClick = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post("/depense/depenses/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setFeedback({
        open: true,
        message: "✅ Depense ajouté avec succès",
        severity: "success",
      });
      fetchDepense();
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
      <DepenseInfo
        DepenseInfos={formData}
        setDepenseInfo={setFormData}
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
              setOpenAddDepenseDialog(false);
            }
          }}
        />
      )}
    </>
  );
}
