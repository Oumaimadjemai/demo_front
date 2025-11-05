import { Box, Card, Container, Typography } from "@mui/material";
import { TextField } from "@mui/material";

export default function CodeBar({ ProductInfo, setProductInfo }) {
  const handleChange = (e) => {
    const input = e.target.value;

    // Update both raw input and parsed codes
    setProductInfo((prev) => ({
      ...prev,
      codes_barres_raw: input, // store exactly what user typed
      codes_barres: input
        .split(",")
        .map((code) => code.trim())
        .filter((code) => code !== ""),
    }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ minWidth: 275 }}>
        <Card
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor:"#f9f871"
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
            كود بار
          </Typography>
          <TextField
            multiline
            rows={3}
            sx={{ width: "95%", mb: "10px" }}
            value={ProductInfo.codes_barres_raw || ""}
            InputProps={{ readOnly: true }}
            onChange={handleChange}
            onKeyDown={(e) => {
              // Allow comma key to be typed
              if (e.key === ",") {
                e.stopPropagation();
              }
            }}
          />
        </Card>
      </Box>
    </Container>
  );
}
