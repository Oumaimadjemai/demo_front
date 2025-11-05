import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";
import { useState } from "react";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errorInput, setErrorInput] = useState("");

  const Navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("auth/token/", {
        username,
        password,
      });

      const user = response.data.user;
      const role=user.role;
      const { access, refresh } = response.data;
      const features=user.features;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("username",username);
      localStorage.setItem("role",role)
      localStorage.setItem("features", JSON.stringify(user.features));


      setRole(user.role);
      setPassword(""); // Immediately clear password
      console.log("response:", response.data);

      if (user.role === "admin") {
        Navigate("/admin");
      } else if (user.role === "vendeur") {
        Navigate("/vendeur");
      }
      else if (user.role==="magasinier"){
        Navigate("/magasinier");
      }
    } catch (error) {
      console.error("Login failed", error);
      setErrorInput("فشل تسجيل الدخول: تحقق من اسم المستخدم أو كلمة السر");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: "25%" }}>
      <Box sx={{ minWidth: 275 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              textAlign: "center",
              mt: 2,
              mb:2,
              color: "primary.main",
            }}
          >
            تسجيل الدخول
          </Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            sx={{
              marginBottom: "20px",
              width: "90%",
              textAlign: "right",
            }}
            placeholder="اسم المستخدم"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            id="outlined-basic"
            variant="outlined"
            sx={{
              width: "90%",
              textAlign: "right",
              marginBottom: "20px",
            }}
            type="password"
            placeholder="كلمة السر"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  }}
          />
          <label
            style={{ marginRight: "25px", color: "red", marginBottom: "20px" }}
          >
            {errorInput}
          </label>

          <Button
            variant="contained"
            disableElevation
            sx={{
              width: "90%",
              marginBottom: "20px",
              bgcolor: "primary.main",
              color:"white",
              fontSize:"20px"
            }}
            onClick={handleLogin}
          >
            دخول
          </Button>
        </Card>
      </Box>
    </Container>
  );
}
