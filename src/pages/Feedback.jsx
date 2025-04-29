import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import FeedbackForm from "../components/features/FeedbackForm";
import { pageLogging } from "../services/analyticsService";
import { Container, Box, Typography } from "@mui/material";

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

        <meta
          name="description"
          content="Help improve SyncBoard by sharing your feedback, feature ideas, and suggestions. Your input helps us build a faster and better real-time collaboration experience."
        />

        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Share Your Feedback | SyncBoard"
        />
        <meta
          property="og:description"
          content="Your feedback shapes SyncBoard. Tell us what works, what can improve, and what you'd like to see next."
        />
        <meta
          property="og:url"
          content="https://isyncboard.vercel.app/feedback"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="Share Your Feedback | SyncBoard"
        />
        <meta
          name="twitter:description"
          content="Share your ideas and help make SyncBoard better."
        />

        <link
          rel="canonical"
          href="https://isyncboard.vercel.app/feedback"
        />
      </Helmet>

      <Box sx={{ py: { xs: 6, md: 10 } }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography component="h1" variant="h3" fontWeight={700} gutterBottom>
              We’re Building This With You
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Every feature, every improvement, every polish — starts with real
              feedback. Tell us how SyncBoard feels, and where we should go next.
            </Typography>
          </Box>

          <FeedbackForm />


          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography variant="body2" color="text.secondary">
              We read every submission carefully. Your feedback directly influences
              upcoming SyncBoard improvements.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}