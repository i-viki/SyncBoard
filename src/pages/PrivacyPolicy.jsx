import React from "react";
import { Helmet } from "react-helmet";
import { Container, Box, Typography, Divider } from "@mui/material";
import PrivacyPolicyContent from "../components/PrivacyPolicyContent";

function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | SyncBoard</title>

        <meta
          name="description"
          content="Read our Privacy Policy to understand how SyncBoard handles and protects your data."
        />

        <link
          rel="canonical"
          href="https://example.com/privacy-policy"
        />
      </Helmet>

      <Box
        sx={(theme) => ({
          py: 10,
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0.02)",
        })}
      >
        <Container maxWidth="md">
          {/* Header Section */}
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              fontWeight={700}
              gutterBottom
            >
              Privacy Policy
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 700 }}
            >
              Your privacy matters to us. This policy explains how
              SyncBoard collects, uses, and safeguards information
              while you use our platform.
            </Typography>

            <Divider sx={{ mt: 4 }} />
          </Box>

          {/* Content Section */}
          <Box
            sx={{
              typography: "body1",
              lineHeight: 1.8,
              "& h2": {
                mt: 5,
                mb: 2,
                fontWeight: 600,
              },
              "& p": {
                color: "text.secondary",
                mb: 2,
              },
            }}
          >
            <PrivacyPolicyContent />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default PrivacyPolicy;