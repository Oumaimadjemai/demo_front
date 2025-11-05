import { Box, Card, Container, Typography } from "@mui/material";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

export default function DepenseInfo({
  DepenseInfos,
  setDepenseInfo,
  onSave,
  buttonText = "حفظ المعلومات",
}) {
  return (
    <>
      <Container maxWidth="sm" sx={{ mb: 4 }}>
        <Box sx={{ minWidth: 275 }}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
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
              المصاريف
            </Typography>

            <FormControl
              size="small"
              sx={{ width: "95%", mb: "10px", height: "55px" }}
            >
              <InputLabel id="demo-simple-select-label">النوع</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{ height: "100%" }}
                value={DepenseInfos.type_depense}
                onChange={(event) => {
                  setDepenseInfo({
                    ...DepenseInfos,
                    type_depense: event.target.value,
                  });
                }}
              >
                <MenuItem value={"أجور العمال"}>أجور العمال</MenuItem>
                <MenuItem value={"الفواتير"}>الفواتير</MenuItem>
                <MenuItem value={"الكراء"}>الكراء</MenuItem>
                <MenuItem value={"سلع تالفة"}>سلع تالفة</MenuItem>
                <MenuItem value={"ديون"}>ديون</MenuItem>
                <MenuItem value={"ديون خاصة"}>ديون خاصة</MenuItem>
                <MenuItem value={"مساهمين"}>مساهمين</MenuItem>
                <MenuItem value={"مصاريف أخرى"}>مصاريف أخرى</MenuItem>
              </Select>
            </FormControl>
            <FormControl
              size="small"
              sx={{ width: "95%", mb: "10px", height: "55px" }}
            >
              <InputLabel id="demo-simple-select-label">السداد</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{ height: "100%" }}
                value={DepenseInfos.mode_paiement}
                onChange={(event) => {
                  setDepenseInfo({
                    ...DepenseInfos,
                    mode_paiement: event.target.value,
                  });
                }}
              >
                <MenuItem value={"espece"}>Espèces</MenuItem>
                <MenuItem value={"ccp"}>Ccp</MenuItem>
                <MenuItem value={"cheque"}>Chèque</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="طبيعة المصاريف"
              sx={{ width: "95%", mb: "10px" }}
              value={DepenseInfos.libelle}
              onChange={(event) => {
                setDepenseInfo({
                  ...DepenseInfos,
                  libelle: event.target.value,
                });
              }}
            />
            <TextField
              label="القيمة"
              sx={{ width: "95%", mb: "10px" }}
              value={DepenseInfos.montant}
              onChange={(event) => {
                setDepenseInfo({
                  ...DepenseInfos,
                  montant: event.target.value,
                });
              }}
            />
            <Button
              variant="contained"
              sx={{ width: "90%", height: "50px", mb: "20px", mt: "10px" }}
              onClick={onSave}
            >
              {buttonText}
            </Button>
          </Card>
        </Box>
      </Container>
    </>
  );
}
