import React, { useState } from "react";
import {
  Box,
  IconButton,
  Popover,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";

export default function FilterPanel({ filters = [], values = {}, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
      <IconButton onClick={handleOpen} color="primary">
        <TuneIcon sx={{ fontSize: "35px" }} />
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Typography variant="subtitle1" gutterBottom>
            فلاتر
          </Typography>

          <Stack spacing={2}>
            {filters.map((filter) => (
              <FormControl fullWidth key={filter.name}>
                <InputLabel>{filter.label}</InputLabel>
                <Select
                  name={filter.name}
                  value={values[filter.name] || ""}
                  onChange={onChange}
                >
                  {filter.options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ))}
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
}
