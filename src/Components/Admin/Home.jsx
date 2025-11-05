import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import Grid from "@mui/material/GridLegacy";
import CheckIcon from "@mui/icons-material/Check";
import axios from "../../api/axiosInstance";

// --- Sample Data ---
const salaryData = [
  { location: "غيلاس", استقبال: 15887, نقطة_البيع: 25887 },
  { location: "محل عين وسارة", استقبال: 15312, نقطة_البيع: 25312 },
];

const COLORS = ["#4F46E5", "#3B82F6", "#93C5FD"];

const missingItemsData = [
  { store: "محل أثاث 1", date: "2024-03-23 17:18:10" },
  { store: "محل 2", date: "2024-03-23 17:18:10" },
];

export default function DashboardHome() {
  const [users, setUSers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [totalClients, setTotalClients] = useState(0);
  const [totalFacilite, setTotalFacilite] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [totalMontantFacilite, setTotalMontantFacilite] = useState(0);
  const [totalMontantCash, setTotalMontantCash] = useState(0);
  const [totalMontantDepense, setTotalMontantDepense] = useState(0);
  const [valeurProduit, setValeurProduit] = useState(0);
  const [Benefit, setBenefit] = useState(0);

  const [productFamilies, setProductFamilies] = useState([]);
  const [barChartData, setBarChartData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [filters, setFilters] = useState({
    users: "",
    periode: "this_month", // e.g. "today", "this_month", etc.
  });
  const handleUserChange = (event) => {
    setFilters((prev) => ({ ...prev, users: event.target.value || null }));
  };

  // handle periode change
  const handlePeriodeChange = (event) => {
    setFilters((prev) => ({ ...prev, periode: event.target.value || null }));
  };
  const cards = [
    { title: "الزبائن الجدد", value: `+${totalClients}` },
    { title: "عمليات البيع بالتقسيط", value: `+${totalFacilite}` },
    { title: "عمليات البيع نقدا", value: `+${totalCash}` },
    { title: "المصاريف", value: totalMontantDepense },
    { title: "قيمة المبيعات بالتقسيط", value: totalMontantFacilite },
    { title: "قيمة المبيعات نقدا", value: totalMontantCash },
    { title: "قيمة السلع", value: valeurProduit },
    { title: "الملفات المسترجعة", value: "0" },
  ];

  // Découpe le tableau en sous-tableaux de 2 éléments
  const groupedCards = [];
  for (let i = 0; i < cards.length; i += 2) {
    groupedCards.push(cards.slice(i, i + 2));
  }
  const percentage = Benefit;
  const radius = 60;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const offset = circumference * (1 - percentage / 100);
  // Fonction pour formater automatiquement
  const formatMoneyCentime = (valInDZD) => {
    const val = valInDZD * 100; // تحويل إلى سنتيم

    if (val >= 1_000_000_000) {
      // 1 مليار سنتيم = 10 مليون دج
      return (val / 1_000_000_000).toFixed(2) + " مليار ";
    } else if (val >= 1_000_000) {
      // 1 مليون سنتيم = 10 آلاف دج
      return (val / 1_000_000).toFixed(2) + " مليون ";
    } else if (val >= 10_000) {
      // 10 آلاف سنتيم = 100 دج
      return (val / 100).toFixed(2) + "ألف";
    } else {
      return val + "";
    }
  };
  useEffect(() => {
    axios
      .get("auth/users")
      .then((res) => {
        setUSers(res.data.results || []);
      })
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);
  useEffect(() => {
    // Load dashboard data whenever filters change (even if null)
    fetchDashboardData(filters);
  }, [filters]);
  const fetchDashboardData = (filters) => {
    const params = {};
    if (filters.users) params.users = filters.users;
    if (filters.periode) params.periode = filters.periode;

    // vente facilite
    axios
      .get("vente/ventes-facilite/", { params })
      .then((res) => {
        // Totals
        setTotalFacilite(res.data.total_ventes || 0);
        const montantTotal = res.data.total_montant_total || 0;
        setTotalMontantFacilite(formatMoneyCentime(montantTotal));
        setBenefit(res.data.pourcentage_benefice_total || 0);

        const ventes = res.data.ventes || [];

        // --------- BarChart (ventes & bénéfices par utilisateur) ---------
        const grouped = ventes.reduce((acc, vente) => {
          const userId = vente.utilisateur;
          if (!acc[userId]) {
            acc[userId] = {
              name: vente.utilisateur_detail.username,
              المبيعات: 0,
              الفائدة: 0,
            };
          }

          const venteTotal = parseFloat(vente.montant_total || 0);
          const prixAchat = vente.lignes_detail.reduce((sum, ligne) => {
            return (
              sum +
              parseFloat(ligne.produit_detail.prix_achat || 0) * ligne.quantite
            );
          }, 0);
          const benefice = venteTotal - prixAchat;

          acc[userId].المبيعات += venteTotal;
          acc[userId].الفائدة += benefice;
          return acc;
        }, {});

        const chartData = Object.values(grouped).map((item) => ({
          ...item,
          المبيعات: item.المبيعات * 100, // Convertir en centimes
          الفائدة: item.الفائدة * 100,
        }));

        setBarChartData(chartData);

        // --------- LineChart (bénéfices mensuels) ---------
        const months = [
          "جانفي",
          "فيفري",
          "مارس",
          "أفريل",
          "ماي",
          "جوان",
          "جويلية",
          "أوت",
          "سبتمبر",
          "أكتوبر",
          "نوفمبر",
          "ديسمبر",
        ];

        const monthlyBenefits = Array(12).fill(0);

        ventes.forEach((vente) => {
          const date = new Date(vente.date_creation);
          const monthIndex = date.getMonth(); // 0-11
          const prixAchatTotal = vente.lignes_detail.reduce(
            (sum, ligne) =>
              sum +
              parseFloat(ligne.produit_detail.prix_achat || 0) * ligne.quantite,
            0
          );
          const benefice =
            parseFloat(vente.montant_total || 0) - prixAchatTotal;

          monthlyBenefits[monthIndex] += benefice * 100; // en centimes
        });

        const lineData = monthlyBenefits.map((val, i) => ({
          month: months[i] + " 2025",
          value: val,
        }));
        setLineChartData(lineData);
      })
      .catch((err) => console.error("Failed to fetch ventes facilite", err));

    // vente cash
    axios
      .get("vente/liste/", { params })
      .then((res) => {
        setTotalCash(res.data.nombre_de_ventes || 0);
        setTotalMontantCash(formatMoneyCentime(res.data.total_montant || 0));
      })
      .catch((err) => console.error("Failed to fetch ventes cash", err));

    // clients
    axios
      .get("auth/clients/", { params })
      .then((res) => setTotalClients(res.data.count || 0))
      .catch((err) => console.error("Failed to fetch clients", err));

    // depenses
    axios
      .get("depense/depenses/", { params })
      .then((res) => {
        setTotalMontantDepense(
          formatMoneyCentime(res.data.totaux_globaux.total_montant || 0)
        );
      })
      .catch((err) => console.error("Failed to fetch depenses", err));

    // produits
    axios
  .get("prod/produits/familles", { params })
  .then((res) => {
    const familles = res.data.familles || [];

    // Transform backend data into chart-friendly format
    const familleData = familles.map((fam) => ({
      name: fam.famille || "غير مصنف",
      value: parseFloat(fam.total_prix_achat) * (fam.total_quantite || 0),
    }));

    setProductFamilies(familleData);

    // Optionally compute global total
    const totalValeur = familles.reduce(
      (acc, fam) =>
        acc + parseFloat(fam.total_prix_achat) * (fam.total_quantite || 0),
      0
    );

    setValeurProduit(formatMoneyCentime(totalValeur));
  })
  .catch((err) => console.error("Failed to fetch familles", err));
  }

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      <Grid item xs={6}>
        <Grid container spacing={2}>
          {groupedCards.map((group, groupIndex) => (
            <Grid key={groupIndex} container item spacing={2} xs={12}>
              {group.map((card, i) => (
                <Grid key={i} item xs={12} sm={6} md={6}>
                  <Card sx={{ height: "100%" }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="body2">{card.title}</Typography>
                      <Typography variant="h5">{card.value}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ))}

          {/* Carte pourcentage */}
          <Grid item xs={12}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
              }}
            >
              <Box sx={{ position: "relative", width: 150, height: 150 }}>
                <svg width="150" height="150">
                  <defs>
                    <linearGradient
                      id="blueGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#1E3A8A" /> {/* Deep Blue */}
                      <stop offset="50%" stopColor="#3B82F6" /> {/* Sky Blue */}
                      <stop offset="100%" stopColor="#93C5FD" />{" "}
                      {/* Light Blue */}
                    </linearGradient>
                  </defs>

                  {/* Background circle */}
                  <circle
                    cx="75"
                    cy="75"
                    r={normalizedRadius}
                    stroke="#e0e0e0"
                    strokeWidth={strokeWidth}
                    fill="white"
                  />

                  {/* Progress circle */}
                  <circle
                    cx="75"
                    cy="75"
                    r={normalizedRadius}
                    stroke="url(#blueGradient)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 75 75)"
                  />
                </svg>

                {/* Centered Text */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    fontSize={14}
                  >
                    الفائدة بالتقسيط
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="#1E3A8A">
                    {percentage}%
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
                >
                  قيمة السلع حسب العائلة
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productFamilies}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        nameKey="name"
                        labelLine={false}
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                          name,
                        }) => {
                          const RADIAN = Math.PI / 180;
                          const radius =
                            innerRadius + (outerRadius - innerRadius) / 2;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);

                          return (
                            <text
                              x={x}
                              y={y}
                              fill="#000" // Black text
                              textAnchor="middle"
                              dominantBaseline="central"
                              style={{ fontSize: "12px", fontWeight: "bold" }}
                            >
                              {`${name} ${(percent * 100).toFixed(1)}%`}
                            </text>
                          );
                        }}
                      >
                        {productFamilies.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip formatter={(value) => `${value} دج`} />
                      <Legend
                        align="center"
                        verticalAlign="bottom"
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Bloc filtres à droite */}
      <Grid item xs={6}>
        <FormControl size="small" sx={{ minWidth: "45%", mr: 6 }}>
          <Select value={filters.users || ""} onChange={handleUserChange}>
            <MenuItem value="">كل المستخدمين</MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: "45%", mb: 2 }}>
          <Select value={filters.periode || ""} onChange={handlePeriodeChange}>
            <MenuItem value="">كل الفترات</MenuItem>
            <MenuItem value="today">اليوم</MenuItem>
            <MenuItem value="yesterday">أمس</MenuItem>
            <MenuItem value="this_week">هذا الأسبوع</MenuItem>
            <MenuItem value="this_month">هذا الشهر</MenuItem>
            <MenuItem value="last_month">الشهر السابق</MenuItem>
            <MenuItem value="this_year">هذه السنة</MenuItem>
          </Select>
        </FormControl>

        <Grid item xs={12} mb={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                المبيعات والفائدة بالتقسيط
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(val) => `${(val / 1_000_000).toFixed(0)} `}
                    domain={[0, 100_000_000]} // 0 → 100 million in centimes
                    ticks={[
                      0, 10_000_000, 20_000_000, 30_000_000, 40_000_000,
                      50_000_000, 60_000_000, 70_000_000, 80_000_000,
                      90_000_000, 100_000_000,
                    ]}
                  />

                  <Tooltip
                    formatter={(value) =>
                      `${(value / 1_000_000).toFixed(2)} مليون `
                    }
                  />

                  <Legend />
                  <Bar dataKey="المبيعات" fill="#304ffe" />
                  <Bar dataKey="الفائدة" fill="#3da4feff" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} mb={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                إجمالي الأرباح الشهرية بالتقسيط
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={lineChartData || []}>
                  <CartesianGrid strokeDasharray="3 3" strokeWidth={1.2} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(val) => `${(val / 1_000_000).toFixed(0)} `}
                    domain={[0, 100_000_000]}
                    ticks={[
                      0, 10_000_000, 20_000_000, 30_000_000, 40_000_000,
                      50_000_000, 60_000_000, 70_000_000, 80_000_000,
                      90_000_000, 100_000_000,
                    ]}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
                    formatter={(value) =>
                      `${(value / 1_000_000).toFixed(2)} مليون `
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#007bff"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
