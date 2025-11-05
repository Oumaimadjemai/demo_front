import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import axios from "../../api/axiosInstance";
import FilterPanel from "../Clients/FilterPanel";
import DepenseTable from "./DepenseTable";
import AddDepense from "./AddDepense";

import EditDepense from "./EditDepense";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ExtraCardDepense from "./ExtraCardDepense";

export default function DepenseBoard() {
  const [openAddDepenseDialog, setOpenAddDepenseDialog] = useState(false);
  const [selectedDepense, setSelectedDepense] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type_depense: "",
    mode_paiement: "",
    periode: "this_month",
    date_from: null,
    date_to: null,
  });
  const [totaux, setTotaux] = useState({ total_montant: 0, total_depenses: 0 });

  const handleEditClick = (depense) => {
    console.log("🟡 handleEditClick reçu :", depense);
    setSelectedDepense(depense);
    setOpenEditDialog(true);
  };
  const [rows, setRows] = useState([]);

  const fetchDepense = () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    };

    const params = {
      search: searchQuery,
      ...filters,
    };
    console.log("🔍 Params envoyés :", params);
    axios
      .get("depense/depenses/", { headers, params })
      .then((response) => {
        setRows(response.data.rows);
        setTotaux(response.data.totaux_globaux);
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des dépenses :", err)
      );
  };

  useEffect(() => {
    fetchDepense(); // initial load
  }, [searchQuery, filters]);
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2, mt: 2 }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <TextField
            variant="outlined"
            placeholder="ابحث عن مصاريف..."
            sx={{ width: "300px" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          {/* Ajout des Pickers de date personnalisée */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="من تاريخ"
              value={filters.date_from}
              onChange={(newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  date_from: dayjs(newValue).format("YYYY-MM-DD"), // format correct
                }))
              }
              format="YYYY-MM-DD"
              sx={{ width: 200 }}
            />
            <DatePicker
              label="إلى تاريخ"
              value={filters.date_to}
              onChange={(newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  date_to: dayjs(newValue).format("YYYY-MM-DD"),
                }))
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
                  { value: "today", label: "اليوم" },
                  { value: "yesterday", label: "الامس" },
                  { value: "this_week", label: "هذا الأسبوع" },
                  { value: "this_month", label: "هذا الشهر" },
                  { value: "last_month", label: "الشهر الماضي" },
                  { value: "this_year", label: "هذا العام" },
                ],
              },
              {
                name: "type_depense",
                label: "نوع المصروف",
                options: [
                  { value: "", label: "الكل" },
                  { value: "الكراء", label: "الكراء" },
                  { value: "الفواتير", label: "الفواتير" },
                  { value: "أجور العمال", label: "أجور العمال" },
                  { value: "سلع تالفة", label: "سلع تالفة" },
                  { value: "ديون", label: "ديون" },
                  { value: "ديون خاصة", label: "ديون خاصة" },
                  { value: "مصاريف أخرى", label: "مصاريف أخرى" },
                  { value: "مساهمين", label: "مساهمين" },
                ],
              },
              {
                name: "mode_paiement",
                label: "طريقة الدفع",
                options: [
                  { value: "", label: "الكل" },
                  { value: "espece", label: "espece" },
                  { value: "ccp", label: "CCP" },
                  { value: "cheque", label: "cheque" },
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
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={{ width: "150px", height: "55px" }}
            onClick={() => {
              setOpenAddDepenseDialog(true);
            }}
          >
            إضافة مصاريف
          </Button>
        </Stack>
      </Stack>
      <ExtraCardDepense data={totaux} />

      <DepenseTable
        rows={rows}
        setRows={setRows}
        onEditClick={handleEditClick}
      />
      

      <Dialog
        open={openAddDepenseDialog}
        onClose={() => setOpenAddDepenseDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse", // 🡐 Title on the right, icon on the left
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenAddDepenseDialog(false)}
              sx={{
                color: (theme) => theme.palette.error.main, // optional red color
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        {/* The form content */}
        <AddDepense
          setOpenAddDepenseDialog={setOpenAddDepenseDialog}
          fetchDepense={fetchDepense}
        />
      </Dialog>
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse", // 🡐 Title on the right, icon on the left
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenEditDialog(false)}
              sx={{
                color: (theme) => theme.palette.error.main, // optional red color
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              sx={{ ml: "10px" }}
              color="primary"
            >
              تعديل
            </Typography>
          </Box>
        </DialogTitle>
        <EditDepense
          selectedDepense={selectedDepense}
          setOpenEditDialog={setOpenEditDialog}
          setRows={setRows}
        />
      </Dialog>
    </>
  );
}
