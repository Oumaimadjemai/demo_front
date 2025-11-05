import DragDrop from "./dragDrop";
import PostInfos from "./PostInfos";
import UserInfos from "./UserInfos";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { format } from "date-fns";
import axios from "../../api/axiosInstance";
import FeedbackCard from "../Cards/FeedbackCard";

export default function AddClient({ setOpenAddClientDialog, fetchClient }) {
  const [feedback, setFeedback] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [userInfos, setUSerInfos] = useState({
    assurance_militaire: "",
    date_expedition: "",
    nom_famille_ar: "",
    prenom_ar: "",
    nom_famille_fr: "",
    prenom_fr: "",
    nom_pere: "",
    nom_mere: "",
    numero_national: "",
    date_naissance: null,
    lieu_naissance: "",
    adresse: "",
    telephone: "",
    profession: "",
    jour: "",
    revenu: "",
    type_piece_identite: "بطاقة التعريف الوطنية ",
    numero_piece_identite: "",
    date_emission_piece: "",
    lieu_emission_piece: "",
    ccp: "",
    cle: "",
    code: "",
    dette_initiale: 0,
    note: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);

  function validateUserInfos() {
    const requiredFields = [
      "nom_famille_ar",
      "prenom_ar",
      "nom_famille_fr",
      "prenom_fr",
      "numero_national",
      "date_naissance",
      "lieu_naissance",
      "adresse",
      "telephone",
      "type_piece_identite",
      "numero_piece_identite",
      "date_emission_piece",
      "lieu_emission_piece",
      "ccp",
      "cle",
    ];

    const missingFields = requiredFields.filter(
      (field) => !userInfos[field] || userInfos[field].toString().trim() === ""
    );

    if (missingFields.length > 0) {
      setFeedback({
        open: true,
        severity: "warning",
        message: "⚠️ يرجى ملء جميع الحقول الإلزامية قبل الحفظ.",
      });
      return false;
    }

    return true;
  }

  function handleAddClick() {
    if (validateUserInfos()) {
      setConfirmOpen(true);
    }
  }

  function submitFinalForm() {
    const formattedData = {
      ...userInfos,
      date_naissance: userInfos.date_naissance
        ? format(userInfos.date_naissance, "yyyy-MM-dd")
        : "",
      date_emission_piece: userInfos.date_emission_piece
        ? format(userInfos.date_emission_piece, "yyyy-MM-dd")
        : "",
      date_expedition: userInfos.date_expedition
        ? format(userInfos.date_expedition, "yyyy-MM-dd")
        : "",
      revenu: userInfos.revenu || "0.00",
      dette_initiale: userInfos.dette_initiale || "0.00",
    };

    const formData = new FormData();
    Object.entries(formattedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    });

    uploadedFiles.forEach((file) => {
      formData.append("fichiers_upload", file);
    });

    axios
      .post("/auth/clients/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        setFeedback({
          open: true,
          severity: "success",
          message: "✅ Client enregistré مع succès",
        });

        if (typeof fetchClient === "function") {
          fetchClient();
        }
      })
      .catch((err) => {
        console.error("❌ Erreur:", err.response?.data || err.message);
        setFeedback({
          open: true,
          severity: "error",
          message: JSON.stringify(err.response?.data || "Erreur inconnue"),
        });
      })
      .finally(() => {
        setConfirmOpen(false);
      });
  }

  return (
    <>
      <Grid container>
        <Grid size={7}>
          <UserInfos userInfos={userInfos} setUserInfos={setUSerInfos} />
        </Grid>
        <Grid
          size={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <PostInfos userInfos={userInfos} setUserInfos={setUSerInfos} />
          <DragDrop files={uploadedFiles} setFiles={setUploadedFiles} />
          <Button
            variant="contained"
            sx={{ width: "90%", height: "50px" ,mt:2}}
            onClick={handleAddClick}
          >
            حفظ المعلومات
          </Button>
        </Grid>
      </Grid>

      {/* Feedback Snackbar */}
      {feedback.open && (
        <FeedbackCard
          message={feedback.message}
          severity={feedback.severity}
          onClose={() => {
            setFeedback({ ...feedback, open: false });
            if (feedback.severity === "success") {
              setOpenAddClientDialog(false);
            }
          }}
        />
      )}

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>تأكيد الحفظ</DialogTitle>
        <DialogContent>
          <DialogContentText>
            هل أنت متأكد أنك تريد حفظ معلومات هذا العميل؟
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            إلغاء
          </Button>
          <Button onClick={submitFinalForm} color="primary" variant="contained">
            نعم، حفظ
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
