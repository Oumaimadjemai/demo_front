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

import axios from "../../api/axiosInstance";

import AddUser from "./AddUser";
import UsersTable from "./UsersTable";
import EditUser from "./EditUser";

export default function UserBoard() {
  const [openAddUserDialog, setOpenAddUSerDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };
  const [rows, setRows] = useState([]);
  const fetchUser = () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    };

    axios
      .get("auth/users/", { headers })
      .then((response) => setRows(response.data.results))
      .catch((err) =>
        console.error("Erreur lors du chargement des utilisateurs :", err)
      );
  };

  useEffect(() => {
    fetchUser(); // initial load
  }, []);
  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        sx={{ mb: 6, mt: 4 }}
        justifyContent="space-between"
      >
        <TextField
          variant="outlined"
          placeholder="ابحث عن مستخدم..."
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
            setOpenAddUSerDialog(true);
          }}
        >
          إضافة مستخدم
        </Button>
      </Stack>

      <UsersTable rows={rows} setRows={setRows} onEditClick={handleEditClick} />
      <Dialog
        open={openAddUserDialog}
        onClose={() => setOpenAddUSerDialog(false)}
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
              onClick={() => setOpenAddUSerDialog(false)}
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
              إضافة مستخدم
            </Typography>
          </Box>
        </DialogTitle>

        {/* The form content */}
        <AddUser
          setOpenAddUSerDialog={setOpenAddUSerDialog}
          fetchUser={fetchUser}
        />
      </Dialog>
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <EditUser
          selectedUser={selectedUser}
          setOpenEditDialog={setOpenEditDialog}
          setRows={setRows}
        />
      </Dialog>
    </>
  );
}
