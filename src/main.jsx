import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";

/* ------------------ Helpers ------------------ */

const getInitialMode = () => {
  const saved = localStorage.getItem("themeMode");
  if (saved) return saved;
  // Framer is a dark-first design system
  return "dark";
};

/* ------------------ Main Component ------------------ */

export default function Main() {
  const [mode, setMode] = React.useState(getInitialMode);

  const toggleTheme = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          ...(mode === "dark"
            ? {
                background: {
                  default: "#090909",
                  paper: "#141414",
                },
                text: {
                  primary: "#ffffff",
                  secondary: "#999999",
                },
                divider: "#262626",
                action: {
                  hover: "rgba(255, 255, 255, 0.05)",
                  selected: "rgba(255, 255, 255, 0.1)",
                },
              }
            : {
                background: {
                  default: "#f4f4f5",
                  paper: "#ffffff",
                },
                text: {
                  primary: "#090909",
                  secondary: "#52525b",
                },
                divider: "#e4e4e7",
                action: {
                  hover: "rgba(0, 0, 0, 0.04)",
                  selected: "rgba(0, 0, 0, 0.08)",
                },
              }),

          primary: {
            main: mode === "dark" ? "#ffffff" : "#090909",
            contrastText: mode === "dark" ? "#000000" : "#ffffff",
          },
          secondary: {
            main: "#0099ff", // Framer Accent Blue
          },
        },

        typography: {
          fontFamily:
            "'Inter', 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          h1: {
            fontFamily: "'Geist', 'Inter', sans-serif",
            fontWeight: 500,
            letterSpacing: "-0.045em",
          },
          h2: {
            fontFamily: "'Geist', 'Inter', sans-serif",
            fontWeight: 500,
            letterSpacing: "-0.04em",
          },
          h3: {
            fontFamily: "'Geist', 'Inter', sans-serif",
            fontWeight: 500,
            letterSpacing: "-0.035em",
          },
          h4: {
            fontFamily: "'Geist', 'Inter', sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.03em",
          },
          h5: {
            fontFamily: "'Geist', 'Inter', sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.025em",
          },
          h6: {
            fontFamily: "'Geist', 'Inter', sans-serif",
            fontWeight: 600,
            letterSpacing: "-0.02em",
          },
          button: {
            fontFamily: "'Inter', sans-serif",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "14px",
            letterSpacing: "-0.14px",
          },
        },

        shape: {
          borderRadius: 14,
        },

        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: mode === "dark" ? "#090909" : "#f4f4f5",
                color: mode === "dark" ? "#ffffff" : "#090909",
                transition: "background-color 0.25s ease, color 0.25s ease",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: "100px", // Framer signature pill CTA
                textTransform: "none",
                fontWeight: 500,
                fontSize: "14px",
                letterSpacing: "-0.14px",
                padding: "10px 18px",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:active": {
                  transform: "scale(0.98)",
                },
              },
              containedPrimary: {
                backgroundColor: mode === "dark" ? "#ffffff" : "#090909",
                color: mode === "dark" ? "#000000" : "#ffffff",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: mode === "dark" ? "#ececec" : "#1a1a1a",
                  boxShadow: "0 0 25px rgba(255, 255, 255, 0.15)",
                },
              },
              outlined: {
                borderColor: mode === "dark" ? "#262626" : "#e4e4e7",
                backgroundColor: mode === "dark" ? "#141414" : "#ffffff",
                color: mode === "dark" ? "#ffffff" : "#090909",
                "&:hover": {
                  borderColor: mode === "dark" ? "#383838" : "#d4d4d8",
                  backgroundColor: mode === "dark" ? "#1c1c1c" : "#f4f4f5",
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: "none",
                backgroundColor: mode === "dark" ? "#141414" : "#ffffff",
                borderColor: mode === "dark" ? "#262626" : "#e4e4e7",
                boxShadow:
                  mode === "dark"
                    ? "inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                    : "0 4px 20px rgba(0, 0, 0, 0.05)",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 10,
                backgroundColor: mode === "dark" ? "#141414" : "#ffffff",
                "& fieldset": {
                  borderColor: mode === "dark" ? "#262626" : "#e4e4e7",
                  transition: "border-color 0.2s ease",
                },
                "&:hover fieldset": {
                  borderColor: mode === "dark" ? "#3a3a3a" : "#a1a1aa",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0099ff",
                  boxShadow: "0 0 0 3px rgba(0, 153, 255, 0.2)",
                  borderWidth: "1.5px",
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: "100px",
                fontWeight: 500,
                fontSize: "13px",
                letterSpacing: "-0.13px",
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

const root = ReactDOM.createRoot(document.getElementById("sync-board"));
root.render(<Main />);