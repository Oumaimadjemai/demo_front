import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import axios from "../../api/axiosInstance";

export default function Profile() {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    // Front-end validation
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setErrorMsg("يرجى ملء جميع الحقول.");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMsg("كلمة المرور الجديدة غير متطابقة.");
      return;
    }

    try {
      const res = await axios.post(
        "auth/change-password/",
        {
          old_password: passwordData.oldPassword,
          new_password: passwordData.newPassword,
        }
      );

      setSuccessMsg(res.data.detail || "تم تغيير كلمة المرور بنجاح.");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      if (err.response?.data?.detail) {
        setErrorMsg(err.response.data.detail);
      } else {
        setErrorMsg("حدث خطأ أثناء تغيير كلمة المرور.");
      }
    }
  };

  return (
    <Box sx={{ p: 3, direction: "rtl", bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 3, maxWidth: 600, mx: "auto", bgcolor: "#fff" }}
      >
        <Typography variant="h4" sx={{ mb: 3, textAlign: "center", color: "primary.main" }}>
          الملف الشخصي
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ mb: 2 }}>
          تغيير كلمة المرور
        </Typography>

        {successMsg && <Alert severity="success" sx={{ mb: 2 }}>{successMsg}</Alert>}
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="password"
            label="كلمة المرور الحالية"
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="كلمة المرور الجديدة"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="تأكيد كلمة المرور الجديدة"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />

          <Button fullWidth type="submit" variant="contained" color="primary">
            حفظ التغييرات
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
