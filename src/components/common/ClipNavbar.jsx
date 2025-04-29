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
} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PeopleIcon from "@mui/icons-material/People";
import ShareIcon from '@mui/icons-material/Share';
import { styled } from "@mui/material/styles";
import { useNavigate, useParams } from "react-router-dom";
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
            <Box 
              onClick={() => {
                navigate("/");
                setMobileOpen(false);
              }}
              sx={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 1, 
                textDecoration: "none", 
                color: "inherit",
                cursor: "pointer"
              }}
            >
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

            <Chip
              icon={<PeopleIcon sx={{ fontSize: "14px !important" }} />}
              label={`${activeUsers} active`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />

            <SelfDestructTimer
              code={code}
              expirationTime={roomData?.expirationTime}
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