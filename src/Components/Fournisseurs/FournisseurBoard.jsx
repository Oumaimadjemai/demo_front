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
import FournisseurTable from "../Fournisseurs/FournisseurTable";
import AddFournisseur from "./AddFournisseur";
import EditFournisseur from "./EditFournisseur";

export default function FournisseurBoard() {
  const [openAddFournisseurDialog, setOpenAddFournisseurDialog] =
    useState(false);
  const [selectedFournisseur, setSelectedFournisseur] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterValues, setFilterValues] = useState({ wilaya: "" });
  const [openExcelDialog, setOpenExcelDialog] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const wilayasOptions = [
    { value: "01", label: "Adrar / أدرار" },
    { value: "02", label: "Chlef / الشلف" },
    { value: "03", label: "Laghouat / الأغواط" },
    { value: "04", label: "Oum El Bouaghi / أم البواقي" },
    { value: "05", label: "Batna / باتنة" },
    { value: "06", label: "Béjaïa / بجاية" },
    { value: "07", label: "Biskra / بسكرة" },
    { value: "08", label: "Béchar / بشار" },
    { value: "09", label: "Blida / البليدة" },
    { value: "10", label: "Bouira / البويرة" },
    { value: "11", label: "Tamanrasset / تمنراست" },
    { value: "12", label: "Tébessa / تبسة" },
    { value: "13", label: "Tlemcen / تلمسان" },
    { value: "14", label: "Tiaret / تيارت" },
    { value: "15", label: "Tizi Ouzou / تيزي وزو" },
    { value: "16", label: "Alger / الجزائر" },
    { value: "17", label: "Djelfa / الجلفة" },
    { value: "18", label: "Jijel / جيجل" },
    { value: "19", label: "Sétif / سطيف" },
    { value: "20", label: "Saïda / سعيدة" },
    { value: "21", label: "Skikda / سكيكدة" },
    { value: "22", label: "Sidi Bel Abbès / سيدي بلعباس" },
    { value: "23", label: "Annaba / عنابة" },
    { value: "24", label: "Guelma / قالمة" },
    { value: "25", label: "Constantine / قسنطينة" },
    { value: "26", label: "Médéa / المدية" },
    { value: "27", label: "Mostaganem / مستغانم" },
    { value: "28", label: "M'Sila / المسيلة" },
    { value: "29", label: "Mascara / معسكر" },
    { value: "30", label: "Ouargla / ورقلة" },
    { value: "31", label: "Oran / وهران" },
    { value: "32", label: "El Bayadh / البيض" },
    { value: "33", label: "Illizi / اليزي" },
    { value: "34", label: "Bordj Bou Arreridj / برج بوعريريج" },
    { value: "35", label: "Boumerdès / بومرداس" },
    { value: "36", label: "El Tarf / الطارف" },
    { value: "37", label: "Tindouf / تندوف" },
    { value: "38", label: "Tissemsilt / تسمسيلت" },
    { value: "39", label: "El Oued / الوادي" },
    { value: "40", label: "Khenchela / خنشلة" },
    { value: "41", label: "Souk Ahras / سوق أهراس" },
    { value: "42", label: "Tipaza / تيبازة" },
    { value: "43", label: "Mila / ميلة" },
    { value: "44", label: "Aïn Defla / عين الدفلى" },
    { value: "45", label: "Naâma / النعامة" },
    { value: "46", label: "Aïn Témouchent / عين تموشنت" },
    { value: "47", label: "Ghardaïa / غرداية" },
    { value: "48", label: "Relizane / غليزان" },
    { value: "49", label: "Timimoun / تيميمون" },
    { value: "50", label: "Bordj Badji Mokhtar / برج باجي مختار" },
    { value: "51", label: "Ouled Djellal / أولاد جلال" },
    { value: "52", label: "Béni Abbès / بني عباس" },
    { value: "53", label: "In Salah / عين صالح" },
    { value: "54", label: "In Guezzam / عين قزام" },
    { value: "55", label: "Touggourt / تقرت" },
    { value: "56", label: "Djanet / جانت" },
    { value: "57", label: "El M'Ghair / المغير" },
    { value: "58", label: "El Menia / المنيعة" },
  ];

  const handleEditClick = (fournisseur) => {
    console.log("🟡 handleEditClick reçu :", fournisseur);
    setSelectedFournisseur(fournisseur);
    setOpenEditDialog(true);
  };
  const [rows, setRows] = useState([]);
  const fetchFournisseur = () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    };

    axios
      .get("auth/fournisseurs", {
        headers,
        params: {
          search: searchValue,
          wilaya: filterValues.wilaya || undefined,
        },
      })
      .then((response) => setRows(response.data.results))
      .catch((err) =>
        console.error("Erreur lors du chargement des fournisseurs :", err)
      );
  };

  useEffect(() => {
    fetchFournisseur(); // initial load
  }, [searchValue, filterValues]);

  const handleExport = async () => {
    try {
      const response = await axios.get("/auth/fournisseurs/export/", {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // si token requis
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "fournisseurs.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur d'exportation :", error);
    }
  };

  const handleImport = async () => {
    const formData = new FormData();
    formData.append("file", importFile);

    try {
      await axios.post("/auth/fournisseurs/import/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`, // si token requis
        },
      });
      alert("Importation réussie !");
      setOpenExcelDialog(false);
      // Tu peux aussi rafraîchir les données ici
    } catch (error) {
      console.error("Erreur d'importation :", error);
      alert("Erreur lors de l'importation !");
    }
  };
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
            placeholder="ابحث عن ممون..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ width: "300px" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          <FilterPanel
            filters={[
              {
                name: "wilaya",
                label: "الولاية",
                options: [{ value: "", label: "الكل" }, ...wilayasOptions],
              },
            ]}
            values={filterValues}
            onChange={(e) =>
              setFilterValues((prev) => ({
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
            sx={{ width: "120px", height: "55px" }}
            onClick={() => {
              setOpenAddFournisseurDialog(true);
            }}
          >
            إضافة ممون
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

      <FournisseurTable
        rows={rows}
        setRows={setRows}
        onEditClick={handleEditClick}
      />

      <Dialog
        open={openAddFournisseurDialog}
        onClose={() => setOpenAddFournisseurDialog(false)}
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
              onClick={() => setOpenAddFournisseurDialog(false)}
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
              إضافة ممون
            </Typography>
          </Box>
        </DialogTitle>

        {/* The form content */}
        <AddFournisseur
          setOpenAddFournisseurtDialog={setOpenAddFournisseurDialog}
          fetchFournisseur={fetchFournisseur}
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
              تعديل معلومات الزبون
            </Typography>
          </Box>
        </DialogTitle>
        <EditFournisseur
          selectedFournisseur={selectedFournisseur}
          setOpenEditDialog={setOpenEditDialog}
          setRows={setRows}
        />
      </Dialog>
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
