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
  Typography,
} from "@mui/material";

import axios from "../../api/axiosInstance";
import FilterPanel from "../Clients/FilterPanel";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import AchatTable from "./AchatTable";
import ExtraCardAchat from "./ExtraCardAchat";
import Buttom from "./Buttom";

export default function AchatBoard({ setActiveComponent }) {
  const [fournisseurs, setFournisseurs] = useState([""]);

  const [filters, setFilters] = useState({
    periode: "this_week",
    date_from: null,
    date_to: null,
    fournisseur: "",
  });
  const [totaux, setTotaux] = useState({
    nombre_achats: 0,
    somme_totale: 0,
    somme_payee: 0,
    somme_restante: 0,
  });
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [achatDetail, setAchatDetail] = useState(null);

  const [rows, setRows] = useState([]);

  const fetchAchat = () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    };

    const params = {
      ...filters,
      date_from: filters.date_from
        ? dayjs(filters.date_from).format("YYYY-MM-DD")
        : null,
      date_to: filters.date_to
        ? dayjs(filters.date_to).format("YYYY-MM-DD")
        : null,
    };
    console.log("🔍 Params envoyés :", params);
    axios
      .get("/achat/par-group/", { headers, params })
      .then((response) => {
        setRows(response.data.achats_groupes);
        setTotaux({
          nombre_achats: response.data.nombre_achats,
          somme_totale: response.data.somme_totale,
          somme_payee: response.data.somme_payee,
          somme_restante: response.data.somme_restante,
        });
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des dépenses :", err)
      );
  };
  useEffect(() => {
    const fetchFournisseurs = async () => {
      try {
        const res = await axios.get("/auth/fournisseurs/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setFournisseurs(res.data.results);
      } catch (err) {
        console.error("Erreur lors du chargement des fournisseurs", err);
      }
    };

    fetchFournisseurs();
  }, []);

  useEffect(() => {
    fetchAchat(); // initial load
  }, [filters]);

  // In AchatBoard.js, modify the handleEditClick function:
  const handleEditClick = (achat) => {
    setActiveComponent({
      name: "edit-achat",
      props: {
        isEditMode: true,
        initialData: achat,
      },
    });
  };

  const handleDetailsClick = (achat) => {
    setAchatDetail(achat);
    setOpenDetailsDialog(true);
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2, mt: 2 }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          {/* Ajout des Pickers de date personnalisée */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="من تاريخ"
              value={filters.date_from}
              onChange={(newValue) =>
                setFilters((prev) => ({
                  ...prev,
                  date_from: newValue, // format correct
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
                name: "fournisseur",
                label: "الممون",
                options: [
                  { value: "", label: "الكل" },
                  ...fournisseurs.map((f) => ({
                    value: f.id,
                    label: f.nom,
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
                name: "nouveau-achat",
                props: { isEditMode: false },
              })
            } // 👈 This triggers the sidebar switch
          >
            إجراء عملية شراء
          </Button>
        </Stack>
      </Stack>
      <ExtraCardAchat data={totaux} />

      <AchatTable
        rows={rows}
        setRows={setRows}
        onEditClick={handleEditClick}
        onDetailsClick={handleDetailsClick}
      />

      {/*  */}

      <Dialog
        open={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="md"
        fullWidth
        dir="rtl"
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
              تفاصيل عملية الشراء
            </Typography>
          </Box>
        </DialogTitle>

        {achatDetail && (
          <Buttom
            rows={achatDetail.achats.map((item) => ({
              id: item.produit_detail?.id,
              reference: item.produit_detail?.reference,
              nom: item.produit_detail?.nom,
              prix_achat: parseFloat(item.prix_achat),
              quantite: item.quantite,
              magasin: item.magasin_detail?.nom,
              total: parseFloat(item.prix_achat) * item.quantite,
            }))}
            showDelete={false} // 👈 ici
          />
        )}
      </Dialog>
    </>
  );
}
