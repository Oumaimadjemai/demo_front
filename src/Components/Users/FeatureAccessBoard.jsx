import {
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Box,
  Card,
  CardContent,
  Alert
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const ALL_FEATURES = {
  home: "الصفحة الرئيسية",
  file:"ملف",
  "add-client": "إضافة زبون",
  "add-product": "إضافة سلعة",
  "add-fourn": "إضافة ممون",
  "get-product": "جرد السلع",
  notes: "الملاحظات",
  print: "طباعة",
  lists:"قوائم",
  "client-list": "قائمة الزبائن",
  "product-list": "قائمة السلع",
  "fournisseur-list": "قائمة الممونين",
  "depense-list": "قائمة المصاريف",
  transfert: "التحويلات",
  codebar: "الملصقات",
  achat: "الشراء",
  "nouveau-achat": "عملية شراء جديدة",
  "achat-list": "عرض عمليات الشراء",
  vente: "البيع",
  "nouveau-vente-cache": "عملية بيع كاش",
  "vente-cache-list": "عمليات البيع كاش",
  "nouveau-vente-facilite": "عملية بيع تقسيط",
  "vente-facilite-list": "عمليات البيع بالتقسيط",
  rapport: "التقارير",
  statistics: "إحصائيات",
  "rapport-vente": "تقرير المبيعات",
  "rapport-produit-vendu": "تقرير السلع المباعة",
  "rapport-depense": "تقرير المدفوعات",
  "depense-client": "مستحقات الزبائن",
  "rapport-poste": "تقرير البريد",
  "produit-comparaison": "مقارنة السلع",
  settings: "إعدادات",
  magasins: "المحلات",
  users: "المستخدمين",
  profil: "الملف الشخصي",
  logout:"تسجيل الخروج",
};

export default function FeatureAccessBoard({ userId, onClose }) {
  const [features, setFeatures] = useState([]);
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    axios.get(`/auth/users/${userId}/`).then((res) => {
      setUser(res.data);
      if (res.data.role === "admin") {
        setFeatures(Object.keys(ALL_FEATURES));
      } else {
        const feats = Array.isArray(res.data.features)
          ? res.data.features
          : [];
        setFeatures(feats);
      }
    });
  }, [userId]);

  const handleToggle = (feature) => {
    setFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSave = async () => {
    await axios.patch(`/auth/users/${userId}/`, {
      features: features,
    });

    setSaved(true);

    // غلق الـDialog بعد ثانية مع إظهار البطاقة
    setTimeout(() => {
      if (onClose) onClose();
    }, 500);
  };

  if (!user) return <p>جاري التحميل...</p>;

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
      >
        تخصيص المهام لـ {user.username} ({user.role})
      </Typography>

      {!saved ? (
        <>
          <Grid container spacing={2}>
            {Object.entries(ALL_FEATURES).map(([key, label]) => (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={features.includes(key)}
                      onChange={() => handleToggle(key)}
                      disabled={user?.role === "admin"}
                    />
                  }
                  label={label}
                />
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={user?.role === "admin"}
            >
              حفظ التغييرات
            </Button>
          </Box>
        </>
      ) : (
        <Card
          sx={{
            mt: 3,
            backgroundColor: "#e8f5e9",
            border: "1px solid #4caf50",
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Alert severity="success" sx={{ fontWeight: "bold" }}>
              ✅ تم حفظ المهام بنجاح
            </Alert>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
