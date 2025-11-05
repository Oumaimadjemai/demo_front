import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "../../../api/axiosInstance";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export default function Side({
  rows,
  clientId,
  onclientChange,
  onSubmit,
  isEditMode,
  onMoisChange,
}) {
  const [clientList, setClientList] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [total, setTotal] = useState(0);
  const [mois, setMois] = useState(3);
  const [startDate, setStartDate] = useState(dayjs().add(1, "month").date(10));
  const [endDate, setEndDate] = useState(dayjs().add(3, "month"));
  const [prelevement, setPrelevement] = useState(1);
  const [breakdown, setBreakdown] = useState([]);
  const [montantVerse, setMontantVerse] = useState(0);
  const [montantRestant, setMontantRestant] = useState(0);
  const [warning, setWarning] = useState(false);

  const MAX_ADVANCE_PERCENT = 0.5; // 50% du total autorisé en avance

  const arrondir = (val) => (val <= 0 ? 0 : Math.round(val / 10) * 10);

function diviserMontantMultiple500(montant, prelevement) {
  if (prelevement <= 0 || montant <= 0) return [];
  if (montant < 500) return [montant]; // si < 500, pas besoin de diviser

  const tryDivide = (m, p) => {
    const parts = [];
    let reste = m;

    for (let i = 0; i < p; i++) {
      let part = Math.floor(reste / (p - i) / 500) * 500;

      if (part < 500 && i < p - 1) {
        part = 500;
      }

      parts.push(part);
      reste -= part;
    }

    if (reste > 0) {
      parts[parts.length - 1] += reste;
    }

    // Vérifier que toutes les parts sont >= 500 sauf si montant < 500
    if (parts.some((p, i) => p < 500 && !(m < 500 && i === parts.length - 1))) {
      return null; // division non valide
    }

    // Trier du plus grand au plus petit
    return parts.sort((a, b) => b - a);
  };

  // Essayer avec le nombre demandé
  let result = tryDivide(montant, prelevement);

  // Si pas valide, réduire jusqu'à trouver une division correcte
  while (!result && prelevement > 1) {
    prelevement--;
    result = tryDivide(montant, prelevement);
  }

  return result || [montant];
}
function diviserMontantMensuel(montant, prelevement) {
  if (prelevement <= 0 || montant <= 0) return [];
  if (prelevement === 1) return [montant];

  // 🧮 Base arrondie à la dizaine inférieure
  const base = Math.floor(montant / prelevement / 10) * 10;
  const parts = Array(prelevement).fill(base);

  // 🔹 Calcul du reste total à répartir
  let sommePartielle = parts.reduce((a, b) => a + b, 0);
  let reste = montant - sommePartielle;

  // 🟢 Distribuer le reste sur les premiers prélèvements
  let i = 0;
  while (reste > 0 && i < parts.length - 1) { // pas le dernier
    const ajout = reste >= 10 ? 10 : reste; // palier de 10 DA
    parts[i] += ajout;
    reste -= ajout;
    i++;
  }

  // 🟣 Si jamais il reste encore quelques dinars (rare), le dernier reste inchangé (donc plus petit)
  return parts;
}



  useEffect(() => {
    const totalAmount = rows.reduce((acc, row) => acc + (row.total || 0), 0);
    setTotal(arrondir(totalAmount));
  }, [rows]);

  useEffect(() => {
    axios
      .get("/auth/clients/")
      .then((res) => setClientList(res.data.results))
      .catch((err) =>
        console.error("Erreur lors du chargement des clients:", err)
      );
  }, []);

  useEffect(() => {
    if (startDate) {
      const calculatedEnd = dayjs(startDate).add(mois, "month");
      setEndDate(calculatedEnd);
    } else {
      setEndDate(null);
    }
  }, [startDate, mois]);

  useEffect(() => {
    const T = total || 0;
    const V = montantVerse || 0;
    const arrondir100 = (val) => Math.round(val / 100) * 100;

    if (T === 0) {
      setMontantRestant(0);
    } else if (V >= 0 && V <= T) {
      const ratio = T !== 0 ? V / T : 0;
      const reste = (T - V) * (1 - 2.3863 * Math.pow(ratio, 1.855));
      setMontantRestant(arrondir100(reste));
    } else {
      setMontantRestant(arrondir100(T));
    }
  }, [montantVerse, total]);

  useEffect(() => {
    const monthlyAmount =
      mois > 0 && montantRestant > 0
        ? Math.floor(montantRestant / mois)
        : 0;

    if (prelevement > 0) {
      setBreakdown(diviserMontantMensuel(monthlyAmount, prelevement));
    } else {
      setBreakdown([]);
    }
  }, [prelevement, mois, montantRestant]);

useEffect(() => {
    if (selectedClient?.assurance_militaire && selectedClient?.date_expedition) {
      const expiration = dayjs(selectedClient.date_expedition); // date from backend
      if (expiration.isBefore(dayjs(), "day")) {
        setWarning(true);
        setSelectedClient(null);
        onclientChange(""); 
      } else {
        setWarning(false);
      }
    }
  }, [selectedClient, setSelectedClient, onclientChange]);


  return (
    <>
     {warning && (
        <Card
          sx={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffecb5",
            mb: 2,
            borderRadius: 2
          }}
        >
          <CardContent>
            <Typography variant="body1" sx={{ color: "#664d03", fontWeight: "bold" }}>
              ⚠️ هذا الزبون عسكري و تأمينه منتهي الصلاحية، لا يمكنك البيع له.
            </Typography>
            <Button
              onClick={() => setWarning(false)}
              variant="outlined"
              size="small"
              sx={{ mt: 1 }}
            >
              إغلاق
            </Button>
          </CardContent>
        </Card>
      )}
      <Typography variant="h5" color="primary" sx={{ textAlign: "center" }}>
        عملية بيع بالتقسيط
      </Typography>

      {/* Sélection client */}
      {/* <Autocomplete
        options={clientList}
        getOptionLabel={(option) =>
          `${option.nom_famille_ar || ""} ${option.prenom_ar || ""} ${option.ccp||""}`
        }
        value={clientList.find((c) => c.id === clientId) || null}
        onChange={(event, newValue) => {
          const client = newValue || null;
          setSelectedClient(client);
          onclientChange(client ? client.id : "");
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="الزبون"
            size="small"
            sx={{ width: "95%", mt: 2, mb: 2 }}
          />
        )}
        isOptionEqualToValue={(option, value) => option.id === value.id}
      /> */}
      <Autocomplete
  options={clientList}
  getOptionLabel={(option) =>
    `${option.nom_famille_ar || ""} ${option.prenom_ar || ""} ${option.ccp || ""}`
  }
  value={clientList.find((c) => c.id === clientId) || null}
  onChange={(event, newValue) => {
    const client = newValue || null;
    setSelectedClient(client);
    onclientChange(client ? client.id : "");
  }}
  onInputChange={(event, newInputValue) => {
    // fetch filtered results dynamically
    if (newInputValue && newInputValue.length >= 2) {
      axios
        .get(`/auth/clients/?search=${encodeURIComponent(newInputValue)}`)
        .then((res) => setClientList(res.data.results))
        .catch((err) => console.error("Erreur lors de la recherche des clients:", err));
    }
  }}
  renderInput={(params) => (
    <TextField
      {...params}
      label="الزبون"
      size="small"
      sx={{ width: "95%", mt: 2, mb: 2 }}
    />
  )}
  isOptionEqualToValue={(option, value) => option.id === value.id}
/>


      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box display="flex" alignItems="center" gap={5}>
        <Typography variant="body1">الدخل</Typography>
        <Typography variant="body1">
          {selectedClient?.revenu ? `${selectedClient.revenu} دج` : ""}
        </Typography>
      </Box>

      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box display="flex" alignItems="center" gap={5}>
        <Typography variant="body1">الحساب</Typography>
        <Typography variant="body1">
          {selectedClient?.ccp && selectedClient?.cle
            ? `${selectedClient.ccp}/${selectedClient.cle}`
            : ""}
        </Typography>
      </Box>

      {/* Sélection mois */}
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="body1">عدد الأشهر</Typography>
        <FormControl sx={{ minWidth: 170 }} size="small">
          <InputLabel id="mois-label">الشهر</InputLabel>
          <Select
            labelId="mois-label"
            id="select-mois"
            value={mois}
            label="الشهر"
            onChange={(e) => {
              const newValue = e.target.value;
              setMois(newValue);
              if (onMoisChange) onMoisChange(newValue);
            }}
          >
            {[3, 5, 6, 8, 9, 10, 12, 15].map((m) => (
              <MenuItem key={m} value={m}>{`${m} أشهر`}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Dates */}
      <Divider sx={{ mt: 1, mb: 1 }} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display="flex" alignItems="center" gap={3.5}>
          <Typography variant="body1">بداية الدفع</Typography>
          <DatePicker
            label="اختر التاريخ"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            format="YYYY-MM-DD"
            slotProps={{
              textField: { size: "small", variant: "outlined" },
            }}
          />
        </Box>
      </LocalizationProvider>

      <Divider sx={{ mt: 1, mb: 1 }} />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display="flex" alignItems="center" gap={3.5}>
          <Typography variant="body1">نهاية الدفع</Typography>
          <DatePicker
            label="اختر التاريخ"
            value={endDate}
            readOnly
            format="YYYY-MM-DD"
            slotProps={{
              textField: { size: "small", variant: "outlined" },
            }}
          />
        </Box>
      </LocalizationProvider>

      {/* Totaux */}
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box display="flex" alignItems="center" gap={5}>
        <Typography variant="body1">المجموع</Typography>
       <Typography variant="body1">
  {parseInt(total).toLocaleString("fr-DZ")} دج
</Typography>

      </Box>

      <Divider sx={{ mt: 2, mb: 2 }} />
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="body1">المبلغ المسدد</Typography>
        <TextField
          size="small"
          variant="outlined"
          type="number"
          value={montantVerse}
          onChange={(e) => {
            const val = parseFloat(e.target.value || 0);
            const maxAllowed = total * MAX_ADVANCE_PERCENT;
            setMontantVerse(val > maxAllowed ? maxAllowed : val);
          }}
          helperText={`Max autorisé : ${Math.floor(
            total * MAX_ADVANCE_PERCENT
          )} دج`}
        />
      </Box>

      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box display="flex" alignItems="center" gap={5}>
        <Typography variant="body1">المبلغ المتبقي</Typography>
        <Typography variant="body1">{montantRestant} دج</Typography>
      </Box>

      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box display="flex" alignItems="center" gap={5}>
        <Typography variant="body1">المبلغ الشهري</Typography>
        <Typography variant="body1">
          {mois > 0 && montantRestant > 0
            ? Math.floor(montantRestant / mois ) 
            : 0}{" "}
          دج
        </Typography>
      </Box>

      {/* Prélèvement */}
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="body1">تقسيم المبلغ</Typography>
        <FormControl sx={{ minWidth: 170 }} size="small">
          <Select
            labelId="prelevement"
            id="select-prelevemnt"
            value={prelevement}
            label="التقسيم"
            onChange={(e) => setPrelevement(e.target.value)}
          >
            {[1, 2, 3, 4, 5].map((v) => (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Breakdown */}
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Box>
        {breakdown.map((value, index) => (
  <TextField
    key={index}
    size="small"
    type="number"
    value={value}
    sx={{ mb: 1, width: "100%" }}
    onChange={(e) => {
      const newBreakdown = [...breakdown];
      let val = parseFloat(e.target.value || 0);

      // mise à jour de la case modifiée
      newBreakdown[index] = val;

      // ⚡ montant mensuel attendu
      const monthlyAmount =
        mois > 0 && montantRestant > 0
          ? Math.floor(montantRestant / mois)
          : 0;

      // somme actuelle
      const sommeActuelle = newBreakdown.reduce(
        (acc, v) => acc + (parseFloat(v) || 0),
        0
      );

      // différence à compenser
      const diff = monthlyAmount - sommeActuelle;

      if (index !== newBreakdown.length - 1) {
        // compenser sur la dernière case
        newBreakdown[newBreakdown.length - 1] =
          (parseFloat(newBreakdown[newBreakdown.length - 1]) || 0) + diff;
      } else {
        // si on modifie la dernière case → répartir la différence sur les autres
        const reste = monthlyAmount - val;
        const autres = newBreakdown.length - 1;

        if (autres > 0) {
          const repartition = Math.floor(reste / autres);
          for (let i = 0; i < autres; i++) {
            newBreakdown[i] = repartition;
          }
          // ajuster le petit écart sur la première case
          const correction =
            monthlyAmount -
            newBreakdown.reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
          newBreakdown[0] += correction;
        }
      }

      setBreakdown(newBreakdown);
    }}
  />
))}

      </Box>

      {/* Submit */}
      <Divider sx={{ mt: 1, mb: 1 }} />
      <Button
        variant="contained"
        onClick={() => {
          if (montantVerse > total * MAX_ADVANCE_PERCENT) {
            alert(
              `المبلغ المقدم لا يمكن أن يتجاوز ${Math.floor(
                total * MAX_ADVANCE_PERCENT
              )} دج`
            );
            return;
          }
          onSubmit({
            client: selectedClient ? selectedClient.id : null,
            nombre_mois: mois,
            date_debut: startDate ? startDate.format("YYYY-MM-DD") : null,
            date_fin: endDate ? endDate.format("YYYY-MM-DD") : null,
            montant_total: total,
            montant_verse: montantVerse,
            montant_restant: montantRestant,
            montant_mensuel:
              mois > 0 && montantRestant > 0
                ? Math.floor(montantRestant / mois / 100) * 100
                : 0,
            montants_par_mois: breakdown.map((v) => parseFloat(v)),
          });
        }}
        fullWidth
        sx={{ height: "45px", width: "90%", ml: 1 }}
      >
        {isEditMode ? "تعديل" : "حفظ"}
      </Button>
    </>
  );
}
