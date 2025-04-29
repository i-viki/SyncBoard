import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Chip,
  Container,
  Button,
} from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import { styled } from "@mui/material/styles";
import { Link, useNavigate, useParams } from "react-router-dom";
import { appDatabase } from "../../config/firebase";
import { ref, onDisconnect, onValue } from "firebase/database";
import { clickLogging } from "../../services/analyticsService";
import { Toaster, toast } from "sonner";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setMobileOpen(open);
  };
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
    const url = `https://isyncboard.vercel.app/${code}`;
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
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 260,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundColor:
              mode === "dark"
                ? "rgba(20, 24, 31, 0.95)"
                : "rgba(255,255,255,0.95)",
            borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src="/assets/pasteboard_logo.png"
                sx={{ width: 24 }}
              />
              <Typography fontWeight={600}>SyncBoard</Typography>
            </Box>

            <IconButton onClick={toggleDrawer(false)}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Content */}
          <Box sx={{ px: 2, py: 2, flex: 1 }}>
            {/* Board Code */}
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              Board Code
            </Typography>

            <Box
              sx={{
                mt: 0.5,
                mb: 2,
                px: 2,
                py: 1,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor:
                  mode === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
              }}
            >
              <Typography fontWeight={600}>{code}</Typography>

              <IconButton
                size="small"
                onClick={() => {
                  handleCopyCode();
                  setMobileOpen(false);
                }}
              >
                <ShareIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Connection Status */}
            <Typography variant="caption" sx={{ opacity: 0.6 }}>
              Status
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Chip
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
          </Box>

          <Divider />

          {/* Bottom Section */}
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={
                mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />
              }
              onClick={() => {
                toggleTheme();
                setMobileOpen(false);
              }}
              sx={{ borderRadius: 999 }}
            >
              Toggle Theme
            </Button>
          </Box>
        </Box>
      </Drawer>
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
                gap: 1,
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
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: "999px",
              backdropFilter: "blur(12px)",
              backgroundColor:
                (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(30,30,30,0.5)"
                    : "rgba(255,255,255,0.6)",
              border: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
              {code}
            </Typography>

            <IconButton onClick={handleCopyCode} size="small">
              <ShareIcon fontSize="small" />
            </IconButton>

            <IconButton onClick={toggleTheme} size="small">
              {mode === "dark" ? (
                <DarkModeIcon fontSize="small" />
              ) : (
                <LightModeIcon fontSize="small" />
              )}
            </IconButton>
          </Box>

          {/* Mobile Hamburger */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
        </GlassToolbar>
      </Container>
    </AppBar>
  );
}