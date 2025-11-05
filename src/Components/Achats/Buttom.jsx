import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Buttom({ rows, setRows, showDelete = true }) {
  const handleDelete = (id) => {
    if (!setRows) return; // safety check
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ width: "99%", mt: 2, ml: 1, height: "350px" }}
    >
      <Table aria-label="receipt table">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell align="right">
              <Typography fontWeight="bold">الرقم</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography fontWeight="bold">المرجع</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography fontWeight="bold">الإسم</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography fontWeight="bold">السعر</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography fontWeight="bold">الكمية</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography fontWeight="bold">المحل</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography fontWeight="bold">المجموع</Typography>
            </TableCell>
            {showDelete && (
              <TableCell align="center">
                <Typography fontWeight="bold">حذف</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
           <TableRow key={row.id}>
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.reference}</TableCell>
              <TableCell align="right">{row.nom}</TableCell>
             <TableCell align="right">{Number(row.prix_achat).toFixed(0)}</TableCell>

              <TableCell align="right">{row.quantite}</TableCell>
              <TableCell align="right">
                {row.magasin_nom || row.magasin}
              </TableCell>
              <TableCell align="right">{Number(row.total).toFixed(0)}</TableCell>

              {showDelete && setRows && (
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(row.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
