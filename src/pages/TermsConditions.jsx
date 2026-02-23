import React from "react";
import { Helmet } from "react-helmet";
import { Container, Box, Typography, Divider } from "@mui/material";
import TermsConditionsContent from "../components/TermsConditionsContent";

function TermsConditions() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | SyncBoard</title>

        <meta
          name="description"
          content="Review the Terms & Conditions for using SyncBoard. Understand the rules and guidelines governing the use of our platform."
        />
        <link
          rel="canonical"
          href="https://example.com/terms-conditions"
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
              Terms & Conditions
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Last updated: March 2026
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 700 }}
            >
              Please read these terms carefully before using SyncBoard.
              By accessing or using our platform, you agree to comply with
              and be bound by the following terms and conditions.
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
            <TermsConditionsContent />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default TermsConditions;