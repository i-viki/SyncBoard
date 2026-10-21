import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Box, Typography, Divider, useTheme } from "@mui/material";
import TermsConditionsContent from "../components/features/TermsConditionsContent";

function TermsConditions() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <>
      <Helmet>
        <title>Terms & Conditions | SyncBoard</title>
        <meta name="description" content="Read the Terms & Conditions that govern your usage of SyncBoard." />
      </Helmet>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          {/* Header Section */}
          <Box sx={{ mb: 7, textAlign: "center" }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 2,
                py: 0.5,
                borderRadius: "100px",
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.04)",
                border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                mb: 2.5,
              }}
            >
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#0099ff",
                }}
              >
                Terms of Use
              </Typography>
            </Box>

            <Typography
              variant="h1"
              sx={{
                fontFamily: "var(--font-display)",
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.25rem" },
                fontWeight: 500,
                lineHeight: { xs: 1.05, md: 0.98 },
                letterSpacing: { xs: "-1.5px", md: "-3px" },
                color: isDark ? "#ffffff" : "#090909",
                mb: 2,
              }}
            >
              Terms & Conditions
            </Typography>

            <Typography sx={{ maxWidth: 580, mx: "auto", fontSize: "16px", color: isDark ? "#999999" : "#71717a", lineHeight: 1.5 }}>
              Simple, transparent guidelines governing our temporary live collaboration platform.
            </Typography>
          </Box>

          <Box
            sx={{
              p: { xs: 3.5, md: 6 },
              borderRadius: "24px",
              border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
              backgroundColor: isDark ? "#141414" : "#ffffff",
              boxShadow: isDark
                ? "inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                : "0 10px 30px rgba(0, 0, 0, 0.05)",
              typography: "body1",
              lineHeight: 1.7,
              "& h2, & h3": {
                mt: 4,
                mb: 1.5,
                fontWeight: 600,
                fontSize: "1.25rem",
                letterSpacing: "-0.4px",
                color: isDark ? "#ffffff" : "#090909",
              },
              "& p": {
                color: isDark ? "#cccccc" : "#52525b",
                mb: 2,
                fontSize: "15px",
                letterSpacing: "-0.15px",
              },
              "& a": {
                color: "#0099ff",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              },
            }}
          >
            <Divider sx={{ mb: 4, borderColor: isDark ? "#1a1a1a" : "#e4e4e7" }} />
            <TermsConditionsContent />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default TermsConditions;