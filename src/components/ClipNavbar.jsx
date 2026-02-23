import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Chip,
  Container,
} from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import { styled } from "@mui/material/styles";
import { Link, useNavigate, useParams } from "react-router-dom";
import { appDatabase } from "../firebase/config";
import { ref, onDisconnect, onValue } from "firebase/database";
import { clickLogging } from "../scripts/analyticsLogging";
import { Toaster, toast } from "sonner";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

const GlassToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: theme.shape.borderRadius * 2,

  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",

  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(20, 24, 31, 0.65)"
      : "rgba(255, 255, 255, 0.7)",

  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[3],
  padding: "8px 16px",
}));

export default function ClipNavbar({ internetStatus,
  toggleTheme,
  mode, }) {
  const navigate = useNavigate();
  const { code } = useParams();
  const [status, setStatus] = useState("Connecting...");
  const database = appDatabase;
  const roomRef = ref(database, `/${code}`);

  // Validate room code
  useEffect(() => {
    const regExp = /^[a-zA-Z0-9]{5}$/;
    if (!regExp.test(code)) {
      navigate("/");
    }
  }, [code, navigate]);

  // Connection status
  useEffect(() => {
    onDisconnect(roomRef);
    const connectionStatusRef = ref(database, ".info/connected");
    onValue(connectionStatusRef, (snapshot) => {
      const isConnected = snapshot.val();
      setStatus(isConnected ? "Connected" : "Connecting...");
    });
  }, [database, roomRef]);

  const handleCopyCode = () => {
    const url = `https://example.com/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Board URL copied to clipboard", { duration: 2500 });
    clickLogging("Board URL Shared: " + code);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "transparent",
        boxShadow: "none",
        mt: 2,
      }}
    >
      <Container maxWidth="lg">
        <GlassToolbar disableGutters>
          {/* Left Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                textDecoration: "none",
                color: "text.primary",
              }}
            >
              <Box
                component="img"
                src="/assets/pasteboard_logo.png"
                alt="SyncBoard Logo"
                sx={{
                  width: 28,
                  height: 28,
                  objectFit: "contain",
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                SyncBoard
              </Typography>
            </Box>

            <Chip variant="outlined"
              label={!internetStatus ? "Offline" : status}
              color={
                !internetStatus
                  ? "error"
                  : status === "Connected"
                    ? "success"
                    : "warning"
              }
              size="small"
            />
          </Box>

          {/* Right Side – Pill */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: "999px",

              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",

              backgroundColor:
                (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(30,30,30,0.5)"
                    : "rgba(255,255,255,0.6)",

              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {code}
            </Typography>
            <IconButton
              onClick={handleCopyCode}
              size="small"
              sx={{ color: "text.primary" }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={toggleTheme}
              size="small"
              sx={{ color: "text.primary" }}
            >
              {mode === "dark" ? (
                <DarkModeIcon fontSize="small" />
              ) : (
                <LightModeIcon fontSize="small" />
              )}
            </IconButton>
          </Box>
        </GlassToolbar>
      </Container>
    </AppBar>
  );
}