import React, { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Chip,
  Container,
  Button,
  Drawer,
  Divider,
  Stack,
} from "@mui/material";
import { 
  QrCode2 as QrCode2Icon, 
  People as PeopleIcon, 
  Share as ShareIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Menu as MenuIcon,
  CloseRounded as CloseRoundedIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
import { appDatabase } from "../../config/firebase";
import { ref, onDisconnect, onValue } from "firebase/database";
import { clickLogging } from "../../services/analyticsService";
import { toast } from "sonner";
import QRCodeModal from "./QRCodeModal";
import SelfDestructTimer from "../features/SelfDestructTimer";
import { trackPresence, listenToPresence, getRoomRef } from "../../services/firebaseService";
import { userIdentifier, sessionIdentifier } from "../../utils/userIdentifier";

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
  const roomRef = useMemo(() => getRoomRef(code), [code]);

  const [qrOpen, setQrOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [roomData, setRoomData] = useState({});
  const USER_UUID = userIdentifier();
  const SESSION_ID = sessionIdentifier();

  // Validate room code
  useEffect(() => {
    const regExp = /^[a-zA-Z0-9]{5}$/;
    if (!regExp.test(code)) {
      navigate("/");
    }
  }, [code, navigate]);

  // Connection status & Presence
  useEffect(() => {
    onDisconnect(roomRef);
    const connectionStatusRef = ref(appDatabase, ".info/connected");
    onValue(connectionStatusRef, (snapshot) => {
      const isConnected = snapshot.val();
      setStatus(isConnected ? "Connected" : "Connecting...");
    });

    // Track this session's presence
    const unsubTrack = trackPresence(code, SESSION_ID);

    // Listen to total active users
    const unsubPresence = listenToPresence(code, (count) => {
      setActiveUsers(count);
    });

    // Listen to room data for expiration
    const unsubRoom = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        setRoomData(snapshot.val());
      }
    });

    return () => {
      unsubPresence();
      unsubRoom();
      unsubTrack();
    };
  }, [roomRef, code, SESSION_ID]);

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
        slotProps={{
          paper: {
            sx: {
              width: 280,
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              backgroundColor:
                mode === "dark"
                  ? "rgba(10, 12, 16, 0.92)"
                  : "rgba(255, 255, 255, 0.95)",
              borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
              boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
            },
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
          {/* Header with Glow */}
          <Box
            sx={{
              p: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "2px",
                background: "linear-gradient(90deg, transparent, #3b82f6, transparent)",
                opacity: 0.5
              }
            }}
          >
            <Box 
              onClick={() => {
                navigate("/");
                setMobileOpen(false);
              }}
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1.5, 
                textDecoration: "none", 
                color: "inherit",
                cursor: "pointer"
              }}
            >
              <Box
                component="img"
                src="/assets/pasteboard_logo.png"
                sx={{ width: 28, height: 28 }}
              />
              <Typography variant="h6" sx={{ 
                fontWeight: 800, 
                letterSpacing: -0.5,
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #fff 0%, #94a3b8 100%)"
                    : "linear-gradient(135deg, #0f172a 0%, #475569 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                SyncBoard
              </Typography>
            </Box>

            <IconButton 
                onClick={toggleDrawer(false)}
                sx={{ 
                    backgroundColor: mode === "dark" ? "rgba(59, 130, 246, 0.1)" : "rgba(59, 130, 246, 0.05)",
                    color: "primary.main"
                }}
            >
              <CloseRoundedIcon size="small" />
            </IconButton>
          </Box>

          <Divider />

          {/* Content Sections */}
          <Box sx={{ px: 2, py: 3, flex: 1 }}>
            {/* Board Code Well */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, mb: 1.5, display: "block", opacity: 0.9 }}>
                Active Board
                </Typography>

                <Box
                sx={{
                    px: 2,
                    py: 2,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                }}
                >
                <Box>
                    <Typography variant="h5" sx={{ color: "primary.main", letterSpacing: 2, fontWeight: 800 }}>
                        {code}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                        Sharing Code
                    </Typography>
                </Box>

                <IconButton
                    onClick={() => {
                    handleCopyCode();
                    setMobileOpen(false);
                    }}
                    sx={{ backgroundColor: "primary.main", color: "white", "&:hover": { backgroundColor: "primary.dark" } }}
                >
                    <ShareIcon fontSize="small" />
                </IconButton>
                </Box>
            </Box>

            {/* Status & Security Well */}
            <Box
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                    backgroundColor: mode === "dark" ? "rgba(59, 130, 246, 0.05)" : "rgba(59, 130, 246, 0.02)",
                    border: (theme) => `1px solid ${mode === "dark" ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"}`,
                }}
            >
                <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, mb: 2, display: "block", opacity: 0.9 }}>
                    Network & Security
                </Typography>

                <Stack spacing={3}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Status</Typography>
                        <Chip
                            label={!internetStatus ? "Offline" : status}
                            color={!internetStatus ? "error" : status === "Connected" ? "success" : "warning"}
                            size="small"
                            sx={{ fontWeight: 700, borderRadius: 1 }}
                        />
                    </Box>

                    <Box>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Self-Destruct</Typography>
                        <SelfDestructTimer
                            code={code}
                            expirationTime={roomData?.expirationTime}
                        />
                    </Box>
                </Stack>
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
              onClick={() => navigate("/")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer"
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
                  fontWeight: 700,
                  lineHeight: 1,
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, #fff 0%, #94a3b8 100%)"
                      : "linear-gradient(135deg, #0f172a 0%, #475569 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
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

            <Chip
              icon={<PeopleIcon sx={{ fontSize: "14px !important" }} />}
              label={
                <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                    {activeUsers}
                    <Box component="span" sx={{ display: { xs: "none", sm: "inline" }, ml: 0.5 }}>
                        active
                    </Box>
                </Box>
              }
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />

            <Box sx={{ display: { xs: "none", md: "block" } }}>
                <SelfDestructTimer
                code={code}
                expirationTime={roomData?.expirationTime}
                />
            </Box>
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

            <IconButton onClick={() => setQrOpen(true)} size="small">
              <QrCode2Icon fontSize="small" />
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
      
      <QRCodeModal 
        open={qrOpen} 
        onClose={() => setQrOpen(false)} 
        url={`https://isyncboard.vercel.app/${code}`}
        code={code}
      />
    </AppBar>
  );
}