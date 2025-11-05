import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Card,
  Typography,
} from "@mui/material";
import axios from "../../api/axiosInstance";
import FeedbackCard from "../Cards/FeedbackCard";

export default function EditMagasin({
  selectedMagasin,
  setOpenEditDialog,
  setRows,
}) {
  const [formData, setFormData] = useState({ nom: "", adresse: "" });
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (selectedMagasin) {
      setFormData({
        nom: selectedMagasin.nom,
        adresse: selectedMagasin.adresse,
      });
    }
  }, [selectedMagasin]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.put(
        `/param/magasins/${selectedMagasin.id}/`,
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
        message: "✅ تم تعديل المحل بنجاح",
        severity: "success",
      });

      // Update row locally
      setRows((prev) =>
        prev.map((m) =>
          m.id === selectedMagasin.id ? { ...m, ...formData } : m
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
    <Container maxWidth="sm" sx={{mb:4,mt:2}}>
      <Card sx={{ p: 3, mt: 2 }}>
        <Typography variant="h5" align="center" color="primary">
          تعديل المحل
        </Typography>
        <TextField
          fullWidth
          label="اسم المحل"
          sx={{ my: 2 }}
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
        />
        <TextField
          fullWidth
          label="العنوان"
          sx={{ mb: 2 }}
          value={formData.adresse}
          onChange={(e) =>
            setFormData({ ...formData, adresse: e.target.value })
          }
        />
        <Button variant="contained" fullWidth onClick={handleUpdate}>
          تعديل
        </Button>
      </Card>

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
    </Container>
  );
}
