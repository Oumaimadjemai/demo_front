// InventoryQuantities.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  TextField,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "../../../api/axiosInstance";

export default function InventoryQuantities() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: "",
    reference: "",
    famille: "",
  });

  const [references, setReferences] = useState([]);
  const [familles, setFamilles] = useState([]);

  /** 🔹 Charger la liste des références et familles pour remplir les selects */
  const fetchFilterOptions = async () => {
    try {
      const res = await axios.get("/prod/produits/familles/"); // endpoint qui renvoie tous les produits mini
      const produits = res.data.familles || [];

      // Extraire listes uniques
      const refs = [...new Set(produits.map((p) => p.reference).filter(Boolean))];
      const fams = [...new Set(produits.map((p) => p.famille).filter(Boolean))];

      setReferences(refs);
      setFamilles(fams);
    } catch (error) {
      console.error("Erreur chargement références/familles:", error);
    }
  };

  /** 🔹 Charger la comparaison avec filtres */
  const fetchComparison = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.reference) params.reference = filters.reference;
      if (filters.famille) params.famille = filters.famille;

      const res = await axios.get("/prod/comparaison/", { params });
      setRows(res.data || []);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    } finally {
      setLoading(false);
    }
  };

  /** Charger les options de filtre au montage */
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  /** Rafraîchir les données quand un filtre change */
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchComparison();
    }, 400); // petit debounce pour éviter spam API
    return () => clearTimeout(delayDebounce);
  }, [filters]);

  /** Extraire dynamiquement la liste des magasins depuis la première ligne */
  const magasins =
    rows.length > 0 ? rows[0].quantites.map((q) => q.magasin) : [];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* --- Filtres --- */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="بحث عن سلعة"
              variant="outlined"
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </Grid>

         
            <FormControl sx={{width:"150px"}}>
              <InputLabel>المرجع</InputLabel>
              <Select
                value={filters.reference}
                onChange={(e) =>
                  setFilters({ ...filters, reference: e.target.value })
                }
              >
                <MenuItem value="">Toutes</MenuItem>
                {references.map((ref, idx) => (
                  <MenuItem key={idx} value={ref}>
                    {ref}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
         

          
            <FormControl sx={{width:"150px"}}>
              <InputLabel>العائلة</InputLabel>
              <Select
                value={filters.famille}
                onChange={(e) =>
                  setFilters({ ...filters, famille: e.target.value })
                }
              >
                <MenuItem value="">Toutes</MenuItem>
                {familles.map((fam, idx) => (
                  <MenuItem key={idx} value={fam}>
                    {fam}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          
        </Grid>
      </Paper>

      {/* --- Table --- */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#cfd8dc" }}>
                <TableCell>المرجع</TableCell>
                <TableCell>الاسم</TableCell>
                <TableCell>العائلة</TableCell>
                {magasins.map((magasin) => (
                  <TableCell key={magasin}>{magasin}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.reference || "-"}</TableCell>
                  <TableCell>{row.nom}</TableCell>
                  <TableCell>{row.famille}</TableCell>
                  {row.quantites.map((q, i) => (
                    <TableCell key={i}>
                      <Box
                        sx={{
                          bgcolor: q.quantite > 0 ? "green" : "red",
                          color: "#fff",
                          textAlign: "center",
                          borderRadius: 1,
                          px: 1,
                        }}
                      >
                        {q.quantite}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
