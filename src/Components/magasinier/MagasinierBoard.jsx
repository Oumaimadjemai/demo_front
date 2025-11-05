
import Grid from "@mui/material/GridLegacy";
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import DashboardHome from "../vendeur/Home";
import ProduitBoard from "../Produits/ProduitBoard";
import FournisseurBoard from "../Fournisseurs/FournisseurBoard";
import TransfertBoard from "../transferts/TransfertBoard";
import AddAchat from "../Achats/AddAchat";
import AchatBoard from "../Achats/AchatBoard";
import CodebarresBoard from "../Codebarres/CodebarresBoard";
import InventaireStock from "../Produits/InventaireStock";
import InventoryQuantities from "../Rapports/ComparaisonProduits/ComparaisonBoard";
import SalesReport from "../Rapports/RapportProduitVendu/ProduitVenduBoard";
import SidebarMagasinier from "../Menus/SidebarMagasinier";
import Header from "../Menus/Header";
import AddProduit from "../Produits/AddProduit";
import AddFournisseur from "../Fournisseurs/AddFournisseur";

export default function MagasinierDashboard() {
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
      case "add-product":
        setOpenAddProductDialog(true);
        break;
      case "add-fourn":
        setOpenAddFournisseurtDialog(true);
        break;
     
      
      case "lists":
      case "product-list":
      case "fournisseur-list":
      case "transfert":
      case "nouveau-achat":
      case "achat":
      case "achat-list":
      case "home":
      case "codebar":
      case "get-product":
      case "rapport":
      case "produit-comparaison":
      case "rapport-produit-vendu":
      
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
      case "product-list":
        return <ProduitBoard />;
      case "fournisseur-list":
        return <FournisseurBoard />;
      case "transfert":
        return <TransfertBoard />;
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
      case "rapport":
      case "produit-comparaison":
        return <InventoryQuantities/>
      case "rapport-produit-vendu":
        return <SalesReport/>
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
          <SidebarMagasinier onAction={handleAction} selectedId={activeComponent.name} />
        </Grid>

        <Grid item xs={10} sx={{ p: 1, overflowY: "auto" }}>
          
            <Header />
            {/* <Box sx={{ height: "5px", bgcolor:"primary.main",my:1}} /> */}
            {renderComponent()}
        </Grid>
      </Grid>
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
