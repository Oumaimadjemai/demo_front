import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Button,
  MenuItem,
  Stack,
  FormControlLabel,
  Checkbox,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import ClientFiles from "./ClientFiles"; // ✅ Import ClientFiles
import VenteDetailFacilite from "./VenteDetailFacilite";
import VenteDetailCash from "./venteDetailCash";
import axios from "../../api/axiosInstance";
import ClientPaiementInfo from "./ClientPaiementInfo";

export default function ClientDetail({ client }) {
  const [activeButton, setActiveButton] = useState(0);
  const [bloque, setBloque] = useState(false);
  const [statut, setStatut] = useState("non_classifie");
  const [note, setNote] = useState("");
  const [deleteFileChecked, setDeleteFileChecked] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [actionType, setActionType] = useState(""); // e.g., "deleteFiles" or "updateClient"

  const handleOpenConfirm = (type) => {
    setActionType(type);
    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    if (actionType === "deleteFiles") {
      for (const file of client.fichiers || []) {
        await handleDeleteFile(file.id, false); // modified to not confirm inside
      }
    }
    if (actionType === "updateClient") {
      await handleUpdateClient();
    }
    setOpenConfirm(false);
  };

  const buttons = [
    "معلومات الزبون",
    "صورة الملف",
    "المشتريات بالتقسيط",
    "المشتريات نقدا",
    "كشف الحساب",
  ];
  useEffect(() => {
    if (client) {
      setBloque(client.bloque ?? false);
      setStatut(client.statut ?? "non_classifie");
      setNote(client.note ?? "");
    }
  }, [client]);
  if (!client) return null;
  const statutChoices = [
    { value: "non_classifie", label: "غير مصنف" },
    { value: "sous_suivi", label: "قيد المتابعة" },
    { value: "recuperation", label: "قيد الإسترجاع" },
    { value: "investigation", label: "قيد التحقيق" },
    { value: "suspendu", label: "موقوف مؤقتا" },
    { value: "perdu", label: "معدوم" },
    { value: "cash_only", label: "تسديد نقدا" },
    { value: "banque_bloquee", label: "مغلق من البنك" },
  ];

  const handleUpdateClient = async () => {
    try {
      await axios.patch(`/auth/clients/${client.id}/`, {
        bloque,
        statut, // will send clean values like "sous_suivi"
      });
      alert("✅ تم تحديث حالة الزبون بنجاح");
    } catch (error) {
      console.error(error);
      alert("❌ فشل تحديث الزبون");
    }
  };
  const handleUpdateNote = async () => {
    try {
      await axios.patch(`/auth/clients/${client.id}/`, {
        note,
      });
      alert("✅ تم تحديث الملاحظة  بنجاح");
    } catch (error) {
      console.error(error);
      alert("❌ فشل تحديث الملاحظة");
    }
  };
  const handleDeleteFile = async (fileId, showAlert = true) => {
    try {
      await axios.delete(`/auth/clients/files/${fileId}/`);
      if (showAlert) alert("✅ تم حذف الملف بنجاح");
    } catch (error) {
      console.error(error);
      alert("❌ فشل حذف الملف");
    }
  };

  // 🔹 Map files only when the files tab is active
const clientFiles =
  activeButton === 1
    ? client.fichiers?.map((file) => {
        const url = file.url || ""; // ✅ use url from API safely
        const isPdf = url.toLowerCase().endsWith(".pdf"); // ✅ won't crash now
        return {
          id: file.id,
          type: isPdf ? "pdf" : "image",
          name: file.name || `ملف ${file.id}`,
          url,
        };
      }) || []
    : [];


  // 🔹 Define tab content in a function with switch-case
  const renderContent = () => {
    switch (activeButton) {
      case 0:
        return (
          <Stack spacing={2} direction={"row"}>
            {/* Left side: Customer Info */}
            <Stack width={"50%"} bgcolor={"white"} p={2} borderRadius={2}>
              <Card>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>الاسم</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {`${client.prenom_ar || ""} ${
                            client.nom_famille_ar || ""
                          } / ${client.prenom_fr || ""} ${
                            client.nom_famille_fr || ""
                          }`}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>رقم الحساب</TableCell>
                        <TableCell>{`${client.ccp || ""}  المفتاح ${
                          client.cle || ""
                        }`}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>الدخل</TableCell>
                        <TableCell>{`${client.revenu || ""} `}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>العنوان</TableCell>
                        <TableCell>{`${client.adresse || ""} `}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>الهاتف</TableCell>
                        <TableCell>{`${client.telephone || ""} `}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>رقم الزبون</TableCell>
                        <TableCell>{`${client.id || ""} `}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>المهنة</TableCell>
                        <TableCell>{`${client.profession || ""} `}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>تاريخ الدخل</TableCell>
                        <TableCell>{`${
                          client.jour || ""
                        } من كل شهر`}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  {/* Actions */}
                  <Stack
                    direction={"row"}
                    spacing={2}
                    justifyContent={"space-between"}
                    my={2}
                    mx={1}
                  >
                    <Typography variant="h6">حظر الزبون</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={bloque}
                          onChange={(e) => setBloque(e.target.checked)}
                        />
                      }
                    />
                  </Stack>

                  <Stack
                    direction={"row"}
                    spacing={2}
                    justifyContent={"space-between"}
                    my={2}
                    mx={1}
                  >
                    <Typography variant="h6">استرجاع الملف</Typography>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={deleteFileChecked}
                          onChange={async (e) => {
                            const checked = e.target.checked;
                            setDeleteFileChecked(checked);

                            if (checked && client.fichiers?.length > 0) {
                              handleOpenConfirm("deleteFiles");
                            }
                          }}
                        />
                      }
                    />
                  </Stack>

                  {/* Dropdown & Notes */}

                  <TextField
                    select
                    label="تصنيف الزبون"
                    value={statut} // controlled value
                    onChange={(e) => setStatut(e.target.value)}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    {statutChoices.map((choice) => (
                      <MenuItem key={choice.value} value={choice.value}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ height: "50px", mt: 1, mb: 2, width: "100%" }}
                    onClick={handleUpdateClient}
                  >
                    تحديث الحالة
                  </Button>
                </CardContent>
              </Card>
              <Box sx={{ mt: 2 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <TextField
                    label="ملاحظة"
                    multiline
                    rows={2}
                    fullWidth
                    value={note} // ✅ Controlled value
                    onChange={(e) => setNote(e.target.value)} // ✅ Updates state
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ height: "50px" }}
                    onClick={handleUpdateNote}
                  >
                    تحديث
                  </Button>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField label="مبلغ متبقي" fullWidth sx={{ mb: 2 }} />
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ height: "50px" }}
                  >
                    تحديث
                  </Button>
                </Stack>
              </Box>
            </Stack>

            {/* Right side: Stats */}
            <Stack width={"50%"} p={2} borderRadius={2}>
              <Stack spacing={2}>
                <Stack>
                  <Card sx={{ bgcolor: "red", color: "white" }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6">الدين الحالي</Typography>
                      <Typography variant="h4">{`${
                        client.dette_actuelle_client || ""
                      }`}</Typography>
                    </CardContent>
                  </Card>
                </Stack>
                <Stack>
                  <Card sx={{ bgcolor: "green", color: "white" }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6">المدفوعات</Typography>
                      <Typography variant="h4">{`${
                        client.montant_paye_effectif || ""
                      }`}</Typography>
                    </CardContent>
                  </Card>
                </Stack>
                <Stack>
                  <Card sx={{ bgcolor: "blue", color: "white" }}>
                    <CardContent sx={{ textAlign: "center" }}>
                      <Typography variant="h6">المشتريات</Typography>
                      <Typography variant="h4">{`${
                        client.dette_totale_client || ""
                      }`}</Typography>
                    </CardContent>
                  </Card>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        );

      case 1:
        return <ClientFiles files={clientFiles} />;

      case 2:
        return <VenteDetailFacilite clientId={client.id} />;

      case 3:
        return <VenteDetailCash clientId={client.id} />;

      case 4:
        return <ClientPaiementInfo clientId={client.id} />;

      default:
        return null;
    }
  };

  return (
    <>
      <Box sx={{ p: 2, bgcolor: "#e0f7fa", height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#0097a7",
            color: "white",
            p: 2,
            mr: 1.5,
            mb: 2,
            borderRadius: 1,
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {`${client.prenom_ar || ""} ${client.nom_famille_ar || ""}`}

          <ButtonGroup variant="contained" color="primary">
            {buttons.map((btn, idx) => (
              <Button
                key={idx}
                onClick={() => setActiveButton(idx)}
                sx={{
                  bgcolor:
                    activeButton === idx ? "primary.dark" : "primary.main",
                }}
              >
                {btn}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        {/* 🔹 Tab Content */}
        {renderContent()}
      </Box>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>تأكيد العملية</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {actionType === "deleteFiles"
              ? "هل أنت متأكد من استرجاع جميع الملفات؟"
              : "هل تريد تنفيذ العملية؟"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>إلغاء</Button>
          <Button onClick={handleConfirm} color="error" variant="contained">
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
