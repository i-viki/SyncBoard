import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import FeedbackForm from "../components/features/FeedbackForm";
import { pageLogging } from "../services/analyticsService";
import { Container, Box, Typography, alpha } from "@mui/material";

export default function Feedback() {
  useEffect(() => {
    const today = new Date();
    const getData = JSON.parse(localStorage.getItem("feedback")) || {};

    localStorage.setItem(
      "feedback",
      JSON.stringify({
        ...getData,
        lastShown: today,
        hasOpenedFeedbackPageToday: true,
      })
    );

    pageLogging("Feedback");
  }, []);

  return (
    <>
      <Helmet>
        <title>Share Your Feedback | SyncBoard</title>
        <meta name="description" content="Help improve SyncBoard by sharing your feedback and suggestions." />
      </Helmet>

      <Box 
        sx={{ 
          py: { xs: 8, md: 15 },
          background: (theme) => 
            theme.palette.mode === "dark" 
              ? "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.03) 0%, transparent 60%)"
              : "radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.01) 0%, transparent 60%)"
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography 
              component="h1" 
              variant="h2" 
              fontWeight={900} 
              gutterBottom
              sx={{
                letterSpacing: "-0.05em",
                color: "text.primary", // Solid color
              }}
            >
              Building With You
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", fontWeight: 500, lineHeight: 1.6 }}
            >
              Every feature and polish starts with real feedback. 
              Tell us how SyncBoard feels, and where we should go next.
            </Typography>
          </Box>

          <Box
            sx={{
              p: { xs: 3, md: 6 },
              borderRadius: 6,
              border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.5),
              backdropFilter: "blur(20px)",
              boxShadow: (theme) => `0 32px 64px -12px ${alpha(theme.palette.common.black, 0.15)}`,
              position: "relative",
              zIndex: 1
            }}
          >
            <FeedbackForm />
          </Box>

          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.6, fontWeight: 500 }}>
              We carefully review every submission to shape the future of SyncBoard.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}