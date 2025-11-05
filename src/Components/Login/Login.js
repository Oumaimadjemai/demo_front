import Grid from "@mui/material/GridLegacy";
import LoginPage from "./LoginPage";
import SideLoginPage from "./SideLoginPage";

export default function Login() {
  return (
    <>
      <Grid
        container
        sx={{
          height: "100vh",
          margin: 0,
          padding: 0,
        }}
      >
        <Grid item xs={6}>
          <LoginPage />
        </Grid>
        <Grid item xs={6}>
          <SideLoginPage />
        </Grid>
      </Grid>
    </>
  );
}
