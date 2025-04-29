import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
} from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import { setBoardExpiration } from "../../services/firebaseService";

export default function SelfDestructTimer({ code, expirationTime }) {
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
          icon={<TimerIcon sx={{ fontSize: "14px !important", color: "inherit" }} />}
          label={timeLeft}
          size="small"
          sx={{ 
            fontWeight: 800, 
            backgroundColor: "rgba(211, 47, 47, 0.15)",
            color: "error.main",
            border: "1px solid rgba(211, 47, 47, 0.3)",
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
                "0%": { opacity: 0.8 },
                "50%": { opacity: 1, transform: "scale(1.05)" },
                "100%": { opacity: 0.8 }
            }
          }}
        />
      )}

      <Tooltip title="Self-Destruct Timer">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ 
            color: expirationTime ? "error.main" : "primary.main",
            backgroundColor: expirationTime ? "rgba(211, 47, 47, 0.1)" : "rgba(59, 130, 246, 0.1)",
            "&:hover": {
                backgroundColor: expirationTime ? "rgba(211, 47, 47, 0.2)" : "rgba(59, 130, 246, 0.2)",
            }
          }}
        >
          {expirationTime ? <TimerIcon fontSize="small" /> : <TimerOffIcon fontSize="small" />}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { borderRadius: 2, mt: 1 },
        }}
      >
        <MenuItem onClick={() => handleSetTimer(null)}>Disable Timer</MenuItem>
        <MenuItem onClick={() => handleSetTimer(10)}>10 Minutes</MenuItem>
        <MenuItem onClick={() => handleSetTimer(60)}>1 Hour</MenuItem>
        <MenuItem onClick={() => handleSetTimer(1440)}>24 Hours</MenuItem>
      </Menu>
    </Box>
  );
}
