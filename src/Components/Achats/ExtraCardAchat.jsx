import { Box, Typography } from "@mui/material";

export default function ExtraCardAchat({ data }) {
  if (!data) return null;

  return (
    <Box
      sx={{
        width: "90%",
        mb: 2,
        p: 2,
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ textAlign: "center", flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          العدد الإجمالي
        </Typography>
        <Typography variant="h5" color="secondary">
          {data.nombre_achats}
        </Typography>
      </Box>

      <Box
        sx={{
          height: { xs: "1px", sm: "40px" },
          width: { xs: "100%", sm: "1px" },
          backgroundColor: "divider",
          my: { xs: 1, sm: 0 },
        }}
      />

      <Box sx={{ textAlign: "center", flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          المبلغ الإجمالي
        </Typography>
        <Typography variant="h5" color="secondary">
          {data.somme_totale} د.ج
        </Typography>
      </Box>
      
      <Box
        sx={{
          height: { xs: "1px", sm: "40px" },
          width: { xs: "100%", sm: "1px" },
          backgroundColor: "divider",
          my: { xs: 1, sm: 0 },
        }}
      />
      <Box sx={{ textAlign: "center", flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          المبلغ الإجمالي المدفوع
        </Typography>
        <Typography variant="h5" color="secondary">
          {data.somme_payee} د.ج
        </Typography>
      </Box>
      
      <Box
        sx={{
          height: { xs: "1px", sm: "40px" },
          width: { xs: "100%", sm: "1px" },
          backgroundColor: "divider",
          my: { xs: 1, sm: 0 },
        }}
      />
      <Box sx={{ textAlign: "center", flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          المبلغ الإجمالي المتبقي
        </Typography>
        <Typography variant="h5" color="secondary">
          {data.somme_restante} د.ج
        </Typography>
      </Box>
    </Box>
  );
}
