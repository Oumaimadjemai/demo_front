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
} from "@mui/material";

export default function DetailTable({ rows }) {
  return (
    <TableContainer
      component={Paper}
      sx={{ width: "99%", m: 1, maxHeight: "80vh", overflowY: "auto" }}
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
            <TableCell align="right">
              <Typography fontWeight="bold">الباركود</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.reference}</TableCell>
              <TableCell align="right">{row.nom}</TableCell>
              <TableCell align="right">
                {row.prix_vente_facilite}
              </TableCell>
              <TableCell align="right">{row.quantite}</TableCell>
              <TableCell align="right">
                {row.magasin_nom || row.magasin}
              </TableCell>
              <TableCell align="right">{row.total}</TableCell>
              <TableCell align="right">
                <Typography
                  sx={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
                >
                  {Array.isArray(row.codebarre)
                    ? row.codebarre.join(", ")
                    : row.codebarre}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
