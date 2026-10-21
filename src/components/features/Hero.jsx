import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clipboardLogging } from "../../services/analyticsService";
import FAQsIcon from "./FAQsIcon";
import {
  History as HistoryIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  Bolt as BoltIcon,
  ShieldOutlined as ShieldIcon,
  DevicesOutlined as DevicesIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  Stack,
  Chip,
  Grid,
  useTheme,
} from "@mui/material";

function Hero() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [joiningCode, setJoiningCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [history, setHistory] = useState([]);
  const JOINING_CODE_LENGTH = 5;

  useEffect(() => {
    try {
      const saved = localStorage.getItem("board_history");
      if (saved) {
        setHistory(JSON.parse(atob(saved)));
      }
    } catch (e) {
      console.error("Failed to parse history", e);
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("board_history");
    setHistory([]);
  };

  const generateJoiningCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let createdCode = "";
    for (let i = 0; i < JOINING_CODE_LENGTH; i++) {
      createdCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setJoiningCode("");
    clipboardLogging(createdCode, true);
    navigate(`/${createdCode}`);
  };

  const validateJoiningCode = () => {
    const regExp = /^[a-zA-Z0-9]+$/;
    const valid =
      joiningCode.length === JOINING_CODE_LENGTH &&
      regExp.test(joiningCode);

    if (valid) {
      setCodeError(false);
      clipboardLogging(joiningCode, false);
      navigate(`/${joiningCode}`);
    } else {
      setCodeError(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 10 }, mb: { xs: 8, md: 14 } }}>
      {/* Framer Display Hero Header */}
      <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
        {/* Subtle pill tag */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.6,
            borderRadius: "100px",
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
            border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#0099ff", // Framer accent blue
              boxShadow: "0 0 8px #0099ff",
            }}
          />
          <Typography
            sx={{
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "-0.12px",
              color: isDark ? "#999999" : "#71717a",
            }}
          >
            Live WebSocket Real-Time Synchronization
          </Typography>
        </Box>

        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2.75rem", sm: "4.25rem", md: "5.5rem" },
            fontWeight: 500,
            lineHeight: { xs: 1.02, md: 0.95 },
            letterSpacing: { xs: "-1.5px", sm: "-3.2px", md: "-4.5px" },
            color: isDark ? "#ffffff" : "#090909",
            mb: 2.5,
            maxWidth: "960px",
            mx: "auto",
          }}
        >
          Real-time clipboard for fast-moving teams.
        </Typography>

        <Typography
          sx={{
            maxWidth: "680px",
            mx: "auto",
            fontSize: { xs: "15px", sm: "17px", md: "18px" },
            lineHeight: 1.5,
            letterSpacing: "-0.18px",
            color: isDark ? "#999999" : "#71717a",
            fontWeight: 400,
          }}
        >
          Instant boards with unique keys. Share snippets, code, and images across
          devices in milliseconds. No signup, no storage traps.
        </Typography>
      </Box>

      {/* Main Dual Action Workbench (Surface 1) */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: "24px",
          border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
          backgroundColor: isDark ? "#141414" : "#ffffff",
          boxShadow: isDark
            ? "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 40px rgba(0, 0, 0, 0.4)"
            : "0 16px 40px -10px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.05)",
          position: "relative",
          overflow: "hidden",
          transition: "background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderColor: isDark ? "#262626" : "#e4e4e7", display: { xs: "none", md: "block" } }}
            />
          }
          spacing={{ xs: 4, md: 5 }}
          sx={{ alignItems: "stretch", justifyContent: "space-between" }}
        >
          {/* LEFT — CREATE */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: "var(--font-display)",
                  fontSize: { xs: "20px", md: "24px" },
                  fontWeight: 600,
                  letterSpacing: "-0.8px",
                  color: isDark ? "#ffffff" : "#090909",
                  mb: 1,
                }}
              >
                Create a New Board
              </Typography>

              <Typography
                sx={{
                  mb: 3,
                  fontSize: "14px",
                  lineHeight: 1.45,
                  letterSpacing: "-0.14px",
                  color: isDark ? "#999999" : "#71717a",
                }}
              >
                Spin up a blank temporary board. Anyone with your 5-letter key connects live.
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              onClick={generateJoiningCode}
              startIcon={<AddIcon sx={{ color: isDark ? "#000000" : "#ffffff" }} />}
              sx={{
                px: 3.5,
                py: 1.4,
                borderRadius: "100px",
                width: { xs: "100%", sm: "auto" },
                alignSelf: { xs: "stretch", md: "flex-start" },
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "-0.14px",
                backgroundColor: isDark ? "#ffffff" : "#090909",
                color: isDark ? "#000000" : "#ffffff",
                boxShadow: isDark
                  ? "0 4px 14px rgba(255, 255, 255, 0.12)"
                  : "0 4px 14px rgba(0, 0, 0, 0.15)",
                "&:hover": {
                  backgroundColor: isDark ? "#eaeaea" : "#222222",
                  transform: "scale(1.02)",
                },
              }}
            >
              Generate New Board
            </Button>
          </Box>

          {/* RIGHT — JOIN */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              textAlign: { xs: "center", md: "left" },
              width: "100%",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: "var(--font-display)",
                  fontSize: { xs: "20px", md: "24px" },
                  fontWeight: 600,
                  letterSpacing: "-0.8px",
                  color: codeError ? "#ff5577" : (isDark ? "#ffffff" : "#090909"),
                  mb: 1,
                }}
              >
                {codeError ? "Invalid Board ID" : "Join Existing Board"}
              </Typography>

              <Typography
                sx={{
                  mb: 3,
                  fontSize: "14px",
                  lineHeight: 1.45,
                  letterSpacing: "-0.14px",
                  color: isDark ? "#999999" : "#71717a",
                }}
              >
                Enter the 5-character board code to jump right into the live workspace.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ width: "100%" }}
            >
              <TextField
                aria-label="Board ID"
                placeholder="e.g. k7X2a"
                variant="outlined"
                size="medium"
                value={joiningCode}
                error={codeError}
                slotProps={{
                  htmlInput: {
                    maxLength: 5,
                    style: {
                      fontFamily: "var(--font-mono)",
                      fontSize: "15px",
                      letterSpacing: "2px",
                      textTransform: "none",
                    },
                  },
                }}
                onChange={(e) => {
                  setJoiningCode(e.target.value);
                  setCodeError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") validateJoiningCode();
                }}
                sx={{
                  flex: 1,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
                    borderRadius: "10px",
                  },
                }}
              />

              <Button
                aria-label="Join Board"
                variant="contained"
                size="large"
                onClick={validateJoiningCode}
                endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                sx={{
                  borderRadius: "100px",
                  px: 3,
                  py: 1.4,
                  fontSize: "14px",
                  fontWeight: 600,
                  letterSpacing: "-0.14px",
                  backgroundColor: isDark ? "#ffffff" : "#090909",
                  color: isDark ? "#000000" : "#ffffff",
                  width: { xs: "100%", sm: "auto" },
                  "&:hover": {
                    backgroundColor: isDark ? "#eaeaea" : "#222222",
                    transform: "scale(1.02)",
                  },
                }}
              >
                Join Board
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* RECENT BOARDS SECTION */}
      <Box sx={{ mt: 4, px: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HistoryIcon sx={{ fontSize: 16, color: isDark ? "#999999" : "#71717a" }} />
            <Typography
              sx={{
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                color: isDark ? "#999999" : "#71717a",
              }}
            >
              Recent Boards
            </Typography>
            {history.length > 0 && (
              <Box
                sx={{
                  px: 0.8,
                  py: 0.1,
                  borderRadius: "100px",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
                  color: isDark ? "#cccccc" : "#52525b",
                }}
              >
                {history.length}
              </Box>
            )}
          </Box>
          {history.length > 0 ? (
            <Button
              size="small"
              onClick={clearHistory}
              startIcon={<CloseIcon sx={{ fontSize: "13px !important" }} />}
              sx={{
                fontSize: "12px",
                fontWeight: 500,
                color: isDark ? "#999999" : "#71717a",
                p: "4px 8px",
                borderRadius: "100px",
                "&:hover": { color: "#ff5577", backgroundColor: "rgba(255, 85, 119, 0.08)" },
              }}
            >
              Clear
            </Button>
          ) : (
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 500,
                color: isDark ? "#666666" : "#a1a1aa",
                letterSpacing: "-0.1px",
              }}
            >
              Local device history
            </Typography>
          )}
        </Box>

        {history.length > 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
            {history.map((code) => (
              <Chip
                key={code}
                label={code}
                onClick={() => navigate(`/${code}`)}
                onDelete={(e) => {
                  e.stopPropagation();
                  const newHistory = history.filter((c) => c !== code);
                  localStorage.setItem("board_history", btoa(JSON.stringify(newHistory)));
                  setHistory(newHistory);
                }}
                deleteIcon={<CloseIcon sx={{ fontSize: "14px !important", color: isDark ? "#999999" : "#71717a" }} />}
                icon={<ArrowForwardIcon sx={{ fontSize: "14px !important", color: "#0099ff" }} />}
                sx={{
                  px: 1,
                  py: 2.2,
                  borderRadius: "100px",
                  fontWeight: 600,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "1px",
                  fontSize: "13px",
                  backgroundColor: isDark ? "#141414" : "#ffffff",
                  border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                  color: isDark ? "#ffffff" : "#090909",
                  boxShadow: isDark ? "none" : "0 2px 8px rgba(0, 0, 0, 0.04)",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  "&:hover": {
                    borderColor: "#0099ff",
                    backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 16px rgba(0, 153, 255, 0.15)",
                  },
                }}
              />
            ))}
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
              p: { xs: 2.25, sm: 2.75 },
              borderRadius: "14px",
              border: `1px dashed ${isDark ? "#262626" : "#e4e4e7"}`,
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.015)" : "rgba(0, 0, 0, 0.012)",
              transition: "border-color 0.2s ease",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  backgroundColor: isDark ? "#141414" : "#ffffff",
                  border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <HistoryIcon sx={{ fontSize: 18, color: isDark ? "#666666" : "#a1a1aa" }} />
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: "13.5px",
                    fontWeight: 600,
                    letterSpacing: "-0.2px",
                    color: isDark ? "#ffffff" : "#090909",
                    mb: 0.25,
                  }}
                >
                  No recent boards yet
                </Typography>
                <Typography
                  sx={{
                    fontSize: "12.5px",
                    lineHeight: 1.4,
                    letterSpacing: "-0.1px",
                    color: isDark ? "#888888" : "#71717a",
                  }}
                >
                  Boards you create or join will automatically appear here on this device for 1-click access.
                </Typography>
              </Box>
            </Box>

            <Button
              onClick={generateJoiningCode}
              variant="outlined"
              size="small"
              startIcon={<AddIcon sx={{ fontSize: 15 }} />}
              sx={{
                flexShrink: 0,
                borderRadius: "100px",
                px: 2,
                py: 0.75,
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "-0.1px",
                borderColor: isDark ? "#333333" : "#d4d4d8",
                color: isDark ? "#ffffff" : "#090909",
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
                "&:hover": {
                  borderColor: "#0099ff",
                  backgroundColor: isDark ? "rgba(0, 153, 255, 0.08)" : "rgba(0, 153, 255, 0.05)",
                  color: "#0099ff",
                },
              }}
            >
              Start New Board
            </Button>
          </Box>
        )}
      </Box>

      {/* FRAMER SIGNATURE ATMOSPHERE SPOTLIGHT CARDS */}
      <Box sx={{ mt: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            sx={{
              fontSize: { xs: "12px", md: "13px" },
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#0099ff",
              mb: 1,
            }}
          >
            Engineered For Frictionless Sharing
          </Typography>
          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: { xs: "28px", md: "36px" },
              fontWeight: 500,
              letterSpacing: "-1.5px",
              color: isDark ? "#ffffff" : "#090909",
            }}
          >
            Why teams sync with SyncBoard.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Card 1: Signature Violet Spotlight Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                height: "100%",
                p: { xs: 3.5, md: 4 },
                borderRadius: "30px", // Framer rounded.xxl
                background: "linear-gradient(135deg, #6a4cf5 0%, #d44df0 100%)",
                color: "#ffffff",
                boxShadow: "0 24px 60px -15px rgba(106, 76, 245, 0.4)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <BoltIcon sx={{ color: "#ffffff", fontSize: 24 }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: 600,
                    letterSpacing: "-0.6px",
                    mb: 1.5,
                    lineHeight: 1.2,
                  }}
                >
                  Live Multi-Client Sync
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: "rgba(255, 255, 255, 0.88)",
                    letterSpacing: "-0.14px",
                  }}
                >
                  Changes propagate in milliseconds via Firebase Realtime streams.
                  No polling delays, no refresh required.
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 4,
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                Instant Telemetry
              </Typography>
            </Box>
          </Grid>

          {/* Card 2: Charcoal / White Surface Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                height: "100%",
                p: { xs: 3.5, md: 4 },
                borderRadius: "24px",
                backgroundColor: isDark ? "#141414" : "#ffffff",
                border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                boxShadow: isDark
                  ? "inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                  : "0 10px 30px rgba(0, 0, 0, 0.05)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  borderColor: isDark ? "#383838" : "#d4d4d8",
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 153, 255, 0.08)",
                    border: `1px solid ${isDark ? "#262626" : "rgba(0, 153, 255, 0.2)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <ShieldIcon sx={{ color: "#0099ff", fontSize: 24 }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: 600,
                    letterSpacing: "-0.6px",
                    mb: 1.5,
                    color: isDark ? "#ffffff" : "#090909",
                    lineHeight: 1.2,
                  }}
                >
                  PIN-Locked Privacy
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: isDark ? "#999999" : "#71717a",
                    letterSpacing: "-0.14px",
                  }}
                >
                  Lock your workspace with a 6-digit SHA-256 PIN. Set automated
                  self-destruct countdowns to vanish data when done.
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 4,
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "#0099ff",
                }}
              >
                Zero Persistent Profiles
              </Typography>
            </Box>
          </Grid>

          {/* Card 3: Signature Sunset Orange Spotlight Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                height: "100%",
                p: { xs: 3.5, md: 4 },
                borderRadius: "30px", // Framer rounded.xxl
                background: "linear-gradient(135deg, #ff7a3d 0%, #ff5577 100%)",
                color: "#ffffff",
                boxShadow: "0 24px 60px -15px rgba(255, 122, 61, 0.35)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                position: "relative",
                overflow: "hidden",
                transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <DevicesIcon sx={{ color: "#ffffff", fontSize: 24 }} />
                </Box>
                <Typography
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontSize: "22px",
                    fontWeight: 600,
                    letterSpacing: "-0.6px",
                    mb: 1.5,
                    lineHeight: 1.2,
                  }}
                >
                  Device Agnostic
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: 1.5,
                    color: "rgba(255, 255, 255, 0.88)",
                    letterSpacing: "-0.14px",
                  }}
                >
                  Share code blocks, Markdown notes, or uploaded media between
                  desktops, iPads, and phones effortlessly via QR code.
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 4,
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                PWA & Offline Ready
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <FAQsIcon />
    </Container>
  );
}

export default Hero;