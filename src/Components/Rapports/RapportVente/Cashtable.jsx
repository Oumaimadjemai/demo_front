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

export default function VersementTable({ userPayments }) {
  // ✅ Filtrer les utilisateurs ayant versé quelque chose
  const filteredPayments = userPayments.filter(
    (u) => u.total_montant_verse > 0
  );

  return (
    <Card sx={{ mb: 2 }}>
      <Typography variant="h5" sx={{ ml: 3, mt: 1 }}>
        الدفع نقدا
      </Typography>

      <CardContent>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>المستخدم</TableCell>
              <TableCell>مبيعات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.map((u, i) => (
              <TableRow key={i}>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.total_montant_verse}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
