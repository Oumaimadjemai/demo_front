import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Components/Login/Login";
import AdminDashboard from "../Components/Admin/AdminDashboard";
import VendeurDashboard from "../Components/vendeur/VendeurDashboard";
import MagasinBoard from "../Components/Magasins/magasinBoard";
import MagasinierBoard from "../Components/magasinier/MagasinierBoard";
import MagasinierDashboard from "../Components/magasinier/MagasinierBoard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Navigate to="/login" replace />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/vendeur" element={<VendeurDashboard />} />
     <Route path="/magasinier" element={<VendeurDashboard/>}/>
    </Routes>
  );
}
