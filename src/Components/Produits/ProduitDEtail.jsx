import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Stack,
  Button,
  ButtonGroup,
} from "@mui/material";
import { useState } from "react";
import DetailAchatProduit from "./DetailAchatProduit";
import DetailVenteFacilite from "./DetailVenteFacilite";
import DetailVenteCash from "./DetailVenteCash";

export default function ProduitDetail({ produit }) {
  const [activeButton, setActiveButton] = useState(0);

  const role = localStorage.getItem("role"); // ✅ Get role from localStorage
  const buttons = ["الكمية", "المشتريات", "المبيعات بالتقسيط", "المبيعات كاش"];

  if (!produit) return null;

  const renderContent = () => {
    switch (activeButton) {
      case 0:
        return (
          <Stack spacing={2} direction={"row"}>
            {/* Left side: Product Info */}
            <Stack width={"50%"} bgcolor={"white"} p={2} borderRadius={2}>
              <Card>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>الاسم</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {`${produit.nom || ""} `}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>العائلة</TableCell>
                        <TableCell>{`${produit.famille || ""}`}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>الكمية</TableCell>
                        <TableCell>{`${produit.quantite || 0} `}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>المخزن</TableCell>
                        <TableCell>{`${
                          produit.magasin_detail.nom || ""
                        } `}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </Stack>

            {/* Right side: Image */}
            <Stack width={"50%"} p={2} borderRadius={2}>
              <Card sx={{ bgcolor: "#f5f5f5", color: "black" }}>
                <CardContent sx={{ textAlign: "center" }}>
                  {produit.image ? (
                    <Box
                      component="img"
                      src={produit.image}
                      alt={produit.nom}
                      sx={{
                        maxWidth: "100%",
                        maxHeight: 300,
                        objectFit: "contain",
                        borderRadius: 2,
                      }}
                    />
                  ) : (
                    <Typography variant="body1">
                      🚫 لا توجد صورة متاحة
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        );

      case 1:
        // ✅ Purchases tab
        return role === "admin" ? (
          <DetailAchatProduit produitId={produit.id} />
        ) : (
          <Typography align="center" color="error" mt={4}>
            ⚠️ ليس لديك صلاحية لعرض المشتريات
          </Typography>
        );

      case 2:
        return role === "admin" ? (
          <DetailVenteFacilite produitId={produit.id} />
        ) : (
          <Typography align="center" color="error" mt={4}>
            ⚠️ ليس لديك صلاحية لعرض المبيعات
          </Typography>
        );

      case 3:
         return role === "admin" ? (
          <DetailVenteCash produitId={produit.id} />
        ) : (
          <Typography align="center" color="error" mt={4}>
            ⚠️ ليس لديك صلاحية لعرض المبيعات
          </Typography>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 2, bgcolor: "#e0f7fa", height: "100%" }}>
      {/* Header with tab buttons */}
      <Box
        sx={{
          bgcolor: "#0097a7",
          color: "white",
          p: 2,
          mr: 1.5,
          mb: 2,
          borderRadius: 1,
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {`المنتج رقم: ${produit.id || ""}`}

        <ButtonGroup variant="contained" color="primary">
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              onClick={() => setActiveButton(idx)}
              sx={{
                bgcolor: activeButton === idx ? "primary.dark" : "primary.main",
              }}
            >
              {btn}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Tab Content */}
      {renderContent()}
    </Box>
  );
}
