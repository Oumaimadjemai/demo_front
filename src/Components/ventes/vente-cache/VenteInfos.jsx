import { Button, Stack, TextField, Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";

export default function VenteInfos({ onAddProduct }) {
  const [search, setSearch] = useState("");
  const [produits, setProduits] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [magasins, setMagasins] = useState("");
  const [selectedMagasin, setSelectedMagasin] = useState(null);
  const [prixVente, setPrixVente] = useState("");
  const [quantite, setQuantite] = useState(1);

useEffect(() => {
  axios
    .get("/prod/produits/", {
      params: { 
        search,
        ...(selectedMagasin ? { magasin: selectedMagasin.id } : {}) // 👈 ajoute seulement si magasin choisi
      },
    })
    .then((res) => setProduits(res.data.results || []))
    .catch((err) => console.error("Erreur lors du fetch des produits:", err));
}, [search, selectedMagasin]);
 useEffect(() => {
    axios
      .get("/param/magasins/")
      .then((res) => setMagasins(res.data.results || []))
      .catch((err) => console.error("Erreur lors du fetch des magasins:", err));
  }, []);

  const handleProduitSelect = (event, value) => {
    setSelectedProduit(value);
    if (value) {
      setSelectedMagasin(value.magasin_detail || null);
      setPrixVente(value.prix_vente_cache || "");
    } else {
      setSelectedMagasin(null);
      setPrixVente("");
    }
  };
  const handleAddClick = () => {
    if (selectedProduit && quantite) {
      onAddProduct({
        produit: selectedProduit,
        quantite: parseFloat(quantite) || 0,
        prixVenteCache: parseFloat(prixVente) || 0,
          magasin: selectedMagasin.id, // ✅ use chosen magasin
        magasin_nom: selectedMagasin.nom,
      });

      // Reset
      setSelectedProduit(null);
      setSelectedMagasin(null);
      setPrixVente("");
      setQuantite(1);
      setSearch("");
    } else {
      alert("Veuillez sélectionner un produit et entrer une quantité.");
    }
  };

  return (
    <>
<Autocomplete
  options={Array.isArray(produits) ? produits : []}
  getOptionLabel={(option) =>
    option.nom && typeof option.quantite !== "undefined"
      ? `${option.nom} (${option.quantite} unités) `
      : ""
  }
  value={selectedProduit} // <-- control the value
  onChange={handleProduitSelect}
  isOptionEqualToValue={(option, value) => option.id === value.id}
  noOptionsText="لا يوجد نتائج"
  renderOption={(props, option) => (
    <li {...props}>
      {option.image && (
        <img
          src={option.image}
          alt={option.nom}
          width="30"
          style={{ marginRight: 5,marginLeft:5 }}
        />
      )}
      {option.nom} ({option.quantite})
    </li>
  )}
  renderInput={(params) => (
    <TextField
      {...params}
      label="بحث"
      size="small"
      className="Input-field"
      sx={{ width: "97.5%" }}
      onChange={(e) => setSearch(e.target.value)}
    />
  )}
/>

      <br />

      <Stack direction="row" spacing={2}>
         <Autocomplete
          options={Array.isArray(magasins) ? magasins : []}
          getOptionLabel={(option) => option.nom || ""}
          value={selectedMagasin}
          onChange={(e, value) => setSelectedMagasin(value)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          noOptionsText="لا يوجد محلات"
          renderInput={(params) => (
            <TextField
              {...params}
              label="المحل"
              size="small"
              className="Input-field"
              sx={{ width: "92%" }}
            />
          )}
          sx={{width:'33%'}}

        />
        <TextField
  label="السعر"
  value={prixVente}
  onChange={(e) => setPrixVente(e.target.value)}   // ✅ allow editing
  size="small"
  className="Input-field"
  sx={{ width: "33%" }}
/>

        <TextField
          label="الكمية"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
          size="small"
          className="Input-field"
          sx={{ width: "33%" }}
        />
      </Stack>

      <Button
        variant="contained"
        color="success"
        sx={{ mt: 1.5, width: "93px", ml: 1.5 }}
        onClick={handleAddClick}
      >
        +
      </Button>
    </>
  );
}
