import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import axios from "../../api/axiosInstance";
import dayjs from "dayjs";

export default function ClientPaiementInfo({ clientId }) {
  const [ventes, setVentes] = useState([]);

  useEffect(() => {
    if (clientId) fetchPaiements();
  }, [clientId]);

  const fetchPaiements = async () => {
    try {
      // 1️⃣ جلب كل المبيعات الخاصة بالعميل
      const res = await axios.get(`/vente/ventes-facilite/?client=${clientId}`);
      const ventesData = res.data.ventes || [];

      // 2️⃣ جلب الدفعات لكل عملية بيع
      const ventesWithPaiements = await Promise.all(
        ventesData.map(async (vente) => {
          try {
            const paiementRes = await axios.get(`/vente/vente/payer/${vente.id}/`);
            const paiementData = Array.isArray(paiementRes.data)
              ? paiementRes.data[0]
              : paiementRes.data;

            return {
              ...paiementData, // vente_id, paiements[], إلخ
              date_debut: vente.date_debut,
              date_fin: vente.date_fin,
              montant_mensuel: Number(vente.montant_mensuel),
              total_verse_effectif: Number(vente.montant_paye_effectif),
              reste_vente: Number(vente.montant_restant),
            };
          } catch (err) {
            console.error(`خطأ عند جلب الدفعات للبيع ${vente.id}`, err);
            return null;
          }
        })
      );

      setVentes(ventesWithPaiements.filter(Boolean));
    } catch (error) {
      console.error("خطأ عند جلب المبيعات:", error);
    }
  };

  if (ventes.length === 0) {
    return (
      <Typography align="center" sx={{ mt: 2 }}>
        لا توجد بيانات دفع حالياً
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {ventes.map((vente) => (
        <Paper key={vente.vente_id} sx={{ mb: 3, p: 2 }}>
          {/* العنوان */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            🧾 البيع رقم #{vente.vente_id} | 
            من {dayjs(vente.date_debut).format("DD/MM/YYYY")} 
            إلى {dayjs(vente.date_fin).format("DD/MM/YYYY")}
          </Typography>

          {/* جدول الدفعات */}
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">تاريخ الدفع</TableCell>
                <TableCell align="center">المبلغ (دج)</TableCell>
                <TableCell align="center">الحالة</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vente.paiements.length > 0 ? (
                vente.paiements.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell align="center">
                      {dayjs(p.date_paiement).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell align="center">{p.montant} دج</TableCell>
                    <TableCell align="center">
                      {p.status === "paid" ? "✔ مدفوع" : "⏳ قيد الانتظار"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    لا توجد أي دفعات مسجلة
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* ملخص أسفل الجدول */}
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              💰 المجموع المدفوع: {vente.total_verse_effectif} دج
            </Typography>
            <Typography variant="body2">
              💸 الباقي: {vente.reste_vente} دج
            </Typography>
            <Typography variant="body2">
              📆 الدفعة الشهرية: {vente.montant_mensuel} دج
            </Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
