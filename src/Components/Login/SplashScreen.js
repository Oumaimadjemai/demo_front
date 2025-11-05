import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function SplashScreen() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "primary.main", // teal background
        color: "white",
        textAlign: "center",
      }}
    >
      {/* Logo with pulse animation */}
      <img
        src="assets/images/logo.png"
        alt="Logo"
        style={{
          width: 120,
          marginBottom: 20,
          animation: "pulse 2s infinite",
        }}
      />

      {/* Arabic Hello with fade-in animation */}
      <Typography
        variant="h4"
        sx={{
          mb: 1,
          animation: "fadeIn 2s ease-in-out",
          fontWeight: "bold",
        }}
      >
        مرحباً بك
      </Typography>

      <Typography
        variant="h6"
        sx={{
          mb: 3,
          animation: "fadeIn 3s ease-in-out",
          fontStyle: "italic",
        }}
      >
        جاري التحميل...
      </Typography>

      <CircularProgress
        size={50}
        sx={{
          animation: "spin 1.5s linear infinite",
          color: "white",
        }}
      />

      {/* Animations */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
}
