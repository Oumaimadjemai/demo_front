import { Stack, CircularProgress, Box } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import ExtraCard from "./ExtraCard";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import FilterPanel from "../../Clients/FilterPanel";
import { useEffect, useState } from "react";
import axios from "../../../api/axiosInstance";
import VersementTable from "./Cashtable";
import MonthsTable from "./MonthsTable";
import UsersVente from "./UsersVente";
import AnalyseTotal from "./AnaylseTotal";
import ProductDetail from "./ProductDetail";
import TopProductCash from "./TopProductCash";
import BestClient from "./BestClient";
import BestClientCash from "./BestClientCash";
import dayjs from "dayjs";

export default function Dashboard() {
  const [filters, setFilters] = useState({
    periode: "today",
    date_from: null,
    date_to: null,
    users: "",
  });

  const [totaux, setTotaux] = useState({
    total_montant_total: 0,
    total_montant_verse: 0,
    total_montant: 0,
    total_ventes: 0,
    nombre_de_ventes: 0,
    total_montant_depense: 0,
    pourcentage_benefice_total: 0,
    benefice_total: 0,
  });

  const [users, setUsers] = useState([]);
  const [userPayments, setUserPayments] = useState([]);
  const [topProduits, setTopProduits] = useState([]);
  const [topProduitsCash, setTopProduitsCash] = useState([]);
  const [topClientsFacilite, setTopClientsFacilite] = useState([]);
  const [topClientsCash, setTopClientsCash] = useState([]);

  // ✅ Loading states
  const [loadingTotals, setLoadingTotals] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "content-Type": "application/json",
  };

  // Load all users once
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/auth/users/", { headers });
        setUsers(res.data.results);
      } catch (err) {
        console.error("Erreur lors du chargement des users", err);
      }
    };
    fetchUsers();
  }, []);

  // Helper to build params
  const buildParams = (appliedFilters) => {
    let fromDate = appliedFilters.date_from;
    let toDate = appliedFilters.date_to;
    if (fromDate && toDate && dayjs(fromDate).isAfter(dayjs(toDate))) {
      [fromDate, toDate] = [toDate, fromDate];
    }

    return {
      ...appliedFilters,
      date_from: fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : null,
      date_to: toDate ? dayjs(toDate).format("YYYY-MM-DD") : null,
    };
  };

  // 1️⃣ Load global totals
  const fetchTotals = async (appliedFilters = filters) => {
    const params = buildParams(appliedFilters);
    setLoadingTotals(true);
    try {
      const [facilite, ventes, depenses] = await Promise.all([
        axios.get("/vente/ventes-facilite/", { headers, params }),
        axios.get("/vente/liste/", { headers, params }),
        axios.get("/depense/depenses/", { headers, params }),
      ]);

      setTotaux({
        total_montant_total: facilite.data.total_montant_total || 0,
        total_montant_verse: facilite.data.total_montant_verse || 0,
        total_ventes: facilite.data.total_ventes || 0,
        total_montant: ventes.data.total_montant || 0,
        nombre_de_ventes: ventes.data.nombre_de_ventes || 0,
        total_montant_depense: depenses.data.totaux_globaux.total_montant || 0,
        pourcentage_benefice_total:
          facilite.data.pourcentage_benefice_total || 0,
        benefice_total: facilite.data.benefice_total || 0,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des totaux :", error);
    } finally {
      setLoadingTotals(false);
    }
  };

  // 2️⃣ Load user payments
  const fetchUserPayments = async (appliedFilters = filters) => {
    // Wait until users are loaded if we need "all"
    if (!appliedFilters.users && users.length === 0) return;

    setLoadingUsers(true);
    const params = buildParams({ ...appliedFilters, users: undefined });

    try {
      let filteredUsers = [];
      if (appliedFilters.users) {
        const selectedUser = users.find(
          (u) =>
            u.id === appliedFilters.users ||
            u.id === Number(appliedFilters.users)
        );
        if (selectedUser) filteredUsers = [selectedUser];
      } else {
        filteredUsers = users;
      }

      const userPaymentsData = await Promise.all(
        filteredUsers.map(async (user) => {
          try {
            const res = await axios.get(
              `/vente/ventes-facilite/?users=${user.id}`,
              { headers, params }
            );
            return {
              username: user.username,
              total_montant_verse: res.data.total_montant_verse || 0,
              total_montant_total: res.data.total_montant_total || 0,
              benefice_total: res.data.benefice_total || 0,
              pourcentage_benefice_total:
                res.data.pourcentage_benefice_total || 0,
            };
          } catch {
            return {
              username: user.username,
              total_montant_verse: 0,
              total_montant_total: 0,
              benefice_total: 0,
              pourcentage_benefice_total: 0,
            };
          }
        })
      );

      setUserPayments(userPaymentsData);
    } catch (error) {
      console.error(
        "Erreur lors du chargement des paiements utilisateurs :",
        error
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  // 3️⃣ Load top products
  const fetchTopProducts = async (appliedFilters = filters) => {
    const params = buildParams(appliedFilters);
    setLoadingProducts(true);
    try {
      const produits = (await axios.get("/prod/produits/", { headers })).data
        .results;

      const topFacilite = [];
      const topCash = [];

      for (const produit of produits) {
        try {
          const resFac = await axios.get(
            `/vente/ventes-facilite/?produit=${produit.id}`,
            { headers, params }
          );
          topFacilite.push({
            id:produit.id,
            produit: produit.nom,
            quantite_vendue_produit: resFac.data.quantite_vendue_produit || 0,
            montant_total_produit: resFac.data.montant_total_produit || 0,
          });
        } catch {
          topFacilite.push({
            id:produit.id,
            produit: produit.nom,
            quantite_vendue_produit: 0,
            montant_total_produit: 0,
          });
        }

        try {
          const resCash = await axios.get(
            `/vente/liste/?produit=${produit.id}`,
            { headers, params }
          );
          topCash.push({
            id:produit.id,
            produit: produit.nom,
            quantite_vendue_produit: resCash.data.quantite_vendue_produit || 0,
            montant_total_produit: resCash.data.montant_total_produit || 0,
          });
        } catch {
          topCash.push({
            id:produit.id,
            produit: produit.nom,
            quantite_vendue_produit: 0,
            montant_total_produit: 0,
          });
        }
      }

      setTopProduits(topFacilite);
      setTopProduitsCash(topCash);
    } catch (error) {
      console.error("Erreur lors du chargement des produits :", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // 4️⃣ Load top clients
  const fetchTopClients = async (appliedFilters = filters) => {
    const params = buildParams(appliedFilters);
    setLoadingClients(true);
    try {
      const clients = (await axios.get("/auth/clients/", { headers })).data.results;

      const topFac = [];
      const topCash = [];

      for (const client of clients) {
        try {
          const resFac = await axios.get(
            `/vente/ventes-facilite/?client=${client.id}`,
            { headers, params }
          );
          topFac.push({
            id: `${client.id}`,
            client: `${client.nom_famille_ar} ${client.prenom_ar}`,
            total_montant_total: resFac.data.total_montant_total || 0,
          });
        } catch {
          topFac.push({
            id: `${client.id}`,
            client: `${client.nom_famille_ar} ${client.prenom_ar}`,
            total_montant_total: 0,
          });
        }

        try {
          const resCash = await axios.get(`/vente/liste/?client=${client.id}`, {
            headers,
            params,
          });
          topCash.push({
            id: `${client.id}`,
            client: `${client.nom_famille_ar} ${client.prenom_ar}`,
            total_montant: resCash.data.total_montant || 0,
          });
        } catch {
          topCash.push({
            id: `${client.id}`,
            client: `${client.nom_famille_ar} ${client.prenom_ar}`,
            total_montant: 0,
          });
        }
      }

      setTopClientsFacilite(topFac);
      setTopClientsCash(topCash);
    } catch (error) {
      console.error("Erreur lors du chargement des clients :", error);
    } finally {
      setLoadingClients(false);
    }
  };

  // ✅ Trigger data load
  useEffect(() => {
    fetchTotals();
    fetchTopProducts();
    fetchTopClients();
  }, [filters]);

  // Fetch user payments when filters or users change
  useEffect(() => {
    fetchUserPayments(filters);
  }, [filters, users]);

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 2, mt: 2 }}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="من تاريخ"
              value={filters.date_from}
              onChange={(newValue) =>
                setFilters((prev) => ({ ...prev, date_from: newValue }))
              }
              format="YYYY-MM-DD"
              sx={{ width: 200 }}
            />
            <DatePicker
              label="إلى تاريخ"
              value={filters.date_to}
              onChange={(newValue) =>
                setFilters((prev) => ({ ...prev, date_to: newValue }))
              }
              format="YYYY-MM-DD"
              sx={{ width: 200 }}
            />
          </LocalizationProvider>

          <FilterPanel
            filters={[
              {
                name: "periode",
                label: "الفترة",
                options: [
                  { value: "", label: "الكل" },
                  { value: "yesterday", label: "الامس" },
                  { value: "today", label: "اليوم" },
                  { value: "this_week", label: "هذا الأسبوع" },
                  { value: "this_month", label: "هذا الشهر" },
                  { value: "last_month", label: "الشهر الماضي" },
                  { value: "this_year", label: "هذا العام" },
                ],
              },
              {
                name: "users",
                label: "البائع",
                options: [
                  { value: "", label: "الكل" },
                  ...users.map((u) => ({
                    value: u.id,
                    label: u.username,
                  })),
                ],
              },
            ]}
            values={filters}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
              }))
            }
          />
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          {loadingTotals ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <ExtraCard data={totaux} />
          )}

          {loadingUsers ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <VersementTable userPayments={userPayments} />
              {/* <MonthsTable /> */}
              <UsersVente userPayments={userPayments} />
            </>
          )}
        </Grid>

        <Grid item xs={6}>
          {loadingTotals ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <AnalyseTotal data={totaux} />
          )}

          {loadingProducts ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <ProductDetail topProduits={topProduits} />
              <TopProductCash topProduitsCash={topProduitsCash} />
            </>
          )}

          {loadingClients ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <BestClient topClientsFacilite={topClientsFacilite} />
              <BestClientCash topClientsCash={topClientsCash} />
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
}
