import MagasinTable from "./MagasinTable";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import AddMagasin from "./AddMagasin";
import axios from "../../api/axiosInstance";
import EditMagasin from "./EditMagasin";

export default function MagasinBoard() {
  const [openAddMagasinDialog, setOpenAddMagasinDialog] = useState(false);
  const [selectedMagasin, setSelectedMagasin] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleEditClick = (magasin) => {
    setSelectedMagasin(magasin);
    setOpenEditDialog(true);
  };
  const [rows, setRows] = useState([]);
  const fetchMagasins = () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    };

    axios
      .get("/param/magasins/", { headers })
      .then((response) => setRows(response.data.results))
      .catch((err) =>
        console.error("Erreur lors du chargement des magasins :", err)
      );
  };

  useEffect(() => {
    fetchMagasins(); // initial load
  }, []);
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 6,mt:4}}
        justifyContent="space-between"
      >
        <TextField
          variant="outlined"
          placeholder="ابحث عن محل..."
          sx={{ width: "500px" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />
        <Button
          variant="contained"
          endIcon={<AddIcon />}
          sx={{ width: "150px", height: "50px" }}
          onClick={() => {
            setOpenAddMagasinDialog(true);
          }}
        >
          إضافة محل
        </Button>
      </Stack>

      <MagasinTable rows={rows} setRows={setRows} onEditClick={handleEditClick} />
      <Dialog
        open={openAddMagasinDialog}
        onClose={() => setOpenAddMagasinDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row-reverse", // 🡐 Title on the right, icon on the left
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="close"
              onClick={() => setOpenAddMagasinDialog(false)}
              sx={{
                color: (theme) => theme.palette.error.main, // optional red color
              }}
            >
              <CloseIcon />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              sx={{ ml: "10px" }}
              color="primary"
            >
              إضافة محل
            </Typography>
          </Box>
        </DialogTitle>

        {/* The form content */}
        <AddMagasin
          setOpenAddMagasinDialog={setOpenAddMagasinDialog}
          fetchMagasins={fetchMagasins}
        />
      </Dialog>
      <Dialog
  open={openEditDialog}
  onClose={() => setOpenEditDialog(false)}
  maxWidth="sm"
  fullWidth
 
>
 
  <EditMagasin
    selectedMagasin={selectedMagasin}
    setOpenEditDialog={setOpenEditDialog}
    setRows={setRows}
     
  />
</Dialog>

    </>
  );
}
