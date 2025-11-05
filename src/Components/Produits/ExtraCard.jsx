import { Box, Typography, Grid } from "@mui/material";

export default function ExtraCard({ data }) {
  if (!data) return null;

  return (
    <Box sx={{
      width: "90%",
      mb: 2,
      p: 2,
      backgroundColor: "transparent", // Remove background
      display: "flex",
      flexDirection: { xs: "column", sm: "row" }, // Column on mobile, row on desktop
      gap: 3, // Space between items
      alignItems: "center",
      justifyContent: "space-between"
    }}>
      <Box sx={{ textAlign: "center", flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          الكمية الإجمالية
        </Typography>
        <Typography variant="h5" color="secondary">
          {data.quantite}
        </Typography>
      </Box>

      <Box sx={{ 
        height: { xs: "1px", sm: "40px" }, // Horizontal divider on mobile, vertical on desktop
        width: { xs: "100%", sm: "1px" },
        backgroundColor: "divider",
        my: { xs: 1, sm: 0 }
      }} />

      <Box sx={{ textAlign: "center", flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          قيمة المنتجات
        </Typography>
        <Typography variant="h5" color="secondary">
          {data.valeur_des_produits} د.ج
        </Typography>
      </Box>

      <Box sx={{ 
        height: { xs: "1px", sm: "40px" },
        width: { xs: "100%", sm: "1px" },
        backgroundColor: "divider",
        my: { xs: 1, sm: 0 }
      }} />

      <Box sx={{ textAlign: "center", flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          رأس المال
        </Typography>
        <Typography variant="h5" color="secondary">
          {data.capital} د.ج
        </Typography>
      </Box>
    </Box>
  );
}