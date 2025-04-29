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
          icon={<TimerIcon sx={{ fontSize: "14px !important" }} />}
          label={timeLeft}
          size="small"
          color="error"
          variant="outlined"
          sx={{ fontWeight: 600, animate: "pulse 2s infinite" }}
        />
      )}

      <Tooltip title="Self-Destruct Timer">
        <IconButton
          onClick={handleClick}
          size="small"
          color={expirationTime ? "error" : "default"}
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
