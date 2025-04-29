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
} from "@mui/material";
import { QRCodeSVG } from "qrcode.react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

export default function QRCodeModal({ open, onClose, url, code }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 1,
          maxWidth: 320,
          textAlign: "center",
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700 }}>
        Scan to Join Board
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Box
          sx={{
            p: 3,
            bgcolor: "white",
            borderRadius: 3,
            display: "inline-block",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <QRCodeSVG
            value={url}
            size={200}
            level={"H"}
            includeMargin={false}
          />
        </Box>
        <Typography variant="h6" sx={{ mt: 3, fontWeight: 600 }}>
          {code}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Point your camera at the QR code to open this board instantly on another device.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onClose}
          sx={{ borderRadius: 999 }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
