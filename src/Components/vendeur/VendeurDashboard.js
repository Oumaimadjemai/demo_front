
import Grid from "@mui/material/GridLegacy";

import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import DashboardHome from "./Home";
import ClientBoard from "../Clients/ClientBoard";
import ProduitBoard from "../Produits/ProduitBoard";
import AddAchat from "../Achats/AddAchat";
import AchatBoard from "../Achats/AchatBoard";
import CodebarresBoard from "../Codebarres/CodebarresBoard";
import InventaireStock from "../Produits/InventaireStock";
import AddVente from "../ventes/vente-cache/AddVente";
import VenteBoard from "../ventes/vente-cache/VenteBoard";
import AddVenteFacilite from "../ventes/vente-facilite/AddVenteFacilite";
import VenteBoardFacilite from "../ventes/vente-facilite/VenteBoard";
import MatrixTable from "../Rapports/EcheanceClient/MatrixTable";
import PaymentReport from "../Rapports/RapportPoste/PosteBoard";
import InventoryQuantities from "../Rapports/ComparaisonProduits/ComparaisonBoard";
import Header from "../Menus/Header";
import AddProduit from "../Produits/AddProduit";
import AddFournisseur from "../Fournisseurs/AddFournisseur";

import AddClient from "../Clients/AddClient";
import SidebarVendeur from "../Menus/SidebarVendeur";
export default function VendeurDashboard() {
  const [openAddClientDialog, setOpenAddClientDialog] = useState(false);
  const [openAddProductDialog, setOpenAddProductDialog] = useState(false);
  const [openAddFournisseurDialog, setOpenAddFournisseurtDialog] =
    useState(false);

  // Change activeComponent to handle both string and object
  const [activeComponent, setActiveComponent] = useState({ name: "home" });

  useEffect(() => {
    const storedId = localStorage.getItem("selectedSidebarId");
    if (storedId) {
      setActiveComponent({ name: storedId });
    }
  }, []);

  const handleAction = (actionId) => {
    localStorage.setItem("selectedSidebarId", actionId);
    switch (actionId) {
      case "add-client":
        setOpenAddClientDialog(true);
        break;
      case "add-product":
        setOpenAddProductDialog(true);
        break;
      case "add-fourn":
        setOpenAddFournisseurtDialog(true);
        break;
     
      case "client-list":
      case "lists":
      case "product-list":
      case "nouveau-achat":
      case "achat":
      case "achat-list":
      case "home":
      case "codebar":
      case "get-product":
      case "vente":
      case "nouveau-vente-cache":
      case "vente-cache-list":
      case "nouveau-vente-facilite":
      case "vente-facilite-list":
      case "rapport":
      case "depense-client":
      case "rapport-poste":
      case "produit-comparaison":
      
        setActiveComponent({ name: actionId });
        break;
      default:
        setActiveComponent({ name: "home" });
        break;
    }
  };

  // Component switching logic
  const renderComponent = () => {
    switch (activeComponent.name) {
      case "home":
        return <DashboardHome/>
      case "lists":
      case "client-list":
        return <ClientBoard />;
      case "product-list":
        return <ProduitBoard />;
      case "achat":
      case "nouveau-achat":
        return <AddAchat isEditMode={false} />;
      case "edit-achat":
        return <AddAchat {...activeComponent.props} />;

      case "achat-list":
        return <AchatBoard setActiveComponent={setActiveComponent} />;
      case "codebar":
        return <CodebarresBoard />;
      case "get-product":
        return <InventaireStock />;
      case "nouveau-vente-cache":
      case "vente":
        return <AddVente isEditMode={false} />;
      case "vente-cache-list":
        return <VenteBoard setActiveComponent={setActiveComponent} />;
      case "nouveau-vente-facilite":
        return <AddVenteFacilite isEditMode={false}/>
      case "vente-facilite-list":
        return <VenteBoardFacilite setActiveComponent={setActiveComponent}/>;
      case "rapport-vente":
      case "rapport":
      case "depense-client":
        return <MatrixTable/>
      case "rapport-poste":
        return <PaymentReport/>
      case "produit-comparaison":
        return <InventoryQuantities/>
      default:
        return null;
    }
  };

  return (
    <>
      <Grid container sx={{ height: "100vh" }}>
        <Grid
          item
          xs={2}
          sx={{ bgcolor: "#f5f5f5", borderRight: "1px solid #ddd" }}
        >
          <SidebarVendeur onAction={handleAction} selectedId={activeComponent.name} />
        </Grid>

        <Grid item xs={10} sx={{ p: 1, overflowY: "auto" }}>
          
            <Header />
            {/* <Box sx={{ height: "5px", bgcolor:"primary.main",my:1}} /> */}
            {renderComponent()}
        </Grid>
      </Grid>
      <Dialog
        open={openAddClientDialog}
        onClose={() => setOpenAddClientDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse", // 🡐 Title on the right, icon on the left
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenAddClientDialog(false)}
              sx={{
                color: (theme) => theme.palette.error.main, // optional red color
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              sx={{ ml: "10px" }}
              color="primary"
            >
              إضافة زبون
            </Typography>
          </Box>
        </DialogTitle>

        {/* The form content */}
        <AddClient setOpenAddClientDialog={setOpenAddClientDialog} />
      </Dialog>
      <Dialog
        open={openAddProductDialog}
        onClose={() => setOpenAddProductDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse", // 🡐 Title on the right, icon on the left
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenAddProductDialog(false)}
              sx={{
                color: (theme) => theme.palette.error.main, // optional red color
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              sx={{ ml: "10px" }}
              color="primary"
            >
              إضافة سلعة
            </Typography>
          </Box>
        </DialogTitle>

        {/* The form content */}
        <AddProduit setOpenAddProductDialog={setOpenAddProductDialog} />
      </Dialog>
      <Dialog
        open={openAddFournisseurDialog}
        onClose={() => setOpenAddFournisseurtDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse", // 🡐 Title on the right, icon on the left
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenAddFournisseurtDialog(false)}
              sx={{
                color: (theme) => theme.palette.error.main, // optional red color
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              sx={{ ml: "10px" }}
              color="primary"
            >
              إضافة ممون
            </Typography>
          </Box>
        </DialogTitle>

        {/* The form content */}
        <AddFournisseur
          setOpenAddFournisseurtDialog={setOpenAddFournisseurtDialog}
        />
      </Dialog>
    </>
  );
}
