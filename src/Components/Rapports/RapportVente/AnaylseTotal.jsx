import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from "@mui/material";

export default function AnalyseTotal({data}) {
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
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" align="center">
             عدد المبيعات بالتقسيط: {data.total_ventes} 
          </Typography>
          <Typography variant="h6" align="center">
            عدد المبيعات كاش: {data.nombre_de_ventes} 
          </Typography>
          <Typography align="center">
            مجموع الفائدة: {data.benefice_total}
          </Typography>
          <Box mt={1} mb={1}>
            <Typography align="center">
              نسبة الفائدة {data.pourcentage_benefice_total} %
            </Typography>
            <LinearProgress
              variant="determinate"
              value={data.pourcentage_benefice_total}
              sx={{ height: 8, borderRadius: 2 }}
            />
          </Box>
          <Typography align="center">
            مجموع المصاريف: {data.total_montant_depense}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}
