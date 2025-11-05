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

import AddProduit from "./AddProduit";
import FilterPanel from "../Clients/FilterPanel";
import ExtraCard from "./ExtraCard";
import ProduitTable from "./ProduitTable";
import EditProduit from "./EditProduit";

export default function ProduitBoard() {
  const [openAddProduitDialog, setOpenAddProduitDialog] = useState(false);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ magasin: "", famille: "" });
  const [rows, setRows] = useState([]);
  const [magasinsOptions, setMagasinsOptions] = useState([]);
  const [famillesOptions, setFamillesOptions] = useState([]);
  const [openExcelDialog, setOpenExcelDialog] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [totaux, setTotaux] = useState(null);

  // 🔹 Récupère le rôle depuis localStorage
  const userRole = localStorage.getItem("role"); // "admin", "vendeur", "magasinier"

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  };

  const fetchProduit = (search = searchTerm, appliedFilters = filters) => {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (appliedFilters.magasin)
      params.append("magasin", appliedFilters.magasin);
    if (appliedFilters.famille)
      params.append("famille", appliedFilters.famille);

    axios
      .get(`prod/produits/?${params.toString()}`, { headers })
      .then((response) => {
        setRows(response.data.results);
        setTotaux(response.data.totaux);
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des produits :", err)
      );
  };

  useEffect(() => {
    // 🔹 Charger les magasins
    // 🔹 Charger les magasins
axios.get("param/magasins/", { headers }).then((res) => {
  const dataArray = Array.isArray(res.data.results) ? res.data.results : [];
  const options = dataArray.map((magasin) => ({
    value: magasin.id,
    label: magasin.nom,
  }));
  setMagasinsOptions([{ value: "", label: "الكل" }, ...options]);
});

// 🔹 Charger directement les familles
axios
  .get("prod/produits/familles/", { headers })
  .then((res) => {
    const familles = Array.isArray(res.data.familles) ? res.data.familles : [];

    const options = familles.map((fam) => ({
      value: fam.famille,
      label: fam.famille,
    }));

    setFamillesOptions([{ value: "", label: "الكل" }, ...options]);
  })
  .catch((err) => {
    console.error("Erreur lors du chargement des familles :", err);
    setFamillesOptions([{ value: "", label: "الكل" }]); // fallback
  });




    fetchProduit(); // Initial fetch
  }, []);

  // 🔍 Recherche avec debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProduit(searchTerm, filters);
    }, 1500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filters]);

  const handleFilterChange = (event) => {
    const newFilters = { ...filters, [event.target.name]: event.target.value };
    setFilters(newFilters);
  };

  const filterConfig = [
    { name: "magasin", label: "المخزن", options: magasinsOptions },
    { name: "famille", label: "الفئة", options: famillesOptions },
  ];

  const handleEditClick = (produit) => {
    setSelectedProduit(produit);
    setOpenEditDialog(true);
  };

  const handleExport = () => {
    axios
      .get("prod/produits/export-excel/", {
        headers,
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "produits.xlsx");
        document.body.appendChild(link);
        link.click();
        setOpenExcelDialog(false);
      })
      .catch((err) => {
        console.error("Erreur export Excel :", err);
        alert("Échec de l'export");
      });
  };

  const handleImport = () => {
    if (!importFile) {
      alert("Veuillez sélectionner un fichier Excel");
      return;
    }

    const formData = new FormData();
    formData.append("file", importFile);

    axios
      .post("prod/produits/import-excel/", formData, { headers })
      .then(() => {
        alert("Importation réussie !");
        setImportFile(null);
        setOpenExcelDialog(false);
        fetchProduit(); // Rechargement
      })
      .catch((err) => {
        console.error("Erreur import Excel :", err);
        alert("Erreur lors de l'importation");
      });
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2, mt: 1 }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <TextField
            variant="outlined"
            placeholder="ابحث عن سلعة..."
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

        {userRole === "admin" && (
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              sx={{ width: "120px", height: "55px" }}
              onClick={() => setOpenAddProduitDialog(true)}
            >
              إضافة سلعة
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
        )}
      </Stack>

      {userRole === "admin" && <ExtraCard data={totaux} />}

      <ProduitTable
        rows={rows}
        setRows={setRows}
        onEditClick={handleEditClick}
      />

      {/* Dialog: Ajouter Produit */}
      <Dialog
        open={openAddProduitDialog}
        onClose={() => setOpenAddProduitDialog(false)}
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
              onClick={() => setOpenAddProduitDialog(false)}
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
              إضافة سلعة
            </Typography>
          </Box>
        </DialogTitle>

        <AddProduit
          setOpenAddProductDialog={setOpenAddProduitDialog}
          fetchProduit={fetchProduit}
        />
      </Dialog>

      {/* Dialog: Modifier Produit */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
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
              تعديل معلومات السلعة
            </Typography>
          </Box>
        </DialogTitle>

        <EditProduit
          selectedProduit={selectedProduit}
          setOpenEditDialog={setOpenEditDialog}
          setRows={setRows}
        />
      </Dialog>

      {/* Dialog: Excel */}
      <Dialog open={openExcelDialog} onClose={() => setOpenExcelDialog(false)}>
        <DialogTitle>استيراد أو تصدير Excel</DialogTitle>
        <Box
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 300,
          }}
        >
          <Button variant="contained" color="primary" onClick={handleExport}>
            تصدير Excel
          </Button>

          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setImportFile(e.target.files[0])}
          />

          <Button
            variant="contained"
            color="secondary"
            disabled={!importFile}
            onClick={handleImport}
          >
            استيراد Excel
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
