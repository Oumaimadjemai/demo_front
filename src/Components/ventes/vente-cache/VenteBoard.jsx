import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import axios from "../../../api/axiosInstance";
import FilterPanel from "../../Clients/FilterPanel";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";

import VenteTable from "./VenteTable";
import DetailTable from "./DetailTable";
import ExtraCardVente from "./ExtraCardVente";

export default function VenteBoard({ setActiveComponent }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setusers] = useState([""]);
  const [filters, setFilters] = useState({
    periode: "",
    date_from: null,
    date_to: null,
    users: "",
  });
  const [totaux, setTotaux] = useState({
    total_montant: 0,
    nombre_de_ventes: 0,
  });
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [VenteDetail, setVenteDetail] = useState(null);
  const [rows, setRows] = useState([]);

  const role = localStorage.getItem("role"); // ✅ Get user role

  const fetchVente = (search = searchTerm, appliedFilters = filters) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    };

    const params = {
      ...appliedFilters,
      search: search || "",
      date_from: appliedFilters.date_from
        ? dayjs(appliedFilters.date_from).format("YYYY-MM-DD")
        : null,
      date_to: appliedFilters.date_to
        ? dayjs(appliedFilters.date_to).format("YYYY-MM-DD")
        : null,
    };

    axios
      .get("/vente/liste/", { headers, params })
      .then((response) => {
        setRows(response.data.ventes);
        setTotaux({
          total_montant: response.data.total_montant,
          nombre_de_ventes: response.data.nombre_de_ventes,
        });
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des ventes :", err)
      );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/auth/users/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setusers(res.data.results);
      } catch (err) {
        console.error("Erreur lors du chargement des client", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    fetchVente(); // initial load
  }, [filters]);

  const handleDetailsClick = async (vente) => {
    try {
      const res = await axios.get(`vente/ventes-cache/${vente.id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setVenteDetail(res.data);
      setOpenDetailsDialog(true);
    } catch (error) {
      console.error("Erreur lors du chargement du détail de la vente :", error);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchVente(searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filters]);

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

          {/* Pickers */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="من تاريخ"
              value={filters.date_from}
              onChange={(newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  date_from: newValue,
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
                  date_to: newValue,
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
                  { value: "yesterday", label: "الامس" },
                  { value: "today", label: "اليوم" },
                  { value: "this_week", label: "هذا الأسبوع" },
                  { value: "this_month", label: "هذا الشهر" },
                  { value: "last_month", label: "الشهر الماضي" },
                  { value: "this_year", label: "هذا العام" },
                ],
              },
              {
                name: "users",
                label: "البائع",
                options: [
                  { value: "", label: "الكل" },
                  ...users.map((u) => ({
                    value: u.id,
                    label: u.username,
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
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            sx={{ width: "150px", height: "55px" }}
            onClick={() =>
              setActiveComponent({
                name: "nouveau-vente-cache",
                props: { isEditMode: false },
              })
            }
          >
            عملية بيع كاش
          </Button>
        </Stack>
      </Stack>

      {/* ✅ Only admin sees extra card */}
      {role === "admin" && <ExtraCardVente data={totaux} />}

      <VenteTable
        rows={rows}
        setRows={setRows}
        onDetailsClick={handleDetailsClick}
      />

      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        sx={{ m: 2 }}
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
              onClick={() => setOpenDetailsDialog(false)}
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
              تفاصيل عملية البيع
            </Typography>
          </Box>
        </DialogTitle>

        {!VenteDetail?.lignes_detail?.length ? (
          <Typography sx={{ p: 2, textAlign: "center" }} color="error">
            لا توجد تفاصيل متاحة لهذا البيع.
          </Typography>
        ) : (
          <DetailTable
            rows={VenteDetail.lignes_detail.map((item) => ({
              id: item.produit || null,
              reference: item.produit_reference || "",
              nom: item.produit_nom,
              prix_vente_cache: parseFloat(item.prix_unitaire),
              quantite: item.quantite,
              magasin: item.magasin_detail?.nom,
              total: parseFloat(item.sous_total),
              codebarre: item.codes_barres_utilises || "",
            }))}
          />
        )}
      </Dialog>
    </>
  );
}
