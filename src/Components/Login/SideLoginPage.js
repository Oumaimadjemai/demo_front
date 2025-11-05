import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardMedia from "@mui/material/CardMedia";

export default function SideLoginPage() {
  return (
    <Card
      sx={{
        bgcolor: "primary.main",
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        m: "0px !important",
        p: "0px !important",
        borderRadius: "0px !important", // important to remove corner rounding
        boxShadow: "none !important", // remove default shadow if needed
      }}
    >
      
      <CardMedia
        component="img"
        image="/assets/images/undraw_login_weas.svg"
        alt="Login Illustration"
        sx={{ maxWidth: 300, p: 2 }}
      />
    </Card>
  );
}
