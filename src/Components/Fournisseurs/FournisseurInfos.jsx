import { Box, Card, Container, Typography } from "@mui/material";
import { TextField } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";


export default function FournisseurInfos({fournisseurInfos, setFournisseurInfo, onSave, buttonText = "حفظ المعلومات" }) {
 
  return (
    <>
      <Container maxWidth="sm" sx={{mb:4}}>
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
              معلومات الممون
            </Typography>
            <TextField
              label="إسم الممون"
              sx={{ width: "95%", mb: "10px" }}
              value={fournisseurInfos.nom}
              onChange={(event) => {
                setFournisseurInfo({
                  ...fournisseurInfos,
                  nom: event.target.value,
                });
              }}
            />
            <TextField
              label="العنوان"
              sx={{ width: "95%", mb: "10px" }}
              value={fournisseurInfos.adresse}
              onChange={(event) => {
                setFournisseurInfo({
                  ...fournisseurInfos,
                  adresse: event.target.value,
                });
              }}
            />
            <TextField
              label="رقم الهاتف"
              sx={{ width: "95%", mb: "10px" }}
              value={fournisseurInfos.telephone}
              onChange={(event) => {
                setFournisseurInfo({
                  ...fournisseurInfos,
                  telephone: event.target.value,
                });
              }}
            />
            <FormControl
              size="small"
              sx={{ width: "95%", mb: "10px", height: "55px" }}
            >
              <InputLabel id="demo-simple-select-label">الولاية</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                sx={{ height: "100%" }}
                value={fournisseurInfos.wilaya}
                onChange={(event) => {
                  setFournisseurInfo({
                    ...fournisseurInfos,
                    wilaya: event.target.value,
                  });
                }}
              >
                <MenuItem value={"01"}>Adrar / أدرار</MenuItem>
                <MenuItem value={"02"}>Chlef / الشلف</MenuItem>
                <MenuItem value={"03"}>Laghouat / الأغواط</MenuItem>
                <MenuItem value={"04"}>Oum El Bouaghi / أم البواقي</MenuItem>
                <MenuItem value={"05"}>Batna / باتنة</MenuItem>
                <MenuItem value={"06"}>Béjaïa / بجاية</MenuItem>
                <MenuItem value={"07"}>Biskra / بسكرة</MenuItem>
                <MenuItem value={"08"}>Béchar / بشار</MenuItem>
                <MenuItem value={"09"}>Blida / البليدة</MenuItem>
                <MenuItem value={"10"}>Bouira / البويرة</MenuItem>
                <MenuItem value={"11"}>Tamanrasset / تمنراست</MenuItem>
                <MenuItem value={"12"}>Tébessa / تبسة</MenuItem>
                <MenuItem value={"13"}>Tlemcen / تلمسان</MenuItem>
                <MenuItem value={"14"}>Tiaret / تيارت</MenuItem>
                <MenuItem value={"15"}>Tizi Ouzou / تيزي وزو</MenuItem>
                <MenuItem value={"16"}>Alger / الجزائر</MenuItem>
                <MenuItem value={"17"}>Djelfa / الجلفة</MenuItem>
                <MenuItem value={"18"}>Jijel / جيجل</MenuItem>
                <MenuItem value={"19"}>Sétif / سطيف</MenuItem>
                <MenuItem value={"20"}>Saïda / سعيدة</MenuItem>
                <MenuItem value={"21"}>Skikda / سكيكدة</MenuItem>
                <MenuItem value={"22"}>Sidi Bel Abbès / سيدي بلعباس</MenuItem>
                <MenuItem value={"23"}>Annaba / عنابة</MenuItem>
                <MenuItem value={"24"}>Guelma / قالمة</MenuItem>
                <MenuItem value={"25"}>Constantine / قسنطينة</MenuItem>
                <MenuItem value={"26"}>Médéa / المدية</MenuItem>
                <MenuItem value={"27"}>Mostaganem / مستغانم</MenuItem>
                <MenuItem value={"28"}>M'Sila / المسيلة</MenuItem>
                <MenuItem value={"29"}>Mascara / معسكر</MenuItem>
                <MenuItem value={"30"}>Ouargla / ورقلة</MenuItem>
                <MenuItem value={"31"}>Oran / وهران</MenuItem>
                <MenuItem value={"32"}>El Bayadh / البيض</MenuItem>
                <MenuItem value={"33"}>Illizi / اليزي</MenuItem>
                <MenuItem value={"34"}>
                  Bordj Bou Arreridj / برج بوعريريج
                </MenuItem>
                <MenuItem value={"35"}>Boumerdès / بومرداس</MenuItem>
                <MenuItem value={"36"}>El Tarf / الطارف</MenuItem>
                <MenuItem value={"37"}>Tindouf / تندوف</MenuItem>
                <MenuItem value={"38"}>Tissemsilt / تسمسيلت</MenuItem>
                <MenuItem value={"39"}>El Oued / الوادي</MenuItem>
                <MenuItem value={"40"}>Khenchela / خنشلة</MenuItem>
                <MenuItem value={"41"}>Souk Ahras / سوق أهراس</MenuItem>
                <MenuItem value={"42"}>Tipaza / تيبازة</MenuItem>
                <MenuItem value={"43"}>Mila / ميلة</MenuItem>
                <MenuItem value={"44"}>Aïn Defla / عين الدفلى</MenuItem>
                <MenuItem value={"45"}>Naâma / النعامة</MenuItem>
                <MenuItem value={"46"}>Aïn Témouchent / عين تموشنت</MenuItem>
                <MenuItem value={"47"}>Ghardaïa / غرداية</MenuItem>
                <MenuItem value={"48"}>Relizane / غليزان</MenuItem>
                <MenuItem value={"49"}>Timimoun / تيميمون</MenuItem>
                <MenuItem value={"50"}>
                  Bordj Badji Mokhtar / برج باجي مختار
                </MenuItem>
                <MenuItem value={"51"}>Ouled Djellal / أولاد جلال</MenuItem>
                <MenuItem value={"52"}>Béni Abbès / بني عباس</MenuItem>
                <MenuItem value={"53"}>In Salah / عين صالح</MenuItem>
                <MenuItem value={"54"}>In Guezzam / عين قزام</MenuItem>
                <MenuItem value={"55"}>Touggourt / تقرت</MenuItem>
                <MenuItem value={"56"}>Djanet / جانت</MenuItem>
                <MenuItem value={"57"}>El M'Ghair / المغير</MenuItem>
                <MenuItem value={"58"}>El Menia / المنيعة</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="الدين الإبتدائي"
              sx={{ width: "95%", mb: "10px" }}
              value={fournisseurInfos.dettes_initiales}
              onChange={(event) => {
                setFournisseurInfo({
                  ...fournisseurInfos,
                  dettes_initiales: event.target.value,
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
