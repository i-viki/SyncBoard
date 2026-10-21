import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import { CloseRounded as CloseRoundedIcon } from "@mui/icons-material";

export default function QRCodeModal({ open, onClose, url, code }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "24px",
            p: 1.5,
            maxWidth: 340,
            textAlign: "center",
            backgroundColor: isDark ? "#141414" : "#ffffff",
            border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
            boxShadow: isDark
              ? "0 24px 60px rgba(0, 0, 0, 0.7)"
              : "0 24px 60px rgba(0, 0, 0, 0.15)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          fontWeight: 600,
          fontSize: "17px",
          letterSpacing: "-0.4px",
          color: isDark ? "#ffffff" : "#090909",
        }}
      >
        Scan to Join Board
        <IconButton
          aria-label="close"
          onClick={onClose}
          size="small"
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: isDark ? "#999999" : "#71717a",
            "&:hover": { color: isDark ? "#ffffff" : "#090909" },
          }}
        >
          <CloseRoundedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 3, pt: 1 }}>
        <Box
          sx={{
            p: 2.5,
            bgcolor: "#ffffff",
            borderRadius: "16px",
            display: "inline-block",
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            border: isDark ? "none" : "1px solid #e4e4e7",
          }}
        >
          <QRCodeSVG
            value={url}
            size={190}
            level={"H"}
            includeMargin={false}
          />
        </Box>
        <Typography
          sx={{
            mt: 2.5,
            fontFamily: "var(--font-mono)",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "2px",
            color: isDark ? "#ffffff" : "#090909",
          }}
        >
          {code}
        </Typography>
        <Typography
          sx={{
            mt: 0.5,
            fontSize: "13px",
            color: isDark ? "#999999" : "#71717a",
            lineHeight: 1.45,
          }}
        >
          Point any mobile camera at this code to open and sync the live board instantly.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
          sx={{
            borderRadius: "100px",
            py: 1.2,
            fontWeight: 600,
            fontSize: "14px",
            backgroundColor: isDark ? "#ffffff" : "#090909",
            color: isDark ? "#000000" : "#ffffff",
            "&:hover": {
              backgroundColor: isDark ? "#ececec" : "#222222",
            },
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
