import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import axios from "../../api/axiosInstance";

export default function ChangePasswordDialog({
  open,
  onClose,
  userId,
  fetchUser,
}) {
  const [newPassword, setNewPassword] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const handleChangePassword = () => {
    if (!newPassword) return;

    axios
      .post(
        `auth/admin/change-password/`,
        { user_id: userId, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
      .then(() => {
        setSuccessOpen(true); // Show success alert
        setNewPassword("");
        fetchUser();
        onClose();
      })
      .catch((err) => {
        console.error("Erreur de modification du mot de passe :", err);
      });
  };

  return (
    <>
      <Dialog 
  open={open} 
  onClose={onClose} 
  maxWidth="xs" 
  fullWidth
  PaperProps={{
    sx: { borderRadius: 3, p: 1 } // Rounded dialog
  }}
>
  <DialogTitle
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      pb: 0,
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
      تغيير كلمة المرور
    </Typography>
    <IconButton onClick={onClose} size="small">
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent
    sx={{
      pt: 2,
      pb: 1,
    }}
  >
    <TextField
      label="كلمة المرور الجديدة"
      fullWidth
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      sx={{
        "& .MuiOutlinedInput-root": { borderRadius: 2 },
        mt: 1,
      }}
    />
  </DialogContent>

  <DialogActions
    sx={{
      px: 3,
      pb: 2,
      justifyContent: "flex-end",
    }}
  >
    <Button 
      onClick={onClose} 
      variant="outlined" 
      sx={{ borderRadius: 2 }}
    >
      إلغاء
    </Button>
    <Button 
      variant="contained" 
      onClick={handleChangePassword} 
      sx={{ borderRadius: 2 }}
    >
      حفظ
    </Button>
  </DialogActions>
</Dialog>


      {/* ✅ Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          onClose={() => setSuccessOpen(false)}
          variant="filled"
          sx={{ width: "100%" }}
        >
          ✅ تم تغيير كلمة المرور بنجاح!
        </Alert>
      </Snackbar>
    </>
  );
}
