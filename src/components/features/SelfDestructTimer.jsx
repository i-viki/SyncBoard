import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
  useTheme,
} from "@mui/material";
import { Timer as TimerIcon, TimerOff as TimerOffIcon } from "@mui/icons-material";
import { setBoardExpiration } from "../../services/firebaseService";

export default function SelfDestructTimer({ code, expirationTime }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [anchorEl, setAnchorEl] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetTimer = async (minutes) => {
    await setBoardExpiration(code, minutes);
    handleClose();
  };

  useEffect(() => {
    if (!expirationTime) {
      setTimeLeft("");
      return;
    }

    const interval = setInterval(() => {
      const diff = expirationTime - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}:${secs.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {expirationTime && (
        <Chip
          icon={<TimerIcon sx={{ fontSize: "14px !important", color: "#ff5577 !important" }} />}
          label={timeLeft}
          size="small"
          sx={{
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            fontSize: "12px",
            letterSpacing: "0.5px",
            backgroundColor: "rgba(255, 85, 119, 0.12)",
            color: "#ff5577",
            border: "1px solid rgba(255, 85, 119, 0.3)",
            borderRadius: "100px",
            px: 0.5,
          }}
        />
      )}

      <Tooltip title="Auto Self-Destruct Timer">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            color: expirationTime ? "#ff5577" : (isDark ? "#999999" : "#71717a"),
            border: `1px solid ${
              expirationTime
                ? "rgba(255, 85, 119, 0.35)"
                : (isDark ? "#262626" : "#e4e4e7")
            }`,
            backgroundColor: expirationTime
              ? "rgba(255, 85, 119, 0.08)"
              : (isDark ? "#141414" : "#f4f4f5"),
            transition: "all 0.2s ease",
            "&:hover": {
              color: expirationTime ? "#ff5577" : (isDark ? "#ffffff" : "#090909"),
              borderColor: expirationTime ? "#ff5577" : (isDark ? "#383838" : "#a1a1aa"),
              backgroundColor: expirationTime
                ? "rgba(255, 85, 119, 0.16)"
                : (isDark ? "#1c1c1c" : "#eaeaea"),
              transform: "scale(1.05)",
            },
          }}
        >
          {expirationTime ? <TimerIcon sx={{ fontSize: 18 }} /> : <TimerOffIcon sx={{ fontSize: 18 }} />}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "16px",
              mt: 1,
              backgroundColor: isDark ? "#141414" : "#ffffff",
              border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
              boxShadow: isDark
                ? "0 16px 40px rgba(0, 0, 0, 0.5)"
                : "0 16px 40px rgba(0, 0, 0, 0.08)",
              p: 0.5,
              minWidth: 160,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => handleSetTimer(null)}
          sx={{
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            color: isDark ? "#999999" : "#71717a",
            "&:hover": { backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5", color: isDark ? "#ffffff" : "#090909" },
          }}
        >
          Disable Timer
        </MenuItem>
        <MenuItem
          onClick={() => handleSetTimer(10)}
          sx={{
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            color: isDark ? "#ffffff" : "#090909",
            "&:hover": { backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5", color: "#0099ff" },
          }}
        >
          10 Minutes
        </MenuItem>
        <MenuItem
          onClick={() => handleSetTimer(60)}
          sx={{
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            color: isDark ? "#ffffff" : "#090909",
            "&:hover": { backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5", color: "#0099ff" },
          }}
        >
          1 Hour
        </MenuItem>
        <MenuItem
          onClick={() => handleSetTimer(1440)}
          sx={{
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: 500,
            color: isDark ? "#ffffff" : "#090909",
            "&:hover": { backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5", color: "#0099ff" },
          }}
        >
          24 Hours
        </MenuItem>
      </Menu>
    </Box>
  );
}
