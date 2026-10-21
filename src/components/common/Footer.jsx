import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  useTheme,
} from "@mui/material";

function Footer() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        borderTop: `1px solid ${isDark ? "#1a1a1a" : "#e4e4e7"}`,
        backgroundColor: isDark ? "#090909" : "#fafafa",
        transition: "background-color 0.25s ease, border-color 0.25s ease",
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2.5}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src="/assets/pasteboard_logo.png"
              alt="SyncBoard Logo"
              sx={{ width: 20, height: 20, opacity: 0.8 }}
            />
            <Typography
              sx={{
                color: isDark ? "#999999" : "#71717a",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "-0.13px",
              }}
            >
              © {new Date().getFullYear()} SyncBoard · Zero-overhead real-time collaboration.
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2.5}
            sx={{
              alignItems: "center",
            }}
          >
            {[
              { label: "About", to: "/explore" },
              { label: "Contact", to: "/feedback" },
              { label: "Privacy", to: "/privacy-policy" },
              { label: "Terms", to: "/terms-conditions" },
            ].map((link) => (
              <Link
                key={link.label}
                component={RouterLink}
                to={link.to}
                underline="none"
                sx={{
                  color: isDark ? "#999999" : "#71717a",
                  fontSize: "13px",
                  fontWeight: 500,
                  letterSpacing: "-0.13px",
                  transition: "color 0.2s ease",
                  "&:hover": { color: isDark ? "#ffffff" : "#090909" },
                }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;