import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Box, Typography, Divider, alpha } from "@mui/material";
import TermsConditionsContent from "../components/features/TermsConditionsContent";

function TermsConditions() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | SyncBoard</title>
        <meta name="description" content="Read the Terms & Conditions that govern your usage of SyncBoard." />
      </Helmet>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          {/* Header Section */}
          <Box sx={{ mb: 8, textAlign: "center" }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                letterSpacing: "-0.04em",
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 900,
              }}
            >
              Terms & Conditions
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, letterSpacing: 1, opacity: 0.6 }}>
              LAST UPDATED: FEBRUARY 2026
            </Typography>
          </Box>

          <Box
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 4,
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.2)}`,
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.6),
              backdropFilter: "blur(10px)",
              typography: "body1",
              lineHeight: 1.8,
              "& h2": {
                mt: 4,
                mb: 2,
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "text.primary"
              },
              "& p": {
                color: "text.primary",
                mb: 2,
                fontSize: "1rem",
                opacity: 0.9
              },
              "& ul": {
                mb: 3,
                color: "text.secondary"
              }
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 4, color: "text.primary", fontWeight: 600 }}>
              Please read these terms carefully before using SyncBoard.
              By accessing our platform, you agree to these legal terms.
            </Typography>

            <Divider sx={{ mb: 4, opacity: 0.5 }} />

            <TermsConditionsContent />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default TermsConditions;