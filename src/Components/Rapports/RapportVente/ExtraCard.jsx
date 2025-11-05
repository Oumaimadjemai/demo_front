import { Card, CardContent, Typography } from "@mui/material";

export default function ExtraCard({ data }) {
  const salesSummary = {
    totalSales: 38076800,
    cashPayments: 779300,
    totalProfit: 10374745,
    profitPercentage: 47,
    expenses: 5731500,
    salesCount: 487,
  };
  return (
    <>
      <Card
        sx={{
          mb: 2,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CardContent>
          <Typography variant="h4" textAlign={"center"}>
            المبيعات كاش
          </Typography>
          <Typography variant="h3" textAlign={"center"}>
            {(data.total_montant ?? 0)}
          </Typography>
          <Typography variant="h4" textAlign={"center"}>
            المبيعات بالتقسيط
          </Typography>
          <Typography variant="h3" textAlign={"center"}>
            {(data.total_montant_total ?? 0)}
          </Typography>

          <Typography variant="h4" textAlign={"center"}>
            الدفعات النقدية
          </Typography>
          <Typography variant="h3" textAlign={"center"}>
            {(data.total_montant_verse ?? 0)}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
