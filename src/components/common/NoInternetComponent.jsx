import React, { useEffect } from "react";
import { pageLogging } from "../../services/analyticsService";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  useTheme,
} from "@mui/material";
import { WifiOff, RefreshCw } from "lucide-react";

/* ================= INTERNET STATUS HOOK ================= */

function useOnlineStatus() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    const interval = setInterval(async () => {
      try {
        await fetch("https://www.google.com/favicon.ico", {
          mode: "no-cors",
          cache: "no-store",
        });

        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    }, 10000);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      clearInterval(interval);
    };
  }, []);

  return isOnline;
}

/* ================= COMPONENT ================= */

export default function NoInternetComponent() {
  const isOnline = useOnlineStatus();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    if (!isOnline) pageLogging("No Internet");
  }, [isOnline]);

  if (isOnline) return null;

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: "24px",
          maxWidth: 440,
          textAlign: "center",
          backgroundColor: isDark ? "#141414" : "#ffffff",
          border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
          boxShadow: isDark
            ? "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 60px rgba(0, 0, 0, 0.6)"
            : "0 20px 60px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack spacing={3} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 85, 119, 0.12)",
              border: "1px solid rgba(255, 85, 119, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WifiOff size={28} color="#ff5577" />
          </Box>

          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "24px",
              letterSpacing: "-0.6px",
              color: isDark ? "#ffffff" : "#090909",
            }}
          >
            Connection Disconnected
          </Typography>

          <Typography sx={{ color: isDark ? "#999999" : "#71717a", fontSize: "14px", lineHeight: 1.5 }}>
            Real-time synchronization requires an active internet connection.
            Please verify your network connection to resume streaming.
          </Typography>

          <Typography
            sx={{
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: isDark ? "#666666" : "#a1a1aa",
            }}
          >
            Checking connection telemetry every 10s...
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => window.location.reload()}
            startIcon={<RefreshCw size={16} />}
            sx={{
              borderRadius: "100px",
              px: 3.5,
              py: 1.2,
              fontWeight: 600,
              backgroundColor: isDark ? "#ffffff" : "#090909",
              color: isDark ? "#000000" : "#ffffff",
              "&:hover": {
                backgroundColor: isDark ? "#ececec" : "#222222",
              },
            }}
          >
            Retry Connection
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}