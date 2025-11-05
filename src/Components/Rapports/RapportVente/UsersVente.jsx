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

export default function UsersVente({ userPayments }) {
  // ✅ Filtrer pour n'afficher que les utilisateurs avec ventes > 0
  const filteredUsers = userPayments.filter(
    (m) => m.total_montant_total > 0
  );

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" sx={{ ml: 2 }}>
          المستخدمين
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>المستخدم</TableCell>
              <TableCell>ن ف</TableCell>
              <TableCell>الفائدة</TableCell>
              <TableCell>المبيعات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((m, i) => (
              <TableRow key={i}>
                <TableCell>{m.username}</TableCell>
                <TableCell>{m.pourcentage_benefice_total} %</TableCell>
                <TableCell>{m.benefice_total}</TableCell>
                <TableCell>
                  {m.total_montant_total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
