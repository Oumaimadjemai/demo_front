import { Card, Typography, Button, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
export default function FeedbackCard({ severity, message, onClose }) {
  const isSuccess = severity === "success";
 

  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(2px)",
      }}
    >
      <Card
        sx={{
          width: 400,
          padding: 4,
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          boxShadow: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ mb: 2 }}>
          {isSuccess ? (
            <CheckCircleIcon sx={{ fontSize: 60, color: "#2e7d32" }} />
          ) : (
            <ErrorOutlineIcon sx={{ fontSize: 60, color: "#d32f2f" }} />
          )}
        </Box>
        <Typography
          variant="h6"
          sx={{ mb: 2, color: isSuccess ? "#2e7d32" : "#d32f2f" }}
        >
          {isSuccess ? "عملية ناجحة" : "خطأ في العملية"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {message}
        </Typography>
        <Button
          variant="contained"
          color={isSuccess ? "success" : "error"}
          onClick={onClose}
        >
          إغلاق
        </Button>
      </Card>
    </Box>
  );
}
