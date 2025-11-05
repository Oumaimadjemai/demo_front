import { Box, Typography, Stack, IconButton, Dialog } from "@mui/material";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useState } from "react";
import AIChat from "../chatai/Aichat";


export default function Header() {
  const userName = localStorage.getItem("username"); // Or use props/context
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ bgcolor: "transparent", display: "flex", justifyContent: "end", mr: 3 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="body1">
          مرحبا, <strong>{userName}</strong>
        </Typography>

        {/* Chat Icon Button */}
        <IconButton color="primary" onClick={handleOpen}>
          <AutoAwesomeIcon/>
        </IconButton>
      </Stack>

      {/* AI Chat Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <AIChat/>
      </Dialog>
    </Box>
  );
}
