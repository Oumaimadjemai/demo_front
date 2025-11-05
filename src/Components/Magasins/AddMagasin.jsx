import { Box, Card, Container, Typography } from "@mui/material";

import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import axios from "../../api/axiosInstance";
import FeedbackCard from "../Cards/FeedbackCard";
export default function AddMagasin({ setOpenAddMagasinDialog, fetchMagasins }) {
  const [MagasinInfos, setMagasinInfos] = useState({
    nom: "",
    adresse: "",
  });
  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success", // or "error"
    message: "",
  });
  const handleAddClick = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      const response = await axios.post("param/magasins/", MagasinInfos, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      // Show success feedback
      setFeedback({
        open: true,
        severity: "success",
        message: "✅ Magasin enregistré avec succès",
      });
      fetchMagasins();
    } catch (error) {
      console.error("ajout failed", error);
      let message = "❌ Une erreur est survenue.";
      setFeedback({
        open: true,
        severity: "error",
        message,
      });
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mb: 4 }}>
        <Box sx={{ minWidth: 275 }}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                mt: 2,
                mb: 2,
                color: "primary.main",
              }}
            >
              معلومات المحل
            </Typography>
            <TextField
              label="إسم المحل"
              sx={{ width: "95%", mb: "10px" }}
              value={MagasinInfos.nom}
              onChange={(e) => {
                setMagasinInfos({ ...MagasinInfos, nom: e.target.value });
              }}
            />
            <TextField
              label="العنوان"
              sx={{ width: "95%", mb: "10px" }}
              value={MagasinInfos.adresse}
              onChange={(e) => {
                setMagasinInfos({ ...MagasinInfos, adresse: e.target.value });
              }}
            />
            <Button
              variant="contained"
              sx={{ width: "150px", height: "50px", mb: 4, mt: 2 }}
              onClick={handleAddClick}
            >
              إضافة محل
            </Button>
          </Card>
        </Box>
      </Container>
      {feedback.open && (
        <FeedbackCard
          message={feedback.message}
          severity={feedback.severity}
          onClose={() => {
            setFeedback({ ...feedback, open: false });
            if (feedback.severity === "success") {
              setOpenAddMagasinDialog(false);
            }
          }}
        />
      )}
    </>
  );
}
