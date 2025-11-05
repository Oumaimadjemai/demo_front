import { Box, Card, Container, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";

export default function PostInfos({ userInfos, setUserInfos }) {
  // Function to calculate CLE from CCP
  const calculateCle = (ccp) => {
    if (!ccp || isNaN(ccp)) return "";
    let z = (parseInt(ccp) * 100) % 97;
    if (z > 12) z -= 12;
    z = 97 - z;
    return z < 10 ? "0" + z : "" + z;
  };

  const handleCCPChange = (e) => {
    const newCcp = e.target.value.replace(/\D/g, ""); // allow digits only
    setUserInfos((prev) => ({
      ...prev,
      ccp: newCcp,
      cle: calculateCle(newCcp), // auto update cle
    }));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minWidth: 275 }}>
        <Card sx={{ p: 2,bgcolor:'#f9f871' }}>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mt: 2,
              mb: 2,
              color: "primary.main",
            }}
          >
            معلومات الحساب البريدي
          </Typography>

          {/* CLE field */}
         

          {/* CCP field */}
          <TextField
            label="رقم الحساب"
            size="small"
            sx={{ width: "78% !important" ,mr:2}}
            value={userInfos.ccp}
            onChange={handleCCPChange} // Auto update cle
          />
           <TextField
            label="المفتاح"
            size="small"
            sx={{ width: "17% !important" }}
            value={userInfos.cle}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                cle: e.target.value,
              }))
            }
          />

          {/* Code field */}
          <TextField
            label="الرمز السري"
            size="small"
            sx={{ width: "99% !important", mt: 2 }}
            value={userInfos.code}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                code: e.target.value,
              }))
            }
          />
          <br />

          {/* Initial debt */}
          <TextField
            label="ديون إبتدائية"
            size="small"
            sx={{ width: "99% !important", mt: 2 }}
            value={userInfos.dette_initiale}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                dette_initiale: e.target.value,
              }))
            }
          />
          <br />

          {/* Notes */}
          <TextField
            label="ملاحظات"
            multiline
            rows={5}
            sx={{ width: "99%", textAlign: "right", mt: 2 }}
            value={userInfos.note}
            onChange={(e) =>
              setUserInfos((prev) => ({
                ...prev,
                note: e.target.value,
              }))
            }
          />
        </Card>
      </Box>
    </Container>
  );
}
