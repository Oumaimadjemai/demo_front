import React, { useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Grid,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DragDrop({
  files,
  setFiles,
  existingFiles = [], // 🔹 fichiers déjà stockés (depuis backend)
  onRemoveExistingFile, // 🔹 callback suppression fichier existant
}) {
  const fileInputRef = useRef();
  const theme = useTheme();

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileClick = () => fileInputRef.current.click();

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ width: "90%", mx: "auto", mt: 4 }}>
      {/* Upload Box */}
      <Paper
        elevation={3}
        onClick={handleFileClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          border: `2px dashed ${theme.palette.primary.main}`,
          borderRadius: 2,
          padding: 2,
          textAlign: "center",
          bgcolor: theme.palette.primary.light,
          color: theme.palette.primary.contrastText,
          cursor: "pointer",
          "&:hover": {
            bgcolor: theme.palette.primary.main,
            color: "#fff",
          },
        }}
      >
        <Typography variant="body1">
          🖱 اسحب الملفات أو انقر لاختيارها
        </Typography>
        <input
          type="file"
          multiple
          hidden
          ref={fileInputRef}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </Paper>

      {/* ✅ Fichiers existants du client */}
      {existingFiles.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            الملفات الحالية:
          </Typography>
          <Grid container spacing={2}>
            {existingFiles.map((file) => (
              <Grid item key={file.id} xs={6} sm={4}>
                <Box position="relative">
                  {file.type === "image" ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "8px",
                        objectFit: "contain",
                        backgroundColor: "#f0f0f0",
                      }}
                    />
                  ) : (
                    <Paper
                      sx={{
                        width: 200,
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        bgcolor: theme.palette.grey[100],
                        cursor: "pointer",
                      }}
                      onClick={() => window.open(file.url, "_blank")}
                    >
                      {file.name}
                    </Paper>
                  )}
                  <IconButton
                    onClick={() => onRemoveExistingFile(file)}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      bgcolor: "rgba(255,255,255,0.8)",
                      color: theme.palette.error.main,
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,1)",
                      },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* ✅ Nouveaux fichiers ajoutés */}
      {files.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            الملفات الجديدة:
          </Typography>
          <Grid container spacing={2}>
            {files.map((file, index) => {
              const isImage = file.type.startsWith("image/");
              const fileURL = URL.createObjectURL(file);
              return (
                <Grid item key={index} xs={6} sm={4}>
                  <Box position="relative">
                    {isImage ? (
                      <img
                        src={fileURL}
                        alt={file.name}
                        style={{
                          width: "200px",
                          height: "200px",
                          borderRadius: "8px",
                          objectFit: "contain",
                          backgroundColor: "#f0f0f0",
                        }}
                      />
                    ) : (
                      <Paper
                        sx={{
                          width: 200,
                          height: 200,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          bgcolor: theme.palette.grey[100],
                          cursor: "pointer",
                        }}
                        onClick={() => window.open(fileURL, "_blank")}
                      >
                        {file.name}
                      </Paper>
                    )}
                    <IconButton
                      onClick={() => removeFile(index)}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        bgcolor: "rgba(255,255,255,0.8)",
                        color: theme.palette.error.main,
                        "&:hover": {
                          bgcolor: "rgba(255,255,255,1)",
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
