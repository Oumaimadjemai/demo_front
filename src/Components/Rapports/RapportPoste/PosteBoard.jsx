import { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  InputAdornment,
} from "@mui/material";

import FilterPanel from "../../Clients/FilterPanel";
import SearchIcon from "@mui/icons-material/Search";
import axios from "../../../api/axiosInstance";
import ExtraCard from "./ExtraCard";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";



export default function PaymentReport() {
  const [rows, setRows] = useState([]);
  const [totaux, setTotaux] = useState({
    total_ventes: 0,
    total_montant_total: 0,
    total_montant_verse: 0,
    total_montant_restant: 0,
  });
  const [users, setusers] = useState([""]);
  const [filters, setFilters] = useState({
    periode: "",
    users: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const fetchVente = (search = searchTerm, appliedFilters = filters) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "content-Type": "application/json",
    };
    const params = {
      ...appliedFilters,
      search: search || "",
    };
    axios
      .get("/vente/ventes-facilite/", { headers, params })
      .then((response) => {
        setRows(response.data.ventes || []);
        setTotaux({
          total_ventes: response.data.total_ventes || 0,
          total_montant_total: response.data.total_montant_total || 0,
          total_montant_verse: response.data.total_montant_verse || 0,
          total_montant_restant: response.data.total_montant_restant || 0,
        });
      })
      .catch((err) =>
        console.error("Erreur lors du chargement des totaux :", err)
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
    fetchVente();
  }, [searchTerm, filters]);
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchVente(searchTerm); // ✅ fetch when typing stops
    }, 500); // 0.5s delay

    return () => clearTimeout(delayDebounce); // cleanup
  }, [searchTerm, filters]);
 const exportToExcel = () => {
  // Expand montants_par_mois into multiple rows
  const dataToExport = [];

  rows.forEach((row) => {
    row.montants_par_mois
      ?.slice()
      .sort((a, b) => b - a) // same sorting as the table
      .forEach((montant) => {
        dataToExport.push({
          "Nom et prenom": `${row.client_detail.nom_famille_fr} ${row.client_detail.prenom_fr}`,
          "ccp": `${row.client_detail.ccp}/${row.client_detail.cle}`,
          "prelevement": montant,
          "date debut": row.date_debut,
          "date fin": row.date_fin,
        });
      });
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ventes");

  // Generate and download
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "report_ventes.xlsx");
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
          <TextField
            variant="outlined"
            placeholder="ابحث عن زبون..."
            sx={{ width: "300px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // auto updates search
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

          {/* Ajout des Pickers de date personnalisée */}

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
            color="success"
            sx={{ width: "150px", height: "55px" }}
            onClick={exportToExcel} // ← add this
          >
            Excel
          </Button>
        </Stack>
      </Stack>
      <ExtraCard data={totaux} />

      {/* TABLE */}
      <Paper sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#ccc" }}>
            <TableRow>
              <TableCell>الاسم و اللقب</TableCell>
              <TableCell>رقم الحساب</TableCell>
              <TableCell>القسط الشهري</TableCell>
              <TableCell>بداية الدفع</TableCell>
              <TableCell>نهاية الدفع</TableCell>
            </TableRow>
          </TableHead>
<TableBody>
  {rows.map((row, i) =>
    row.montants_par_mois
      ?.slice() // copie pour ne pas modifier l'original
      .sort((a, b) => b - a) // tri décroissant
      .map((montant, j) => (
        <TableRow key={`${i}-${j}`}>
          <TableCell>
            {row.client_detail.nom_famille_fr +
              " " +
              row.client_detail.prenom_fr}
          </TableCell>
          <TableCell>
            {row.client_detail.ccp + "/" + row.client_detail.cle}
          </TableCell>
          <TableCell>{montant}</TableCell>
          <TableCell>{row.date_debut}</TableCell>
          <TableCell>{row.date_fin}</TableCell>
        </TableRow>
      ))
  )}
</TableBody>


        </Table>
      </Paper>
    </>
  );
}
