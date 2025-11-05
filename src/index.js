import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


// ✅ RTL setup
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "@mui/stylis-plugin-rtl"; // ✅ This matches your install

// ✅ MUI theme setup (optional if you have one)
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";

// 1. Create RTL cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [rtlPlugin],
});

// 2. Optional: Create theme with rtl direction
const theme = createTheme({
  direction: "rtl",
  typography: {
    fontFamily: "Cairo, sans-serif",
    fontSize: 16, // ⬅️ increase base size (default is 14)
  },
  palette: {
    primary: { main: "#304ffe" },
    secondary: { main: "#0076ff" },
  },
});


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  </React.StrictMode>
);
