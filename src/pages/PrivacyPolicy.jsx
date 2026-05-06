import React from "react";
import { Helmet } from "react-helmet-async";
import { Container, Box, Typography, Divider, alpha } from "@mui/material";
import PrivacyPolicyContent from "../components/features/PrivacyPolicyContent";

function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | SyncBoard</title>
        <meta name="description" content="Learn how SyncBoard protects your privacy and handles data." />
      </Helmet>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          {/* Header Section */}
          <Box sx={{ mb: 8, textAlign: "center" }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                letterSpacing: "-0.04em",
                background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 900,
              }}
            >
              Privacy Policy
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", fontWeight: 500 }}>
              Your privacy is our priority. This policy outlines how we safeguard your data
              while providing a seamless collaboration experience.
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
              }
            }}
          >
            <Divider sx={{ mb: 4, opacity: 0.5 }} />

            <PrivacyPolicyContent />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default PrivacyPolicy;