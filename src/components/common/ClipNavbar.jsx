import React, { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Container,
  Button,
  Drawer,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  QrCode2 as QrCode2Icon,
  People as PeopleIcon,
  Share as ShareIcon,
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon,
  Menu as MenuIcon,
  CloseRounded as CloseRoundedIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { useNavigate, useParams, Link } from "react-router-dom";
import { appDatabase } from "../../config/firebase";
import { ref, onValue } from "firebase/database";
import { clickLogging } from "../../services/analyticsService";
import { toast } from "sonner";
import QRCodeModal from "./QRCodeModal";
import SelfDestructTimer from "../features/SelfDestructTimer";
import { trackPresence, listenToPresence, getRoomRef } from "../../services/firebaseService";
import { sessionIdentifier } from "../../utils/userIdentifier";
import { ensureAnonymousAuth } from "../../services/authService";

export default function ClipNavbar({ internetStatus, toggleTheme, mode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleDrawer = (open) => () => setMobileOpen(open);

  const navigate = useNavigate();
  const { code } = useParams();
  const [status, setStatus] = useState("Connecting...");
  const roomRef = useMemo(() => getRoomRef(code), [code]);

  const [qrOpen, setQrOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [roomData, setRoomData] = useState({});
  const SESSION_ID = sessionIdentifier();
  const isDark = mode === "dark";

  // Validate room code
  useEffect(() => {
    const regExp = /^[a-zA-Z0-9]{5}$/;
    if (!regExp.test(code)) {
      navigate("/");
    }
  }, [code, navigate]);

  // Connection status & Presence — wait for auth first
  useEffect(() => {
    let cancelled = false;
    let unsubConnected = null;
    let unsubTrack = null;
    let unsubPresence = null;
    let unsubRoom = null;

    ensureAnonymousAuth()
      .then(() => {
        if (cancelled) return;

        const connectionStatusRef = ref(appDatabase, ".info/connected");
        unsubConnected = onValue(connectionStatusRef, (snapshot) => {
          const isConnected = snapshot.val();
          setStatus(isConnected ? "Connected" : "Connecting...");
        });

        // Track this session's presence
        unsubTrack = trackPresence(code, SESSION_ID);

        // Listen to total active users
        unsubPresence = listenToPresence(code, (count) => {
          setActiveUsers(count);
        });

        // Listen to room data for expiration
        unsubRoom = onValue(roomRef, (snapshot) => {
          if (snapshot.exists()) {
            setRoomData(snapshot.val());
          }
        });
      })
      .catch(() => {
        // Auth failed — listeners won't start
      });

    return () => {
      cancelled = true;
      if (unsubConnected) unsubConnected();
      if (unsubPresence) unsubPresence();
      if (unsubRoom) unsubRoom();
      if (unsubTrack) unsubTrack();
    };
  }, [roomRef, code, SESSION_ID]);

  const handleCopyCode = () => {
    const url = `https://isyncboard.vercel.app/${code}`;
    navigator.clipboard.writeText(url);
    toast.success("Board link copied to clipboard", { duration: 2500 });
    clickLogging("Board URL Shared: " + code);
  };

  const isConnected = internetStatus && status === "Connected";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        zIndex: 1100,
        backgroundColor: isDark ? "rgba(9, 9, 9, 0.85)" : "rgba(250, 250, 250, 0.85)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderBottom: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
        boxShadow: "none",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            height: 56,
            minHeight: "56px !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Left Brand & Workspace Telemetry */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.25,
                textDecoration: "none",
                color: isDark ? "#ffffff" : "#090909",
                transition: "opacity 0.15s ease",
                "&:hover": { opacity: 0.8 },
              }}
            >
              <Box
                component="img"
                src="/assets/pasteboard_logo.png"
                alt="SyncBoard Logo"
                sx={{
                  width: 22,
                  height: 22,
                  objectFit: "contain",
                }}
              />
              <Typography
                sx={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "15px",
                  letterSpacing: "-0.035em",
                  color: isDark ? "#ffffff" : "#090909",
                }}
              >
                SyncBoard
              </Typography>
            </Box>

            {/* Subtle vertical hairline separator */}
            <Box
              sx={{
                width: "1px",
                height: 16,
                backgroundColor: isDark ? "#262626" : "#e4e4e7",
                mx: 0.5,
              }}
            />

            {/* Connection Indicator */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.8,
                px: 1,
                py: 0.25,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: isConnected ? "#22c55e" : "#ff5577",
                }}
              />
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 500,
                  color: isDark ? "#999999" : "#71717a",
                  letterSpacing: "-0.12px",
                }}
              >
                {!internetStatus ? "Offline" : status}
              </Typography>
            </Box>

            {/* Active Users Pill */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 0.6,
                px: 1,
                py: 0.25,
              }}
            >
              <PeopleIcon sx={{ fontSize: 14, color: isDark ? "#999999" : "#71717a" }} />
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: isDark ? "#ffffff" : "#090909",
                  letterSpacing: "-0.12px",
                }}
              >
                {activeUsers}
              </Typography>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: isDark ? "#999999" : "#71717a",
                }}
              >
                active
              </Typography>
            </Box>

            {/* Self-Destruct Timer on desktop */}
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <SelfDestructTimer code={code} expirationTime={roomData?.expirationTime} />
            </Box>
          </Box>

          {/* Right Action Bar */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5 }}>
            {/* Clickable Board Code Badge */}
            <Tooltip title="Click to copy board link">
              <Box
                onClick={handleCopyCode}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.8,
                  px: 1.5,
                  py: 0.45,
                  borderRadius: "6px",
                  backgroundColor: isDark ? "#141414" : "#f4f4f5",
                  border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                  cursor: "pointer",
                  transition: "background-color 0.15s ease, border-color 0.15s ease",
                  "&:hover": {
                    borderColor: isDark ? "#383838" : "#d4d4d8",
                    backgroundColor: isDark ? "#1c1c1c" : "#eaeaea",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    fontSize: "13px",
                    letterSpacing: "0.5px",
                    color: isDark ? "#ffffff" : "#090909",
                  }}
                >
                  {code}
                </Typography>
                <ContentCopyIcon sx={{ fontSize: 13, color: isDark ? "#999999" : "#71717a" }} />
              </Box>
            </Tooltip>

            {/* Share CTA */}
            <Button
              variant="contained"
              size="small"
              onClick={handleCopyCode}
              startIcon={<ShareIcon sx={{ fontSize: 14 }} />}
              sx={{
                borderRadius: "100px",
                px: 2,
                py: 0.65,
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "-0.13px",
                backgroundColor: isDark ? "#ffffff" : "#090909",
                color: isDark ? "#000000" : "#ffffff",
                boxShadow: "none",
                transition: "background-color 0.15s ease, transform 0.1s ease",
                "&:hover": {
                  backgroundColor: isDark ? "#ececec" : "#222222",
                  boxShadow: "none",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              Share Board
            </Button>

            {/* QR Code circular button */}
            <Tooltip title="QR Code for mobile join">
              <IconButton
                onClick={() => setQrOpen(true)}
                size="small"
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  color: isDark ? "#999999" : "#71717a",
                  transition: "color 0.15s ease, background-color 0.15s ease",
                  "&:hover": {
                    color: isDark ? "#ffffff" : "#090909",
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                <QrCode2Icon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            {/* Theme Toggle circular button */}
            <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
              <IconButton
                onClick={toggleTheme}
                size="small"
                aria-label="Toggle theme"
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  color: isDark ? "#999999" : "#71717a",
                  transition: "color 0.15s ease, background-color 0.15s ease",
                  "&:hover": {
                    color: isDark ? "#ffffff" : "#090909",
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                {isDark ? <LightModeIcon sx={{ fontSize: 18 }} /> : <DarkModeIcon sx={{ fontSize: 18 }} />}
              </IconButton>
            </Tooltip>
          </Box>

          {/* Mobile hamburger */}
          <IconButton
            sx={{
              display: { xs: "flex", md: "none" },
              width: 34,
              height: 34,
              color: isDark ? "#ffffff" : "#090909",
            }}
            onClick={toggleDrawer(true)}
            size="small"
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={toggleDrawer(false)}
        slotProps={{
          paper: {
            sx: {
              width: 290,
              backdropFilter: "blur(20px)",
              backgroundColor: isDark ? "rgba(9, 9, 9, 0.96)" : "rgba(255, 255, 255, 0.98)",
              borderLeft: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
              p: 2.5,
            },
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box
            sx={{
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
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
                gap: 1.2,
                cursor: "pointer",
              }}
            >
              <Box
                component="img"
                src="/assets/pasteboard_logo.png"
                alt="SyncBoard Logo"
                sx={{ width: 20, height: 20 }}
              />
              <Typography
                sx={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "15px",
                  letterSpacing: "-0.03em",
                  color: isDark ? "#ffffff" : "#090909",
                }}
              >
                SyncBoard
              </Typography>
            </Box>

            <IconButton onClick={toggleDrawer(false)} size="small" sx={{ color: isDark ? "#999999" : "#71717a" }}>
              <CloseRoundedIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2, borderColor: isDark ? "#1a1a1a" : "#e4e4e7" }} />

          {/* Active Board Card */}
          <Box
            sx={{
              p: 2,
              borderRadius: "14px",
              backgroundColor: isDark ? "#141414" : "#f4f4f5",
              border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: isDark ? "#999999" : "#71717a",
                mb: 1,
              }}
            >
              Board Code
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "20px",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                  color: isDark ? "#ffffff" : "#090909",
                }}
              >
                {code}
              </Typography>

              <Button
                variant="contained"
                size="small"
                onClick={() => {
                  handleCopyCode();
                  setMobileOpen(false);
                }}
                startIcon={<ShareIcon sx={{ fontSize: 14 }} />}
                sx={{
                  px: 1.8,
                  py: 0.5,
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: 600,
                  backgroundColor: isDark ? "#ffffff" : "#090909",
                  color: isDark ? "#000000" : "#ffffff",
                  boxShadow: "none",
                  "&:hover": {
                    backgroundColor: isDark ? "#ececec" : "#222222",
                    boxShadow: "none",
                  },
                }}
              >
                Share
              </Button>
            </Box>
          </Box>

          {/* Session Telemetry */}
          <Box
            sx={{
              p: 2,
              borderRadius: "14px",
              backgroundColor: isDark ? "#141414" : "#f4f4f5",
              border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontSize: "13px", color: isDark ? "#999999" : "#71717a", fontWeight: 500 }}>
                Status
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: isConnected ? "#22c55e" : "#ff5577",
                  }}
                />
                <Typography sx={{ fontSize: "13px", fontWeight: 600, color: isDark ? "#ffffff" : "#090909" }}>
                  {!internetStatus ? "Offline" : status}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontSize: "13px", color: isDark ? "#999999" : "#71717a", fontWeight: 500 }}>
                Active Peers
              </Typography>
              <Typography sx={{ fontSize: "13px", fontWeight: 600, color: isDark ? "#ffffff" : "#090909" }}>
                {activeUsers} online
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontSize: "13px", color: isDark ? "#999999" : "#71717a", fontWeight: 500 }}>
                Self-Destruct
              </Typography>
              <SelfDestructTimer code={code} expirationTime={roomData?.expirationTime} />
            </Box>
          </Box>

          <Box sx={{ flex: 1 }} />

          <Divider sx={{ my: 2, borderColor: isDark ? "#1a1a1a" : "#e4e4e7" }} />

          <Button
            fullWidth
            variant="outlined"
            startIcon={isDark ? <LightModeIcon sx={{ fontSize: 16 }} /> : <DarkModeIcon sx={{ fontSize: 16 }} />}
            onClick={() => {
              toggleTheme();
              setMobileOpen(false);
            }}
            sx={{
              borderRadius: "100px",
              py: 0.9,
              borderColor: isDark ? "#262626" : "#e4e4e7",
              color: isDark ? "#ffffff" : "#090909",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </Button>
        </Box>
      </Drawer>

      <QRCodeModal
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        url={`https://isyncboard.vercel.app/${code}`}
        code={code}
      />
    </AppBar>
  );
}