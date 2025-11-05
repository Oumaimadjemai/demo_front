import React, { useState, useEffect } from "react";
import {
  Paper,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import axios from "../../../api/axiosInstance";
import dayjs from "dayjs";

export default function MatrixTable() {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  const currentYear = dayjs().year();
  const [rows, setRows] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [selectedStatus, setSelectedStatus] = useState("pending");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [yearFilter, setYearFilter] = useState(currentYear);
  const [availableYears, setAvailableYears] = useState([currentYear]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/vente/ventes-facilite/");
      const ventes = Array.isArray(res.data) ? res.data : res.data.ventes || [];
      const venteIds = ventes.map((v) => v.vente_id ?? v.id);

      const details = await Promise.all(
        venteIds.map(async (id) => {
          try {
            const detailRes = await axios.get(`/vente/vente/payer/${id}/`);
            return Array.isArray(detailRes.data)
              ? detailRes.data[0]
              : detailRes.data;
          } catch {
            return null;
          }
        })
      );

      let yearsSet = new Set([currentYear]);

      const preparedRows = details
        .filter((vente) => vente)
        .map((vente) => {
          const montantMensuel = Number(vente.montant_mensuel);
          const startMonth = dayjs(vente.date_debut).month();
          const startYear = dayjs(vente.date_debut).year();

          const values = Array(12).fill(null);
          const moisStatus = Array(12).fill(null);
          const moisYears = Array(12).fill(null);

          for (let i = 0; i < vente.nombre_mois; i++) {
            const globalIndex = startMonth + i;
            const year = startYear + Math.floor(globalIndex / 12);
            const monthIndex = globalIndex % 12;

            values[monthIndex] = montantMensuel;
            moisStatus[monthIndex] = "pending";
            moisYears[monthIndex] = year;
            yearsSet.add(year);
          }

          if (Array.isArray(vente.paiements)) {
            vente.paiements.forEach((p) => {
              const idx = p.month_index;
              if (idx >= 0 && idx < 12) {
                moisStatus[idx] = p.status;
              }
            });
          }

          return {
            vente_id: vente.vente_id ?? vente.id,
            name: `${vente.client_detail.nom_famille_ar} ${vente.client_detail.prenom_ar}`,
            account: vente.client_detail.ccp,
            values,
            mois_status: moisStatus,
            mois_years: moisYears,
            paiements: vente.paiements || [],
          };
        });

      setAvailableYears(Array.from(yearsSet).sort((a, b) => b - a));
      setRows(preparedRows);
    } catch (err) {
      console.error("Error fetching ventes:", err);
    }
  };

  const getColor = (status) => {
    switch (status) {
      case "paid": return "green";
      case "pending": return "orange";
      case "unpaid": return "red";
      default: return "transparent";
    }
  };

  const handleCellClick = (rowIndex, colIndex) => {
    if (!rows[rowIndex].values[colIndex]) return;

    setSelectedCell({ row: rowIndex, col: colIndex });

    const paiement = rows[rowIndex].paiements.find(
      (p) => p.month_index === colIndex
    );

    setSelectedStatus(paiement ? paiement.status : "pending");
    setDialogOpen(true);
  };

  const handleStatusChange = (event, newStatus) => {
    if (newStatus) setSelectedStatus(newStatus);
  };

  const handleSaveStatus = async () => {
    const { row, col } = selectedCell;
    const venteId = rows[row].vente_id;
    const montant = rows[row].values[col];

    const paiement = rows[row].paiements.find(
      (p) => p.month_index === col && p.id
    );

    try {
      if (paiement) {
        await axios.patch(`/vente/vente/payer/${paiement.id}/`, {
          status: selectedStatus,
        });
      } else {
        await axios.post(`/vente/vente/payer/${venteId}/`, {
          montant,
          month: col,
          status: selectedStatus,
        });
      }
      await fetchData();
    } catch (err) {
      console.error("Error saving status:", err);
    }

    setDialogOpen(false);
  };

  const filteredRows = rows.filter((row) => {
    const searchOk =
      searchQuery === "" ||
      row.name.includes(searchQuery) ||
      row.account?.includes(searchQuery);

    const statusOk =
      statusFilter === "all" || row.mois_status.some((s) => s === statusFilter);

    const yearOk = row.mois_years.some((y) => y === yearFilter);

    return searchOk && statusOk && yearOk;
  });

  return (
    <Box sx={{ bgcolor: "#f0f0f0", minHeight: "100vh", p: 1 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="بحث عن زبون"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ m: 2 }}
        />

        <FormControl size="small" sx={{ width: "150px", m: 2 }}>
          <InputLabel>الحالة</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">الكل</MenuItem>
            <MenuItem value="paid">مدفوع</MenuItem>
            <MenuItem value="pending">معلق</MenuItem>
            <MenuItem value="unpaid">غير مدفوع</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: "150px", m: 2 }}>
          <InputLabel>السنة</InputLabel>
          <Select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            {availableYears.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Paper sx={{ width: "100%", overflowX: "auto" }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#ccc" }}>
            <TableRow>
              <TableCell>الاسم و اللقب</TableCell>
              <TableCell>رقم الحساب</TableCell>
              {months.map((month) => (
                <TableCell key={month} align="center">{month}</TableCell>
              ))}
              <TableCell>غ م</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={15} align="center">
                  لا توجد بيانات
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, rowIndex) => {
                const unpaidThisYear = row.mois_status.filter(
                  (s, i) =>
                    s === "unpaid" &&
                    row.mois_years[i] === yearFilter
                ).length;

                return (
                  <TableRow key={row.vente_id}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.account}</TableCell>

                    {row.values.map((val, colIndex) => {
                      const cellStatus = row.mois_status[colIndex];
                      const cellYear = row.mois_years[colIndex];

                      if (!val || cellYear !== yearFilter ||
                        (statusFilter !== "all" && cellStatus !== statusFilter)
                      ) {
                        return <TableCell key={colIndex} align="center"></TableCell>;
                      }

                      return (
                        <TableCell
                          key={colIndex}
                          align="center"
                          sx={{
                            bgcolor: getColor(cellStatus),
                            color: cellStatus === "unpaid" || cellStatus === "paid" ? "white" : "black",
                            fontWeight: val ? "bold" : "normal",
                            cursor: val ? "pointer" : "default",
                          }}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                          {val ?? ""}
                        </TableCell>
                      );
                    })}

                    <TableCell align="center">{unpaidThisYear}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>تغيير حالة الدفع</DialogTitle>
        <DialogContent>
          <ToggleButtonGroup
            value={selectedStatus}
            exclusive
            onChange={handleStatusChange}
            sx={{ mt: 2 }}
          >
            <ToggleButton value="pending">معلق</ToggleButton>
            <ToggleButton value="paid" sx={{ color: "green" }}>مدفوع</ToggleButton>
            <ToggleButton value="unpaid" sx={{ color: "red" }}>غير مدفوع</ToggleButton>
          </ToggleButtonGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleSaveStatus} variant="contained" color="primary">
            حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
