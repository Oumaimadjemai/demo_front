import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

import Grid from "@mui/material/GridLegacy";
import axios from "../../api/axiosInstance";

// --- Sample Data ---
const salaryData = [
  { location: "غيلاس", استقبال: 15887, نقطة_البيع: 25887 },
  { location: "محل عين وسارة", استقبال: 15312, نقطة_البيع: 25312 },
];

export default function DashboardHome() {
  const [users, setUsers] = useState([]);
  const [totalClients, setTotalClients] = useState(0);
  const [totalFacilite, setTotalFacilite] = useState(0);
  const [totalCash, setTotalCash] = useState(0);
  const [filters, setFilters] = useState({
    users: null,
    periode: "this_month",
  });

  // 1️⃣ Default to connected user
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser?.id) {
      setFilters((prev) => ({ ...prev, users: currentUser.id }));
    }
  }, []);

  // 2️⃣ Fetch only vendeur users
  useEffect(() => {
    axios
      .get("auth/users/?role=vendeur")
      .then((res) => {
        setUsers(res.data.results || []);
      })
      .catch((err) => console.error("Failed to fetch users", err));
  }, []);

  // 3️⃣ Fetch dashboard data whenever filters change
  useEffect(() => {
    fetchDashboardData(filters);
  }, [filters]);

  const fetchDashboardData = (filters) => {
    const params = {};
    if (filters.users) params.users = filters.users;
    if (filters.periode) params.periode = filters.periode;

    // vente facilite
    axios
      .get("vente/ventes-facilite/", { params })
      .then((res) => setTotalFacilite(res.data.total_ventes || 0))
      .catch((err) => console.error("Failed to fetch ventes facilite", err));

    // vente cash
    axios
      .get("vente/liste/", { params })
      .then((res) => setTotalCash(res.data.nombre_de_ventes || 0))
      .catch((err) => console.error("Failed to fetch ventes cash", err));

    // clients
    axios
      .get("auth/clients/", { params })
      .then((res) => setTotalClients(res.data.total_clients || 0))
      .catch((err) => console.error("Failed to fetch clients", err));
  };

  const handleUserChange = (event) => {
    setFilters((prev) => ({ ...prev, users: event.target.value || null }));
  };

  const handlePeriodeChange = (event) => {
    setFilters((prev) => ({ ...prev, periode: event.target.value || null }));
  };

  const cards = [
    { title: "الزبان الجدد", value: `+${totalClients}` },
    { title: "عمليات البيع بالتقسيط", value: `+${totalFacilite}` },
    { title: "عمليات البيع نقدا", value: `+${totalCash}` },
  ];

  // Group cards 2 by 2
  const groupedCards = [];
  for (let i = 0; i < cards.length; i += 2) {
    groupedCards.push(cards.slice(i, i + 2));
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

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom align="center">
                العلاوات
              </Typography>
              <table
                style={{
                  width: "100%",
                  textAlign: "center",
                  borderCollapse: "collapse",
                  marginTop: "1rem",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}></th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                      موظف الاستقبال
                    </th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                      مسؤول نقطة البيع
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {salaryData.map((row, index) => (
                    <tr key={index}>
                      <td style={{ padding: "8px" }}>{row.location}</td>
                      <td style={{ padding: "8px" }}>{row.استقبال}</td>
                      <td style={{ padding: "8px" }}>{row.نقطة_البيع}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  );
}
