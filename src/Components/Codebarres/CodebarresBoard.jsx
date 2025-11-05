import {
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import FilterPanel from "../Clients/FilterPanel";
import SearchIcon from "@mui/icons-material/Search";
import CodeBarreTable from "./CodeBarreTable";
import { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";

export default function CodebarresBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [magasins, setMagasins] = useState([]);
  const [filterValues, setFilterValues] = useState({ magasin: "" });

  // Charger la liste des magasins
  useEffect(() => {
    const fetchMagasins = async () => {
      try {
        const response = await axios.get("/param/magasins");
        setMagasins(
          response.data.results.map((m) => ({
            label: m.nom,
            value: m.id,
          }))
        );
      } catch (error) {
        console.error("Erreur lors du chargement des magasins :", error);
      }
    };

    fetchMagasins();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterValues((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2, mt: 2, ml: 2 }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <TextField
            variant="outlined"
            placeholder="ابحث عن ..."
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
            filters={[
              {
                name: "magasin",
                label: "المحل",
                options: [{ label: "الكل", value: "" }, ...magasins],
              },
            ]}
            values={filterValues}
            onChange={handleFilterChange}
          />
        </Stack>
      </Stack>

      <CodeBarreTable
        searchTerm={searchTerm}
        magasinFilter={filterValues.magasin}
      />
    </>
  );
}
