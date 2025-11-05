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
import TransfertTable from "./TransfertTable";
import TransfertInfos from "./TransfertInfos";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function TransfertBoard() {
  const [openAddTransfertDialog, setOpenAddTransfertDialog] = useState(false);
  const [selectedTransfert, setSelectedTransfert] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    magasin_source: "",
    magasin_destination: "",
    date_exact: null,
  });
  const [magasins, setMagasins] = useState([]);

  useEffect(() => {
    axios
      .get("param/magasins/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => setMagasins(res.data.results))
      .catch((err) => console.error("Erreur chargement magasins", err));
  }, []);
  const filterOptions = [
    {
      name: "magasin_source",
      label: "المصدر",
      options: magasins.map((m) => ({ value: m.id, label: m.nom })),
    },
    {
      name: "magasin_destination",
      label: "الوجهة",
      options: magasins.map((m) => ({ value: m.id, label: m.nom })),
    },
  ];
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (transfert) => {
    console.log("🟡 handleEditClick reçu :", transfert);
    setSelectedTransfert(transfert);
    setOpenEditDialog(true);
  };
  const [rows, setRows] = useState([]);
  const fetchTransfert = () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    };
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (filters.magasin_source) params.magasin_source = filters.magasin_source;
    if (filters.magasin_destination)
      params.magasin_destination = filters.magasin_destination;
    if (filters.date_exact)
      params["date"] = dayjs(filters.date_exact).format("YYYY-MM-DD");

    console.log("📦 Params envoyés :", params);

    axios
      .get("trans/transferts/", { headers, params })
      .then((response) => {
        console.log("transfert", response.data.rows);
        setRows(response.data.results || []);
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des transferts :", err)
      );
  };

  useEffect(() => {
    fetchTransfert(); // initial load
  }, [searchTerm, filters]);
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
            placeholder="ابحث عن تحويل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                fetchTransfert(); // Lancer la recherche en appuyant sur Entrée
              }
            }}
            sx={{ width: "300px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={fetchTransfert}>
                    <SearchIcon color="primary" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="تاريخ التحويل"
              value={filters.date_exact}
              onChange={(newValue) =>
                setFilters((prev) => ({ ...prev, date_exact: newValue }))
              }
              
            />
          </LocalizationProvider>
          <FilterPanel
            filters={filterOptions}
            values={filters}
            onChange={handleFilterChange}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={{ width: "150px", height: "55px" }}
            onClick={() => {
              setOpenAddTransfertDialog(true);
            }}
          >
            تحويل سلعة
          </Button>
        </Stack>
      </Stack>

      <TransfertTable
        rows={rows}
        setRows={setRows}
        onEditClick={handleEditClick}
      />

      <Dialog
        open={openAddTransfertDialog}
        onClose={() => setOpenAddTransfertDialog(false)}
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
              onClick={() => setOpenAddTransfertDialog(false)}
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
              إضافة
            </Typography>
          </Box>
        </DialogTitle>

        {/* The form content */}
        <TransfertInfos
          setOpenAddTransfertDialog={setOpenAddTransfertDialog}
          fetchTransfert={fetchTransfert}
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
        {/* <EditDepense selectedDepense={selectedDepense} setOpenEditDialog={setOpenEditDialog}  setRows={setRows}/> */}
      </Dialog>
    </>
  );
}
