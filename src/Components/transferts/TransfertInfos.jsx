import {
  Box,
  Card,
  Container,
  Typography,
  TextField,
  Autocomplete,
  MenuItem,
  Button,
} from "@mui/material";
import axios from "../../api/axiosInstance";
import { useState, useEffect } from "react";
import FeedbackCard from "../Cards/FeedbackCard";

export default function TransfertInfos({setOpenAddTransfertDialog,fetchTransfert}) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState(null);
  const [destinationMagasins, setDestinationMagasins] = useState([]);
  const [selectedMagasinDest, setSelectedMagasinDest] = useState("");
  const [quantite, setQuantite] = useState(1);
  const [quantiteError, setQuantiteError] = useState("");
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (inputValue.length < 2) return;

    const fetchProduits = async () => {
      try {
        const response = await axios.get(`prod/produits/?search=${inputValue}`);
        setOptions(response.data.results || []);
      } catch (error) {
        console.error("Erreur de récupération des produits :", error);
        setOptions([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchProduits();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  const handleSelection = async (event, newValue) => {
    setSelectedProduit(newValue);

    if (newValue?.magasin_detail?.id) {
      try {
        const response = await axios.get("param/magasins/");
        const filtered = response.data.results.filter(
          (mag) => mag.id !== newValue.magasin_detail.id
        );
        setDestinationMagasins(filtered);
      } catch (error) {
        console.error("Erreur lors du chargement des magasins :", error);
      }
    }
  };
  const handleQuantiteChange = (e) => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    setQuantite(value);
    setQuantiteError("");

    if (selectedProduit && value) {
      const qty = parseInt(value, 10);
      const max = selectedProduit.quantite;

      if (qty > max) {
        setQuantiteError(`الكمية لا يجب أن تتجاوز ${max}`);
      } else if (qty <= 0) {
        setQuantiteError("الكمية يجب أن تكون أكبر من 0");
      }
    }
  };
  // const handleSubmit = async () => {
  //   if (
  //     !selectedProduit?.id ||
  //     !selectedMagasinDest ||
  //     !quantite ||
  //     quantiteError
  //   ) {
  //     let message = "يرجى تعبئة جميع الحقول بشكل صحيح";
  //     setFeedback({
  //       open: true,
  //       message,
  //       severity: "error",
  //     });
  //     //   alert();
  //     fetchTransfert();
  //     return;
  //   }

  //   const data = {
  //     produit: selectedProduit.id,
  //     magasin_destination: selectedMagasinDest,
  //     quantite: parseInt(quantite),
  //   };

  //   try {
  //     const access_token = localStorage.getItem("access_token");

  //     const response = await axios.post("trans/transferts/", data, {
  //       headers: {
  //         Authorization: `Bearer ${access_token}`,
  //       },
  //     });
  //     setFeedback({
  //       open: true,
  //       message: "✅ Transfer Effectué avec succès",
  //       severity: "success",
  //     });
  //     //   alert("تمت عملية التحويل بنجاح");
  //     // Optionally reset form
  //     setSelectedProduit(null);
  //     setSelectedMagasinDest("");
  //     setQuantite("");
  //     setOptions([]);
  //     setInputValue("");
  //   } catch (error) {
  //     let message = "❌ Une erreur est survenue.";
  //     console.error("Erreur lors de la soumission :", error);
  //     //   alert("حدث خطأ أثناء التحويل");
  //     setFeedback({
  //       open: true,
  //       message,
  //       severity: "error",
  //     });
  //   }
  // };
const handleSubmit = async () => {
  if (
    !selectedProduit?.id ||
    !selectedMagasinDest ||
    !quantite ||
    quantiteError
  ) {
    setFeedback({
      open: true,
      message: "يرجى تعبئة جميع الحقول بشكل صحيح",
      severity: "error",
    });
    return;
  }

  const data = {
    produit: selectedProduit.id,
    magasin_destination: selectedMagasinDest,
    quantite: parseInt(quantite),
  };

  try {
    const access_token = localStorage.getItem("access_token");

    const response = await axios.post("trans/transferts/", data, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // ✅ Refresh the transfert table immediately after success
    await fetchTransfert();

    setFeedback({
      open: true,
      message: "✅ تم تحويل المنتج بنجاح",
      severity: "success",
    });

    // Reset form
    setSelectedProduit(null);
    setSelectedMagasinDest("");
    setQuantite("");
    setOptions([]);
    setInputValue("");
  } catch (error) {
    console.error("Erreur lors de la soumission :", error);
    setFeedback({
      open: true,
      message: error.response?.data?.error || "❌ Une erreur est survenue.",
      severity: "error",
    });
  }
};

  return (
    <>
      <Container maxWidth="sm" sx={{ mb: 4 }}>
        <Box sx={{ minWidth: 275 }}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                mt: 2,
                mb: 2,
                color: "primary.main",
              }}
            >
              عملية تحويل جديدة
            </Typography>

            <Autocomplete
              fullWidth
              options={options}
              getOptionLabel={(option) => `${option.nom} - ${option.quantite}`}
              onInputChange={(event, newInputValue) =>
                setInputValue(newInputValue)
              }
              onChange={handleSelection}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="بحث عن منتج أو الباركود"
                  variant="outlined"
                />
              )}
              sx={{ mt: 2, width: "100%" }}
            />

            <TextField
              label="المخزن المرتبط"
              value={selectedProduit?.magasin_detail?.nom || ""}
              InputProps={{
                readOnly: true,
              }}
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              select
              label="المخزن الوجهة"
              value={selectedMagasinDest}
              onChange={(e) => setSelectedMagasinDest(e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
            >
              {destinationMagasins.map((magasin) => (
                <MenuItem key={magasin.id} value={magasin.id}>
                  {magasin.nom}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="الكمية المراد تحويلها"
              type="number"
              value={quantite}
              onChange={handleQuantiteChange}
              error={!!quantiteError}
              helperText={quantiteError}
              fullWidth
              sx={{ mt: 2 }}
              inputProps={{ min: 1, max: selectedProduit?.quantite || 1 }}
            />
            <Button
              variant="contained"
              sx={{ width: "90%", height: "50px", mb: "20px", mt: "20px" }}
              onClick={handleSubmit}
            >
              تحويل
            </Button>
          </Card>
        </Box>
      </Container>
      {feedback.open && (
        <FeedbackCard
          message={feedback.message}
          severity={feedback.severity}
          onClose={() => {
            setFeedback({ ...feedback, open: false });
            if (feedback.severity === "success") {
              setOpenAddTransfertDialog(false);
            }
          }}
        />
      )}
    </>
  );
}
