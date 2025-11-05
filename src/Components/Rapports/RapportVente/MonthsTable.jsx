import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function MonthsTable() {
  const monthlyStats = [
    { month: "أوت ", sales: 2748900, profit: 1121281, profitPct: 7 },
    { month: "أوت", sales: 1806800, profit: 798600, profitPct: 5 },
   
  ];
  return (
    <>
      <Card>
        {/* <Typography variant="h5" color="error" sx={{ml:2}}>still don't understand it!!!</Typography> */}
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>الشهر</TableCell>
                <TableCell>ن ف</TableCell>
                <TableCell>الفائدة</TableCell>
                <TableCell>المبيعات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthlyStats.map((m, i) => (
                <TableRow key={i}>
                  <TableCell>{m.month}</TableCell>
                  <TableCell>{m.profitPct} %</TableCell>
                  <TableCell>{m.profit}</TableCell>
                  <TableCell>{m.sales}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
