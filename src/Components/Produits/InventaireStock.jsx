import useBarcodeScanner from "./useBarcodeScanner";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "../../api/axiosInstance";
import { useEffect, useState } from "react";

export default function InventaireStock() {
  const [magasins, setMagasins] = useState([]);
  const [selectedMagasin, setSelectedMagasin] = useState("");
  const [produits, setProduits] = useState([]);
  const [totaux, setTotaux] = useState({ quantite: 0, valeur_des_produits: 0, capital: 0 });
  const [scannedBarcodes, setScannedBarcodes] = useState([]);
  const [confirmedCount, setConfirmedCount] = useState(0);

  // Fetch products
  useEffect(() => {
  axios
    .get("/prod/produits/")
    .then((res) => {
      setProduits(res.data.results);
      if (res.data.totaux) {
        setTotaux(res.data.totaux);
      }
    })
    .catch((err) => console.error(err));
}, []);

  // Fetch stores
  useEffect(() => {
    axios
      .get("/param/magasins")
      .then((res) => setMagasins(res.data.results))
      .catch((err) => console.error(err));
  }, []);

  // Barcode scanner hook
  useBarcodeScanner((code) => {
    setScannedBarcodes((prev) => [...prev, code]);
  });

  // Filter products by selected store
  const filteredProduits = produits.filter(
    (p) => p.magasin_detail?.id === selectedMagasin
  );

  const totalQuantite = filteredProduits.reduce(
    (total, p) => total + p.quantite,
    0
  );

  const readCount = scannedBarcodes.length;
  const unconfirmedCount = totalQuantite - confirmedCount;

  return (
    <Stack
      direction="row"
      spacing={2}
      height="100vh"
      mt={5}
      justifyContent="space-between"
    >
      {/* LEFT SIDE */}
      <Stack sx={{ width: "50%" }}>
        <TextField
          multiline
          rows={5}
          value={scannedBarcodes.join("\n")}
          placeholder="Codes scannés"
          sx={{
            "& .MuiInputBase-input": {
              fontFamily: "monospace",
              fontSize: "14px",
              lineHeight: "1.5",
            },
            mb: 2,
          }}
        />

        <Button variant="contained" sx={{ mb: 2 }}>
          تجربة
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => setConfirmedCount(readCount)}
        >
          تأكيد
        </Button>
      </Stack>

      {/* RIGHT SIDE */}
      <Stack width="50%">
        <FormControl size="small" sx={{ width: "95%" }}>
          <InputLabel id="magasin-select-label">المحل</InputLabel>
          <Select
            labelId="magasin-select-label"
            value={selectedMagasin}
            onChange={(e) => setSelectedMagasin(e.target.value)}
          >
            {magasins.length === 0 ? (
              <MenuItem disabled>Chargement...</MenuItem>
            ) : (
              magasins.map((magasin) => (
                <MenuItem key={magasin.id} value={magasin.id}>
                  {magasin.nom}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>

        <Stack direction="row" mt={2}>
          <Box
            sx={{
              width: "90%",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="subtitle1">العدد الإجمالي</Typography>
            <Typography variant="h5">{totalQuantite}</Typography>
            <Divider />
            <Typography variant="subtitle1">غير المؤكدة</Typography>
            <Typography variant="h5">{unconfirmedCount}</Typography>
          </Box>

          <Box
            sx={{
              width: "90%",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Typography variant="subtitle1">المقروء</Typography>
            <Typography variant="h5">{readCount}</Typography>
            <Divider />
            <Typography variant="subtitle1">المؤكدة</Typography>
            <Typography variant="h5">{confirmedCount}</Typography>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}
