import { useState, useEffect } from "react";
import {
  Button,
  Grid,
} from "@mui/material";
import axios from "../../api/axiosInstance";
import FeedbackCard from "../Cards/FeedbackCard";
import UserInfos from "./UserInfos";
import PostInfos from "./PostInfos";
import DragDrop from "./dragDrop";
 // ✅ Import

export default function EditClient({
  selectedClient,
  setOpenEditDialog,
  setRows,
  fetchClient,
}) {
  const [formData, setFormData] = useState({
     assurance_militaire: "",
    date_expedition: "",
    nom_famille_ar: "",
    prenom_ar: "",
    nom_famille_fr: "",
    prenom_fr: "",
    nom_pere: "",
    nom_mere: "",
    numero_national: "",
    date_naissance: "",
    lieu_naissance: "",
    adresse: "",
    telephone: "",
    profession: "",
    jour: "",
    revenu: "",
    type_piece_identite: "",
    numero_piece_identite: "",
    date_emission_piece: "",
    lieu_emission_piece: "",
    // infos bancaires
    ccp: "",
    cle: "",
    code: "",
    dette_initiale: 0,
    note: "",

  });

  const [files, setFiles] = useState([]); // ✅ Drag & Drop files
  const [feedback, setFeedback] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // useEffect(() => {
  //   if (selectedClient) {
  //     setFormData({
  //        assurance_militaire: selectedClient.assurance_militaire || "",
  //   date_expedition: selectedClient.date_expedition || "",
  //       nom_famille_ar: selectedClient.nom_famille_ar || "",
  //       prenom_ar: selectedClient.prenom_ar || "",
  //       nom_famille_fr: selectedClient.nom_famille_fr || "",
  //       prenom_fr: selectedClient.prenom_fr || "",
  //       nom_pere: selectedClient.nom_pere || "",
  //       nom_mere: selectedClient.nom_mere || "",
  //       numero_national: selectedClient.numero_national || "",
  //       date_naissance: selectedClient.date_naissance || null,
  //       lieu_naissance: selectedClient.lieu_naissance || "",
  //       adresse: selectedClient.adresse || "",
  //       telephone: selectedClient.telephone || "",
  //       profession: selectedClient.profession || "",
  //       jour: selectedClient.jour || "",
  //       revenu: selectedClient.revenu || "",
  //       type_piece_identite: selectedClient.type_piece_identite || "",
  //       numero_piece_identite: selectedClient.numero_piece_identite || "",
  //       date_emission_piece: selectedClient.date_emission_piece || "",
  //       lieu_emission_piece: selectedClient.lieu_emission_piece || "",
  //       ccp: selectedClient.ccp || "",
  //       cle: selectedClient.cle || "",
  //       code: selectedClient.code || "",
  //       dette_initiale: selectedClient.dette_initiale || 0,
  //       note: selectedClient.note || "",
  //     });
  //   }
  // }, [selectedClient]);
useEffect(() => {
  if (selectedClient) {
    setFormData({
      ...selectedClient,
      date_naissance: selectedClient.date_naissance
        ? new Date(selectedClient.date_naissance)
        : null,
      date_emission_piece: selectedClient.date_emission_piece
        ? new Date(selectedClient.date_emission_piece)
        : null,
      date_expedition: selectedClient.date_expedition
        ? new Date(selectedClient.date_expedition)
        : null,
    });
  }
}, [selectedClient]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");

      // ✅ If you want to upload files, use FormData
      const dataToSend = new FormData();
      // Object.keys(formData).forEach((key) => {
      //   dataToSend.append(key, formData[key] ?? "");
      // });

      // Append files
      Object.keys(formData).forEach((key) => {
  const value = formData[key];
  if (value instanceof Date) {
    dataToSend.append(key, value.toISOString().split("T")[0]); // yyyy-MM-dd
  } else {
    dataToSend.append(key, value ?? "");
  }
});

      files.forEach((file) => {
        dataToSend.append("fichiers_upload", file); // backend must accept 'fichiers' as field name
      });

      await axios.put(`/auth/clients/${selectedClient.id}/`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setFeedback({
        open: true,
        message: "✅ تم تعديل معلومات الزبون بنجاح",
        severity: "success",
      });
      fetchClient();

      // Update row locally
      // setRows((prev) =>
      //   prev.map((m) =>
      //     m.id === selectedClient.id ? { ...m, ...formData } : m
      //   )
      // );
    } catch (err) {
      console.error("Erreur modification:", err);
      setFeedback({
        open: true,
        message: "❌ فشل في التعديل",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Grid container>
        <Grid size={7}>
          <UserInfos userInfos={formData} setUserInfos={setFormData} />
        </Grid>

        <Grid
          size={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PostInfos userInfos={formData} setUserInfos={setFormData} />

          {/* ✅ DragDrop below PostInfos */}
         <DragDrop 
  files={files} 
  setFiles={setFiles} 
  existingFiles={selectedClient?.fichiers || []}
  onRemoveExistingFile={(file) => {
    // appel API DELETE fichier
    axios.delete(`auth/clients/files/${file.id}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
    })
    .then(() => {
      // feedback UI
      setFeedback({ open: true, message: "✅ تم حذف الملف", severity: "success" });
      // enlever du state local
      selectedClient.fichiers = selectedClient.fichiers.filter(f => f.id !== file.id);
    });
  }}
/>


          <Button
            variant="contained"
            sx={{ width: "90%", height: "50px", mt: 2 }}
            onClick={handleUpdate}
          >
            تعديل المعلومات
          </Button>
        </Grid>
      </Grid>

      {feedback.open && (
        <FeedbackCard
          message={feedback.message}
          severity={feedback.severity}
          onClose={() => {
            setFeedback({ ...feedback, open: false });
            if (feedback.severity === "success") setOpenEditDialog(false);
          }}
        />
      )}
    </>
  );
}
