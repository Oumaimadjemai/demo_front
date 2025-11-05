import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function ConfirmationDialog({
  open,
  onClose,
  onConfirm,
  text = "هل أنت متأكد من المتابعة؟",
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: "center", color: "primary.main" }}>
        تأكيد العملية
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ textAlign: "right" }}>{text}</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end" }}>
        <Button onClick={onClose} color="inherit">
          إلغاء
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          تأكيد
        </Button>
      </DialogActions>
    </Dialog>
  );
}
