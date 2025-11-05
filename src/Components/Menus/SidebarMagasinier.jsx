import {
  Drawer,
  List,
  ListItemText,
  Box,
  Collapse,
  Divider,
} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import InventoryIcon from "@mui/icons-material/Inventory";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FolderIcon from "@mui/icons-material/Folder";

import SummarizeIcon from "@mui/icons-material/Summarize";

import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ListAltIcon from "@mui/icons-material/ListAlt";

import LogoutIcon from "@mui/icons-material/Logout";
import GroupIcon from "@mui/icons-material/Group";
import QrCodeIcon from "@mui/icons-material/QrCode";

import TransformIcon from "@mui/icons-material/Transform";

import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";

import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useMemo, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import axios from "../../api/axiosInstance"; // ton instance axios
import { useNavigate } from "react-router-dom";

const drawerWidth = 200;

export default function SidebarMagasinier({ onAction, selectedId }) {
  const navigate = useNavigate();

const handleLogout = async () => {
  const refresh = localStorage.getItem("refresh_token");
  const access = localStorage.getItem("access_token");

  try {
    if (refresh) {
      await axios.post(
        "auth/logout/",
        { refresh },
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
    }
  } catch (error) {
    // Si le token est invalide ou déjà blacklisté, on ignore
    console.warn("Erreur de logout côté serveur :", error.response?.data?.detail);
  } finally {
    // Nettoyage côté front
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    // Redirection vers login
    navigate("/login");
  }
};


  const iconStyle = {
    color: "primary.main",
    width: "20px",
    marginRight: "10px",
  };

  const menuItems = useMemo(
    () => [
      {
        id: "home",
        text: "الصفحة الرئيسية",
        icon: <HomeIcon sx={{ color: "primary.main" }} />,
      },
      {
        id: "file",
        text: "ملف",
        icon: <FolderIcon sx={{ color: "primary.main" }} />,
        children: [
         
          {
            id: "add-product",
            text: "إضافة سلعة",
            icon: <ProductionQuantityLimitsIcon sx={{ ...iconStyle }} />,
          },
          {
            id: "add-fourn",
            text: "إضافة ممون",
            icon: <GroupAddIcon sx={{ ...iconStyle }} />,
          },
          {
            id: "get-product",
            text: "جرد السلع",
            icon: <InventoryIcon sx={{ ...iconStyle }} />,
          },
         
        ],
      },
      {
        id: "lists",
        text: "قوائم",
        icon: <ListAltIcon sx={{ color: "primary.main" }} />,
        children: [
         
          {
            id: "product-list",
            text: "قائمة السلع",
            icon: <InventoryIcon sx={{ ...iconStyle }} />,
          },
          {
            id: "fournisseur-list",
            text: "قائمة الممونين",
            icon: <GroupIcon sx={{ ...iconStyle }} />,
          },
         
          {
            id: "transfert",
            text: "التحويلات",
            icon: <TransformIcon sx={{ ...iconStyle }} />,
          },
          {
            id: "codebar",
            text: "الملصقات",
            icon: <QrCodeIcon sx={{ ...iconStyle }} />,
          },
        ],
      },
      {
        id: "achat",
        text: "الشراء",
        icon: <ShoppingCartIcon sx={{ color: "primary.main" }} />,
        children: [
          {
            id: "nouveau-achat",
            text: "عملية شراء جديدة",
            icon: <FormatListBulletedAddIcon sx={{ ...iconStyle }} />,
          },
          {
            id: "achat-list",
            text: "عرض عمليات الشراء",
            icon: <FormatListBulletedIcon sx={{ ...iconStyle }} />,
          },
        ],
      },
      {
        id: "rapport",
        text: "تقارير",
        icon: <SummarizeIcon sx={{ color: "primary.main" }} />,
        children: [
         
          {
            id: "rapport-produit-vendu",
            text: "تقرير السلع المباعة",
            icon: <BookmarkAddedIcon sx={{ ...iconStyle }} />,
          },
          {
            id: "produit-comparaison",
            text: "مقارنة السلع",
            icon: <ShoppingCartCheckoutIcon sx={{ ...iconStyle }} />,
          },
        ],
      },
      {
        id: "logout",
        text: "تسجيل الخروج",
        icon: <LogoutIcon sx={{ color: "primary.main" }} />,
      },
    ],
    []
  );

  const [openSection, setOpenSection] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const parentIndex = menuItems.findIndex((item) =>
      item.children?.some((child) => child.id === selectedId)
    );

    if (parentIndex !== -1) {
      setOpenSection(parentIndex);
    }
  }, [selectedId, menuItems]);

  const handleToggle = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const handleSelect = (id) => {
    if (onAction) onAction(id);
  };

  return (
    <Drawer
      variant="permanent"
      anchor={theme.direction === "rtl" ? "left" : "right"}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        component="img"
        src="/assets/images/logo.png"
        alt="Logo"
        sx={{ width: 80, height: "auto", ml: "30%", mt: 2 }}
      />

      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          marginTop: "10px",
          "&::-webkit-scrollbar": { width: 0 },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <List>
          {menuItems.map((item, index) => (
            <Box key={item.id}>
              <ListItemButton
                onClick={() => {
                  if (item.id === "logout") {
                    handleLogout();
                  } else {
                    handleToggle(index);
                    handleSelect(item.id);
                  }
                }}
                selected={selectedId === item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1,
                  ...(selectedId === item.id && {
                    backgroundColor: "secondary.main !important",
                    color: "primary.main",
                  }),
                }}
              >
                {item.icon}
                <ListItemText primary={item.text} />
              </ListItemButton>

              {item.children && (
                <Collapse
                  in={openSection === index}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.children.map((subItem) => (
                      <ListItemButton
                        key={subItem.id}
                        onClick={() => handleSelect(subItem.id)}
                        selected={selectedId === subItem.id}
                        sx={{
                          pl: 4,
                          ...(selectedId === subItem.id && {
                            backgroundColor: "secondary.main !important",
                            color: "primary.main",
                          }),
                        }}
                      >
                        {subItem.icon}
                        <ListItemText
                          primary={subItem.text}
                          sx={{ marginRight: 1 }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}

              {index < menuItems.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
