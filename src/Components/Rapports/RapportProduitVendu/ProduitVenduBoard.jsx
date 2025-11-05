import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "../../../api/axiosInstance";
import FilterPanel from "../../Clients/FilterPanel";
import dayjs from "dayjs";

export default function SalesReport() {
  const [filters, setFilters] = useState({
    periode: "today",
    date_from: null,
    date_to: null,
    magasins: "",
  });
  const [magasins, setMagasins] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Build query params from filters
  const buildParams = (appliedFilters) => {
    let fromDate = appliedFilters.date_from;
    let toDate = appliedFilters.date_to;

    if (fromDate && toDate && dayjs(fromDate).isAfter(dayjs(toDate))) {
      [fromDate, toDate] = [toDate, fromDate];
    }

    const params = {
      periode: appliedFilters.periode || "",
      magasin: appliedFilters.magasins || "",
      date_from: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : "",
      date_to: toDate ? dayjs(toDate).format("YYYY-MM-DD") : "",
    };

    // Remove empty params
    Object.keys(params).forEach(
      (key) => (params[key] === "" || params[key] === null) && delete params[key]
    );

    return params;
  };

  // 🔹 Fetch sold quantity separated (facilité & cash) for a given product
  const getQuantitesVente = async (produitId) => {
    const params = buildParams(filters);

    try {
      const [faciliteRes, cashRes] = await Promise.all([
        axios.get(`/vente/ventes-facilite/?produit=${produitId}`, { params }),
        axios.get(`/vente/liste/?produit=${produitId}`, { params }), // endpoint cash
      ]);

      const qFacilite = faciliteRes.data?.quantite_vendue_produit ?? 0;
      const qCash = cashRes.data?.quantite_vendue_produit ?? 0;

      return { qFacilite, qCash };
    } catch (err) {
      console.error(`Error fetching ventes for produit ${produitId}:`, err);
      return { qFacilite: 0, qCash: 0 };
    }
  };

  // ✅ Fetch magasins for dropdown
  useEffect(() => {
    const fetchMagasins = async () => {
      try {
        const res = await axios.get("/param/magasins/");
        setMagasins(res.data.results);
      } catch (err) {
        console.error("Erreur lors du chargement des magasins", err);
      }
    };
    fetchMagasins();
  }, []);

  // ✅ Fetch data when filters change
useEffect(() => {
  async function fetchData() {
    setLoading(true);
    try {
      const params = buildParams(filters);

      // 🔹 fetch produits with filters directly
      const produitRes = await axios.get("/prod/produits/", { params });
      const produits = produitRes.data.results || produitRes.data;

      let formattedRows = await Promise.all(
        produits.map(async (prod) => {
          const { qFacilite, qCash } = await getQuantitesVente(prod.id);

          return {
            id: prod.id,
            reference: prod.famille || "بدون",
            name: prod.nom,
            qFacilite,
            qCash,
            magasin: prod.magasin_detail?.nom || "غير محدد", // display name
            magasinId: prod.magasin_detail?.id || null,       // filter id
            quantiteActuelle: prod.quantite || 0,
          };
        })
      );

      formattedRows = formattedRows.sort((a, b) => b.id - a.id);

      setRows(formattedRows);
    } catch (err) {
      console.error("Error fetching produits or ventes:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [filters, magasins]);

  return (
    <>
      {/* 🔹 Filters Section */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2, mt: 2 }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="من تاريخ"
              value={filters.date_from}
              onChange={(newValue) =>
                setFilters((prev) => ({ ...prev, date_from: newValue }))
              }
              format="YYYY-MM-DD"
              sx={{ width: 200 }}
            />
            <DatePicker
              label="إلى تاريخ"
              value={filters.date_to}
              onChange={(newValue) =>
                setFilters((prev) => ({ ...prev, date_to: newValue }))
              }
              format="YYYY-MM-DD"
              sx={{ width: 200 }}
            />
          </LocalizationProvider>

          <FilterPanel
            filters={[
              {
                name: "periode",
                label: "الفترة",
                options: [
                  { value: "", label: "الكل" },
                  { value: "yesterday", label: "الامس" },
                  { value: "today", label: "اليوم" },
                  { value: "this_week", label: "هذا الأسبوع" },
                  { value: "this_month", label: "هذا الشهر" },
                  { value: "last_month", label: "الشهر الماضي" },
                  { value: "this_year", label: "هذا العام" },
                ],
              },
              {
                name: "magasins",
                label: "المحل",
                options: [
                  { value: "", label: "الكل" },
                  ...magasins.map((m) => ({
                    value: m.id,
                    label: m.nom,
                  })),
                ],
              },
            ]}
            values={filters}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Stack>
      </Stack>

      {/* 🔹 Table Section */}
      <Box sx={{ display: "flex", flexDirection: "row", height: "100vh" }}>
        <Box sx={{ flex: 3, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ bgcolor: "primary.main", p: 1 }}>
            <Typography variant="h6" align="center" color="white">
              تقرير السلع
            </Typography>
          </Box>

          <TableContainer component={Paper} sx={{ flex: 1 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>الرقم</TableCell>
                  <TableCell>المرجع</TableCell>
                  <TableCell>الاسم</TableCell>
                  <TableCell>المحل</TableCell>
                  <TableCell>الكمية الحالية</TableCell>
                  <TableCell
                    sx={{ bgcolor: "yellow", fontWeight: "bold", padding: 0 }}
                    align="center"
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        width: "100%",
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          borderRight: "1px solid black",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        كاش
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                        }}
                      >
                        تقسيط
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      جاري التحميل...
                    </TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      لا توجد بيانات
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.reference}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.magasin}</TableCell>
                      <TableCell>{row.quantiteActuelle}</TableCell>
                      <TableCell
                        sx={{
                          bgcolor: "yellow",
                          fontWeight: "bold",
                          textAlign: "center",
                          padding: 0,
                        }}
                      >
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              borderRight: "1px solid black",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                            }}
                          >
                            {row.qCash}
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: "100%",
                            }}
                          >
                            {row.qFacilite}
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </>
  );
}
