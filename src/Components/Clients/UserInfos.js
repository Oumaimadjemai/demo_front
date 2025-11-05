import { Box, Card, Container } from "@mui/material";
import "./Client.css";
import { TextField, InputAdornment, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { parseISO, format } from "date-fns";

export default function UserInfos({ userInfos, setUserInfos }) {
  return (
    <>
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Box sx={{ minWidth: 275 }}>
          <Card>
            <Typography
              variant="h4"
              sx={{
                textAlign: "center",
                mt: 2,
                mb: 2,
                color: "primary.main",
              }}
            >
              المعلومات الشخصية
            </Typography>
            <TextField
              label="رقم الضمان للعسكر"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              value={userInfos.assurance_militaire}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  assurance_militaire: e.target.value,
                }))
              }
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="تاريخ إنتهاء الصلاحية"
                slotProps={{
                  textField: {
                    size: "small",
                    InputProps: {
                      endAdornment: null, // Remove default icon on right
                      // Add icon on left
                      startAdornment: (
                        <InputAdornment position="start"></InputAdornment>
                      ),
                    },
                  },
                }}
                className="Input-field"
               value={
                  userInfos.date_expedition
                }
                onChange={(newValue) =>
    setUserInfos((prev) => ({
      ...prev,
      date_expedition: newValue, // ✅ on garde Date ici
    }))
  }
              />
            </LocalizationProvider>
            <TextField
              label="اللقب"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              value={userInfos.nom_famille_ar}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  nom_famille_ar: e.target.value,
                }))
              }
            />{" "}
            <TextField
              label="nom"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              value={userInfos.nom_famille_fr}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  nom_famille_fr: e.target.value,
                }))
              }
            />
            <br />
            <TextField
              label="الإسم"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              value={userInfos.prenom_ar}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  prenom_ar: e.target.value,
                }))
              }
            />{" "}
            <TextField
              label="prenom"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              value={userInfos.prenom_fr}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  prenom_fr: e.target.value,
                }))
              }
            />
            <br />
            <TextField
              label="إسم الأب"
              id="outlined-size-small"
              size="small"
              sx={{ margin: "10px", width: "95.5%" }}
              value={userInfos.nom_pere}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  nom_pere: e.target.value,
                }))
              }
            />
            <br />
            <TextField
              label="إسم و لقب الأم"
              id="outlined-size-small"
              size="small"
              sx={{ margin: "10px", width: "95.5%" }}
              value={userInfos.nom_mere}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  nom_mere: e.target.value,
                }))
              }
            />
            <br />
            <TextField
              label="رقم التعريف الوطني"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              sx={{ margin: "10px", width: "95.5%" }}
              value={userInfos.numero_national}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  numero_national: e.target.value,
                }))
              }
            />
            <br />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="تاريخ الإزدياد"
                slotProps={{
                  textField: {
                    size: "small",
                    InputProps: {
                      endAdornment: null, // Remove default icon on right
                      // Add icon on left
                      startAdornment: (
                        <InputAdornment position="start"></InputAdornment>
                      ),
                    },
                  },
                }}
                className="Input-field"
                // value={
                //   userInfos.date_naissance
                //     ? new Date(userInfos.date_naissance) // ✅ Convert string -> Date
                //     : null
                // }
                value={userInfos.date_naissance}
                // onChange={(newValue) =>
                //   setUserInfos((prev) => ({
                //     ...prev,
                //     date_naissance: newValue
                //       ? newValue.toISOString().split("T")[0] // ✅ Store as "yyyy-MM-dd"
                //       : "",
                //   }))
                // }
                onChange={(newValue) =>
    setUserInfos((prev) => ({
      ...prev,
      date_naissance: newValue, // ✅ on garde Date ici
    }))
  }
              />
            </LocalizationProvider>
            <TextField
              label="مكان الإزدياد"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              value={userInfos.lieu_naissance}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  lieu_naissance: e.target.value,
                }))
              }
            />
            <br />
            <TextField
              label="العنوان"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              value={userInfos.adresse}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  adresse: e.target.value,
                }))
              }
            />
            <TextField
              label="الهاتف"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              value={userInfos.telephone}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  telephone: e.target.value,
                }))
              }
            />
            <br />
            <TextField
              label="المهنة"
              id="outlined-size-small"
              size="small"
              sx={{ margin: "10px", width: "95.5%" }}
              value={userInfos.profession}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  profession: e.target.value,
                }))
              }
            />
            <br />
            <TextField
              label="الدخل"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              value={userInfos.revenu}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  revenu: e.target.value,
                }))
              }
            />{" "}
            <FormControl size="small" className="Input-field">
              <InputLabel id="demo-simple-select-label">اليوم</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                value={userInfos.jour || ""}
                onChange={(e) =>
                  setUserInfos((prev) => ({
                    ...prev,
                    jour: e.target.value,
                  }))
                }
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={11}>11</MenuItem>
                <MenuItem value={12}>12</MenuItem>
                <MenuItem value={13}>13</MenuItem>
                <MenuItem value={14}>14</MenuItem>
                <MenuItem value={15}>15</MenuItem>
                <MenuItem value={16}>16</MenuItem>
                <MenuItem value={17}>17</MenuItem>
                <MenuItem value={18}>18</MenuItem>
                <MenuItem value={19}>19</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={21}>21</MenuItem>
                <MenuItem value={22}>22</MenuItem>
                <MenuItem value={23}>23</MenuItem>
                <MenuItem value={24}>24</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={26}>26</MenuItem>
                <MenuItem value={27}>27</MenuItem>
                <MenuItem value={28}>28</MenuItem>
                <MenuItem value={29}>29</MenuItem>
                <MenuItem value={30}>30</MenuItem>
              </Select>
            </FormControl>
            <br />
            <FormControl size="small" className="Input-field">
              <InputLabel id="demo-simple-select-label">
                وثيقة التعريف
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Age"
                value={userInfos.type_piece_identite || ""}
                onChange={(e) =>
                  setUserInfos((prev) => ({
                    ...prev,
                    type_piece_identite: e.target.value,
                  }))
                }
              >
                <MenuItem value={"بطاقة التعريف الوطنية "}>
                  بطاقة التعريف
                </MenuItem>
                <MenuItem value={"جواز السفر "}>جواز السفر</MenuItem>
                <MenuItem value={"رخصة السياقة "}>رخصة السياقة</MenuItem>
              </Select>
            </FormControl>{" "}
            <TextField
              label="الرقم"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              value={userInfos.numero_piece_identite}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  numero_piece_identite: e.target.value,
                }))
              }
            />
            <br />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="تاريخ الإصدار"
                slotProps={{
                  textField: {
                    size: "small",
                    InputProps: {
                      endAdornment: null, // Remove default icon on right
                      // Add icon on left
                      startAdornment: (
                        <InputAdornment position="start"></InputAdornment>
                      ),
                    },
                  },
                }}
                className="Input-field"
                //  value={
                //   userInfos.date_emission_piece
                //     ? new Date(userInfos.date_emission_piece) // ✅ Convert string -> Date
                //     : null
                // }
                value={userInfos.date_emission_piece}
                // onChange={(newValue) =>
                //   setUserInfos((prev) => ({
                //     ...prev,
                //     date_emission_piece: newValue
                //       ? newValue.toISOString().split("T")[0] // ✅ Store as "yyyy-MM-dd"
                //       : "",
                //   }))
                // }
                onChange={(newValue) =>
    setUserInfos((prev) => ({
      ...prev,
      date_emission_piece: newValue, // ✅ on garde Date ici
    }))
  }
              />
            </LocalizationProvider>{" "}
            <TextField
              label="مكان الإصدار"
              id="outlined-size-small"
              size="small"
              className="Input-field"
              value={userInfos.lieu_emission_piece}
              onChange={(e) =>
                setUserInfos((prev) => ({
                  ...prev,
                  lieu_emission_piece: e.target.value,
                }))
              }
            />
          </Card>
        </Box>
      </Container>
    </>
  );
}
