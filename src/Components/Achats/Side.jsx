import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";

export default function Side({
  rows,
  fournisseurId,
  onFournisseurChange,
  sommePayee,
  onSommePayeeChange,
  sommeRestante,
  onSubmit,
  isEditMode
}) {
  const [fournisseurList, setFournisseurList] = useState([]);

  const [total, setTotal] = useState(0); // Tu peux changer cette valeur selon le total réel

  useEffect(() => {
    const totalAmount = rows.reduce((acc, row) => acc + row.total, 0);
    setTotal(totalAmount);
  }, [rows]);

  useEffect(() => {
    axios
      .get("/auth/fournisseurs/")
      .then((res) => setFournisseurList(res.data.results))
      .catch((err) =>
        console.error("Erreur lors du chargement des fournisseurs:", err)
      );
  }, []);

  return (
    <>
      <FormControl
        size="small"
        className="Input-field"
        sx={{ width: "90%", mt: 2, mb: 2 }}
      >
        <InputLabel id="demo-simple-select-label">ممون</InputLabel>
        <Select
          labelId="fournisseur-label"
          id="fournisseur"
          label="ممون"
          value={fournisseurId}
          onChange={(e) => onFournisseurChange(e.target.value)}
        >
          {fournisseurList.map((f) => (
            <MenuItem key={f.id} value={f.id}>
              {f.nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Divider sx={{ mt: 2, mb: 2 }} />
      <Typography variant="h3" textAlign="center" sx={{ mt: 2 }}>
        المجموع
      </Typography>
      <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
        {total} دج
      </Typography>
      <Divider sx={{ mt: 2, mb: 2 }} />
      <TextField
        label="المبلغ المدفوع"
        id="outlined-size-small"
        size="small"
        className="Input-field"
        sx={{ width: "90%" }}
        value={sommePayee}
        onChange={(e) => onSommePayeeChange(e.target.value)}
      />
      <br />
      <TextField
        label="المبلغ المتبقي"
        id="outlined-size-small"
        size="small"
        className="Input-field"
        sx={{ width: "90%" }}
        value={sommeRestante}
        InputProps={{ readOnly: true }}
      />
      <Divider sx={{ mt: 2, mb: 2 }} />
      {/* <Button
        variant="contained"
        sx={{ height: "45px", mt: 2, width: "90%", ml: 1 }}
        onClick={onSubmit}
      >
        حفظ
      </Button> */}
      <Button variant="contained" onClick={onSubmit} fullWidth sx={{ height: "45px", mt: 2, width: "90%", ml: 1 }}>
        {isEditMode ? "تعديل" : "حفظ"}
      </Button>
      <br />
      <Button
        variant="contained"
        sx={{ height: "45px", mt: 2, width: "90%", ml: 1 }}
      >
        طباعة
      </Button>
    </>
  );
}
