import { useState, useEffect } from "react";
import {
  Button,
  Container,
  TextField,
  Card,
  Typography,
} from "@mui/material";
import axios from "../../api/axiosInstance";
import FeedbackCard from "../Cards/FeedbackCard";

export default function EditUser({
  selectedUser,
  setOpenEditDialog,
  setRows,
}) {
  const [formData, setFormData] = useState({ username: "", role: "" });
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username,
        role: selectedUser.role,
      });
    }
  }, [selectedUser]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.patch(
        `/auth/users/${selectedUser.id}/`,
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
          m.id === selectedUser.id ? { ...m, ...formData } : m
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
        تعديل المستخدم
        </Typography>
        <TextField
          fullWidth
          label="اسم المستخدم"
          sx={{ my: 2 }}
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <TextField
          fullWidth
          label="الصلاحية"
          sx={{ mb: 2 }}
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value })
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
