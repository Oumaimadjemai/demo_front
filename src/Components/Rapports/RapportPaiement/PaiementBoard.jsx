import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  TableContainer,
  Paper,
  Grid,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import axios from "../../../api/axiosInstance";

export default function PaymentDashboard() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("الكل");
  const [rows, setRows] = useState([]);
  const [messages, setMessages] = useState([]); // <-- success/error messages

  const [selectedYear, setSelectedYear] = useState("الكل");
  const currentMonthIndex = new Date().getMonth(); // 0=Jan, 11=Dec
  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex);

  const lockedStatus = ["suspendu", "perdu", "banque_bloquee"];

  const arabicMonths = [
    "",
    "جانفي",
    "فيفري",
    "مارس",
    "أفريل",
    "ماي",
    "جوان",
    "جويلية",
    "أوت",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];

  const mapArabicToStatus = (arabicStatus) => {
    switch (arabicStatus) {
      case "مدفوع":
        return "paid";
      case "قيد الانتظار":
        return "pending";
      case "غير مدفوع":
        return "unpaid";
      default:
        return "";
    }
  };

  const fileInputRef = useRef(null);

  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/vente/vente/import-paiements-txt/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessages([
        { type: "success", text: "تم تحميل الملف بنجاح" },
      ]);

      // Optionnel : refresh table data ici
    } catch (err) {
      setMessages([
        {
          type: "error",
          text: err.response?.data || err.message || "Erreur inconnue",
        },
      ]);
    } finally {
      event.target.value = null;
    }
  };

  const isClientLocked = (clientStatus) => lockedStatus.includes(clientStatus);

  // --- Fetch rows (table data) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsRes = await axios.get("/auth/clients/");
        const clients = clientsRes.data.results || [];
        let allRows = [];

        for (let client of clients) {
          const ventesRes = await axios.get(
            `/vente/ventes-facilite/?client=${client.id}`
          );
          const ventes = ventesRes.data.ventes || [];

          for (let v of ventes) {
            const payerRes = await axios.get(`/vente/vente/payer/${v.id}/`);
            const venteDetail = payerRes.data[0] || v;

            const filteredPaiements = (venteDetail.paiements || []).filter(
              (p) => {
                const matchesYear =
                  selectedYear === "الكل" ||
                  new Date(p.date_paiement).getFullYear() ===
                    parseInt(selectedYear);

                const matchesMonth =
                  selectedMonth === "الكل" ||
                  p.month_index === parseInt(selectedMonth);

                const matchesStatus =
                  status === "الكل" || p.status === mapArabicToStatus(status);

                return matchesYear && matchesMonth && matchesStatus;
              }
            );

            if (filteredPaiements.length === 0) continue;

            let rowStatus = "مدفوع";
            if (filteredPaiements.some((p) => p.status === "pending"))
              rowStatus = "قيد الانتظار";
            if (filteredPaiements.some((p) => p.status === "unpaid"))
              rowStatus = "غير مدفوع";

            const restant = parseFloat(venteDetail.reste_vente || 0);

            const allPaymentDates = filteredPaiements
              .map((p) => new Date(p.date_paiement).toLocaleDateString("fr-FR"))
              .join(" , ");

            allRows.push({
              name: `${client.nom_famille_ar} ${client.prenom_ar}`,
              account: `${client.ccp || ""}/${client.cle || ""}`,
              date: allPaymentDates,
              year: new Date(venteDetail.date_debut).getFullYear(),
              month_index: filteredPaiements[0].month_index,
              amount: parseFloat(venteDetail.montant_mensuel || 0),
              pending: restant,
              status: rowStatus,
              clientStatus: client.statut,
              montant_mois: (venteDetail.montant_par_mois || []).join(", "),
            });
          }
        }

        setRows(allRows);
      } catch (err) {
        setMessages([
          {
            type: "error",
            text: err.response?.data || err.message || "Erreur de chargement",
          },
        ]);
      }
    };

    fetchData();
  }, [selectedYear, selectedMonth, status]);

  const filteredRows = rows.filter((row) =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = filteredRows.reduce((acc, row) => acc + row.amount, 0);

  const statusTotals = {
    مدفوع: { count: 0, amount: 0 },
    "قيد الانتظار": { count: 0, amount: 0 },
    "غير مدفوع": { count: 0, amount: 0 },
  };

  filteredRows.forEach((row) => {
    const st = row.status;
    if (statusTotals[st]) {
      statusTotals[st].count += 1;
      statusTotals[st].amount += row.amount;
    }
  });

  const getStatusColor = (st) => {
    if (st === "مدفوع") return "green";
    if (st === "قيد الانتظار") return "orange";
    return "red";
  };

  const getCardColor = (st) => {
    if (st === "مدفوع") return "#4caf50";
    if (st === "قيد الانتظار") return "#ff9800";
    return "#f44336";
  };

  const uniqueYears = [
    "الكل",
    ...Array.from(new Set(rows.map((row) => row.year).filter(Boolean))),
  ];

  const allMonths = Array.from({ length: 12 }, (_, i) => i);

  return (
    <Box p={2}>
      <Card>
        <CardContent>
          {/* Upload / Search Controls */}
          <Grid container spacing={2} alignItems="center" mb={2}>
            <Grid item>
              <TextField
                placeholder="بحث"
                size="small"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>

            <Grid item>
              <FormControl size="small">
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="الكل">الكل</MenuItem>
                  <MenuItem value="مدفوع">مدفوع</MenuItem>
                  <MenuItem value="قيد الانتظار">قيد الانتظار</MenuItem>
                  <MenuItem value="غير مدفوع">غير مدفوع</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item>
              <FormControl size="small">
                <Select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {uniqueYears.map((y, idx) => (
                    <MenuItem key={idx} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item>
              <FormControl size="small">
                <Select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <MenuItem value="الكل">الكل</MenuItem>
                  {allMonths.map((m) => (
                    <MenuItem key={m} value={m}>
                      {arabicMonths[m + 1]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item>
              <Typography variant="h5">{totalAmount} دج</Typography>
            </Grid>

            <Grid item sx={{ ml: "auto" }}>
              {/* <Button variant="contained" sx={{ bgcolor: "green", color: "white" }}>
                Excel
              </Button> */}
              <Button
                variant="contained"
                sx={{ color: "white", ml: 2 }}
                onClick={handleFileUploadClick}
              >
                تحميل ملف البريد
              </Button>
              <input
                type="file"
                accept=".txt"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </Grid>
          </Grid>

          {/* Messages Cards (success/error) */}
          
            {messages.map((msg, idx) => (
              
                <Card
                  sx={{
                    bgcolor: msg.type === "success" ? "#4caf50" : "#f44336",
                    color: "white",
                    borderRadius: 1,
                    width:"100%"
                  }}
                  
                >
                  <CardContent>
                    <Typography variant="body1" sx={{textAlign:"center"}}>{msg.text}</Typography>
                  </CardContent>
                </Card>
             
            ))}
          

          {/* Status Totals Cards */}
          <Grid container spacing={2} mt={2}>
            {Object.entries(statusTotals).map(([statusLabel, info]) => (
              <Grid item key={statusLabel}>
                <Card
                  sx={{
                    minWidth: 307,
                    bgcolor: getCardColor(statusLabel),
                    color: "white",
                    borderRadius: 1,
                  }}
                >
                  <CardContent sx={{ py: 1, px: 1 }}>
                    <Typography variant="subtitle1" align="center">
                      {statusLabel}
                    </Typography>
                    <Typography variant="body2" align="center">
                      عدد: {info.count}
                    </Typography>
                    <Typography variant="body2" align="center">
                      المجموع: {info.amount} دج
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Table */}
          <TableContainer component={Paper} sx={{ maxHeight: 500, overflowY: "auto", mt: 2 }}>
            <Table stickyHeader size="medium">
              <TableHead>
                <TableRow>
                  <TableCell>الاسم و اللقب</TableCell>
                  <TableCell>رقم الحساب</TableCell>
                  <TableCell>التاريخ</TableCell>
                  <TableCell>القسط الشهري</TableCell>
                  <TableCell>الأقساط</TableCell>
                  <TableCell>موقوف</TableCell>
                  <TableCell>الحالة</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.account}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.amount}</TableCell>
                    <TableCell>{row.montant_mois}</TableCell>
                    <TableCell align="center">
                      {isClientLocked(row.clientStatus) && <LockIcon sx={{ color: "red" }} />}
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          bgcolor: getStatusColor(row.status),
                          color: "white",
                          px: 1,
                          py: 0.3,
                          borderRadius: "4px",
                          fontSize: "0.85rem",
                        }}
                      >
                        {row.status}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
