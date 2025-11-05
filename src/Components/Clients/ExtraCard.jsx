import { Box, Typography } from "@mui/material";

export default function ExtraCard({ data }) {
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
        mx: "auto",
      }}
    >
      {/* Total Clients */}
      <Box sx={{ textAlign: "center", flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          إجمالي الزبائن
        </Typography>
        <Typography variant="h5" color="secondary">
          {data.totalClients}
        </Typography>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          height: { xs: "1px", sm: "40px" },
          width: { xs: "100%", sm: "1px" },
          backgroundColor: "divider",
          my: { xs: 1, sm: 0 },
        }}
      />

      {/* Total Debt */}
      <Box sx={{ textAlign: "center", flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          إجمالي الديون
        </Typography>
        <Typography variant="h5" color="error">
          {data.totalDette} د.ج
        </Typography>
      </Box>

      {/* Divider */}
      <Box
        sx={{
          height: { xs: "1px", sm: "40px" },
          width: { xs: "100%", sm: "1px" },
          backgroundColor: "divider",
          my: { xs: 1, sm: 0 },
        }}
      />

      {/* Total Paid */}
      <Box sx={{ textAlign: "center", flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          إجمالي المبالغ المدفوعة
        </Typography>
        <Typography variant="h5" color="success.main">
          {data.totalPaye} د.ج
        </Typography>
      </Box>
    </Box>
  );
}
