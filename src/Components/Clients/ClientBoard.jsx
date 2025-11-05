import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useState, useEffect, useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

import axios from "../../api/axiosInstance";

import AddClient from "./AddClient";
import ClientTable from "./ClientTable";
import FilterPanel from "./FilterPanel";
import EditClient from "./EditClient";
import ExtraCard from "./ExtraCard";

export default function ClientBoard() {
  const [openAddClientDialog, setOpenAddClientDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState([]);
  const [openExcelDialog, setOpenExcelDialog] = useState(false);
  const [excelFile, setExcelFile] = useState(null);
  const [totalClients,setTotalClients]=useState(0)

  // 🔹 Filter state
  const [filters, setFilters] = useState({
    statut: "all",
  });

  const statutChoices = [
    { value: "all", label: "الكل" },
    { value: "non_classifie", label: "غير مصنف" },
    { value: "sous_suivi", label: "قيد المتابعة" },
    { value: "recuperation", label: "قيد الإسترجاع" },
    { value: "investigation", label: "قيد التحقيق" },
    { value: "suspendu", label: "موقوف مؤقتا" },
    { value: "perdu", label: "معدوم" },
    { value: "cash_only", label: "تسديد نقدا" },
    { value: "banque_bloquee", label: "مغلق من البنك" },
  ];

  const filterConfig = [
    {
      name: "statut",
      label: "حالة الزبون",
      options: statutChoices,
    },
  ];

  const fetchClient = async (search = "", statut = "all") => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    };

    let url = "auth/clients/";
    const params = [];
    if (search) params.push(`search=${search}`);
    if (statut !== "all") params.push(`statut=${statut}`);
    if (params.length > 0) url += `?${params.join("&")}`;

    try {
      const res = await axios.get(url, { headers });
      setTotalClients(res.data.count);
      const clients = res.data.results;

      // Fetch stats for all clients in parallel
      const clientsWithStats = await Promise.all(
        clients.map(async (client) => {
          try {
            const statsRes = await axios.get(
              `vente/ventes-facilite/?client=${client.id}`,
              { headers }
            );
            const stats = statsRes.data;

            return {
              ...client,
              dette_totale_client: stats.ventes?.[0]?.dette_totale_client || 0,
              dette_actuelle_client:
                stats.ventes?.[0]?.dette_actuelle_client || 0,
              montant_verse: stats.ventes?.[0]?.montant_verse || 0,
              last_payment_date: stats.ventes?.[0]?.last_payment_date || null,
              date_fin: stats.ventes?.[0]?.date_fin || null,
              date_debut: stats.ventes?.[0]?.date_debut || null,
              montant_paye_effectif:
                stats.ventes?.[0]?.montant_paye_effectif || 0,
            };
          } catch (error) {
            return {
              ...client,
              dette_totale_client: 0,
              dette_actuelle_client: 0,
              montant_verse: 0,
              last_payment_date: null,
              date_fin: null,
              date_debut: null,
              montant_paye_effectif: 0,
            };
          }
        })
      );

      setRows(clientsWithStats.sort((a, b) => b.id - a.id)); // 🔹 Descending by ID
    } catch (err) {
      console.error("Erreur lors du chargement des utilisateurs :", err);
    }
  };

  useEffect(() => {
    fetchClient(); // Initial load
  }, []);

  // 🔹 Combined search & filter debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchClient(searchTerm, filters.statut);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filters.statut]);

  const handleEditClick = (client) => {
    setSelectedClient(client);
    setOpenEditDialog(true);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Calculate totals using useMemo
  const totals = useMemo(() => {
    // const totalClients = rows.length;
    const totalDette = rows.reduce(
      (sum, row) => sum + (Number(row.dette_actuelle_client) || 0),
      0
    );
    const totalPaye = rows.reduce(
      (sum, row) => sum + (Number(row.montant_paye_effectif) || 0),
      0
    );
    return { totalClients, totalDette, totalPaye };
  }, [rows]);

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 4, mt: 4 }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <TextField
            variant="outlined"
            placeholder="ابحث عن زبون..."
            sx={{ width: "300px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <FilterPanel
            filters={filterConfig}
            values={filters}
            onChange={handleFilterChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={{ width: "120px", height: "55px" }}
            onClick={() => setOpenAddClientDialog(true)}
          >
            إضافة زبون
          </Button>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={{ width: "120px", height: "55px", bgcolor: "green" }}
            onClick={() => setOpenExcelDialog(true)}
          >
            Excel
          </Button>
        </Stack>
      </Stack>

<ExtraCard
  data={{
    totalClients: totals.totalClients,
    totalDette: totals.totalDette,
    totalPaye: totals.totalPaye,
  }}
/>

      <ClientTable rows={rows} setRows={setRows} onEditClick={handleEditClick} />

      {/* Dialogs */}
      <Dialog
        open={openAddClientDialog}
        onClose={() => setOpenAddClientDialog(false)}
        maxWidth="lg"
        fullWidth
      >
          <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenAddClientDialog(false)}
              sx={{ color: (theme) => theme.palette.error.main }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              sx={{ ml: "10px" }}
              color="primary"
            >
              إضافة زبون
            </Typography>
          </Box>
        </DialogTitle>
        <AddClient
          setOpenAddClientDialog={setOpenAddClientDialog}
          fetchClient={fetchClient}
        />
      </Dialog>

      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="xl"
        fullWidth
      >
         <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenEditDialog(false)}
              sx={{ color: (theme) => theme.palette.error.main }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              sx={{ ml: "10px" }}
              color="primary"
            >
              تعديل معلومات الزبون
            </Typography>
          </Box>
        </DialogTitle>
        <EditClient
          selectedClient={selectedClient}
          setOpenEditDialog={setOpenEditDialog}
          setRows={setRows}
          fetchClient={fetchClient}
        />
      </Dialog>

      <Dialog
        open={openExcelDialog}
        onClose={() => setOpenExcelDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenExcelDialog(false)}
              sx={{ color: (theme) => theme.palette.error.main }}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h5" component="div" color="primary">
              استيراد / تصدير Excel
            </Typography>
          </Box>
        </DialogTitle>

        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              axios
                .get("auth/clients/export-excel/", {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "access_token"
                    )}`,
                  },
                  responseType: "blob",
                })
                .then((res) => {
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "clients.xlsx");
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                })
                .catch((err) => console.error("Erreur exportation :", err));
            }}
          >
            📤 تصدير الزبائن
          </Button>

          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setExcelFile(e.target.files[0])}
          />

          <Button
            variant="contained"
            color="secondary"
            disabled={!excelFile}
            onClick={() => {
              const formData = new FormData();
              formData.append("file", excelFile);

              axios
                .post("auth/clients/import-excel/", formData, {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                      "access_token"
                    )}`,
                    "Content-Type": "multipart/form-data",
                  },
                })
                .then(() => {
                  fetchClient();
                  setExcelFile(null);
                  setOpenExcelDialog(false);
                })
                .catch((err) => {
                  console.error("Erreur importation :", err);
                });
            }}
          >
            📥 استيراد من Excel
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
