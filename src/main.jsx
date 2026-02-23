import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import swDev from "./swDev";
import "./index.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";

function Main() {
  const [mode, setMode] = React.useState(
    localStorage.getItem("themeMode") || "dark"
  );

  const toggleTheme = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,

          ...(mode === "dark" && {
            background: {
              default: "hsl(210, 14%, 7%)",
              paper: "hsl(210, 14%, 10%)",
            },
            text: {
              primary: "hsl(210, 20%, 95%)",
              secondary: "hsl(210, 10%, 70%)",
            },
          }),

          ...(mode === "light" && {
            background: {
              default: "hsl(210, 40%, 98%)",
              paper: "hsl(0, 0%, 100%)",
            },
            text: {
              primary: "hsl(210, 30%, 15%)",
              secondary: "hsl(210, 15%, 40%)",
            },
          }),

          primary: { main: "#3b82f6" },
          secondary: { main: "#6366f1" },
        },

        typography: {
          fontFamily: "'Noto Sans', sans-serif",
        },

        shape: {
          borderRadius: 12,
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <App toggleTheme={toggleTheme} mode={mode} />
      </Router>
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("sync-board")
);

root.render(<Main />);

swDev();
