import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
    },
    background: {
      default: "#f5f7ff",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 12,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </>
    </ThemeProvider>
  </React.StrictMode>
);
