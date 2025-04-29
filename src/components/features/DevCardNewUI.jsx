import React from "react";
import { Box, Card, Typography, IconButton, Avatar, Stack, Chip } from "@mui/material";
import { Github, Linkedin, Sparkles } from "lucide-react";

function DevCardNewUI() {
  return (
    <Card
      sx={{
        width: 360,
        borderRadius: 3,
        p: 3,
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(20px)",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(145deg, rgba(25,25,25,0.9), rgba(15,15,15,0.9))"
            : "linear-gradient(145deg, #ffffff, #f5f5f5)",
        border: (theme) =>
          `1px solid ${
            theme.palette.mode === "dark"
              ? "rgba(255,215,0,0.25)"
              : "rgba(255,193,7,0.4)"
          }`,
        transition: "all .3s ease",
        "&:hover": {
          // boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Gold Accent Glow */}
      <Box
        sx={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,215,0,0.25), transparent 70%)",
        }}
      />

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Jayavignesh
          </Typography>
          <Chip
            label="Super User"
            size="small"
            sx={{
              mt: 1,
              fontSize: 12,
              background: "linear-gradient(90deg,#FFD700,#FFA500)",
              color: "#000",
              fontWeight: 600,
            }}
          />
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton
            component="a"
            href="https://jayavignesh.dev"
            target="_blank"
          >
            <Sparkles size={18} />
          </IconButton>

          <IconButton
            component="a"
            href="https://linkedin.com/in/jayavigneshj"
            target="_blank"
          >
            <Linkedin size={18} />
          </IconButton>

          <IconButton
            component="a"
            href="https://github.com/i-viki"
            target="_blank"
          >
            <Github size={18} />
          </IconButton>
        </Stack>
      </Stack>

      {/* Avatar */}
      <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
        <Avatar
          src="/assets/avatar-Jv.webp"
          sx={{
            width: 110,
            height: 110,
            border: "3px solid gold",
            boxShadow: "0 0 20px rgba(255,215,0,0.4)",
          }}
        />
      </Box>

      {/* About */}
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        About
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        Software engineer from India focused on building scalable,
        high-performance web applications.
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2, lineHeight: 1.6 }}
      >
        Passionate about clean architecture, product thinking, and
        crafting polished user experiences.
      </Typography>
    </Card>
  );
}

export default DevCardNewUI;