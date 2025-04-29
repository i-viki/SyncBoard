import React, { useEffect, useState } from "react";
import { pageLogging } from "../../services/analyticsService";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";

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

  useEffect(() => {
    if (!isOnline) pageLogging("No Internet");
  }, [isOnline]);

  if (isOnline) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 3,
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <Stack spacing={3} alignItems="center">
          {/* Image */}
          <Typography fontSize={80}>📡</Typography>

          {/* Title */}
          <Typography variant="h4" fontWeight={700}>
            Oops! You're Offline
          </Typography>

          {/* Description */}
          <Typography color="text.secondary">
            You need an internet connection to share data in real time.
            Please check your connection and try again.
          </Typography>
          <Typography variant="caption">
            Checking connection every 10 seconds...
          </Typography>
          {/* Retry Button */}
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}