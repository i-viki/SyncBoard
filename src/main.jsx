import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";

/* ------------------ Helpers ------------------ */

// Get initial theme (localStorage -> system -> fallback)
const getInitialMode = () => {
  const saved = localStorage.getItem("themeMode");
  if (saved) return saved;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

/* ------------------ Main Component ------------------ */

function Main() {
  const [mode, setMode] = React.useState(getInitialMode);

  const toggleTheme = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  // Sync with system theme ONLY if user has not manually selected one
  React.useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (!localStorage.getItem("themeMode")) {
        setMode(e.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          ...(mode === "dark" && {
            background: {
              default: "hsl(210, 14%, 7%)",
              paper: "hsl(210, 14%, 10%)",
            },
            text: {
              primary: "hsl(210, 25%, 98%)",
              secondary: "rgb(171, 179, 186)",
            },
            divider: "rgba(255, 255, 255, 0.12)",
          }),

          ...(mode === "light" && {
            background: {
              default: "hsl(210, 40%, 98%)",
              paper: "hsl(0, 0%, 100%)",
            },
            text: {
              primary: "hsl(210, 35%, 10%)",
              secondary: "rgb(87, 102, 117)",
            },
            divider: "rgba(0, 0, 0, 0.08)",
          }),

          primary: { main: "#3b82f6" },
          secondary: { main: "#6366f1" },
        },

        typography: {
          fontFamily: "'Open Sans', sans-serif",
        },

        shape: {
          borderRadius: 12,
        },

        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition:
                  "background-color 0.3s ease, color 0.3s ease",
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                transition: "background-color 0.3s ease",
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                transition: "background-color 0.3s ease",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <App toggleTheme={toggleTheme} mode={mode} />
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

/* ------------------ Render ------------------ */

const root = ReactDOM.createRoot(
  document.getElementById("sync-board")
);

root.render(<Main />);