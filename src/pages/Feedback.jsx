import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import FeedbackForm from "../components/features/FeedbackForm";
import { pageLogging } from "../services/analyticsService";
import { Container, Box, Typography, useTheme } from "@mui/material";

export default function Feedback() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
        <title>Feedback & Community | SyncBoard</title>
        <meta
          name="description"
          content="Help shape the future of SyncBoard by sharing your thoughts, bug reports, and feature requests."
        />
      </Helmet>

      <Container maxWidth="md" sx={{ mt: { xs: 6, md: 10 }, mb: { xs: 8, md: 14 } }}>
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 8 } }}>
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
              Feedback Loop
            </Typography>
          </Box>

          <Typography
            component="h1"
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: { xs: "2.5rem", sm: "3.75rem", md: "4.5rem" },
              fontWeight: 500,
              lineHeight: { xs: 1.05, md: 0.98 },
              letterSpacing: { xs: "-1.5px", md: "-3.5px" },
              color: isDark ? "#ffffff" : "#090909",
              mb: 2.5,
            }}
          >
            Building With You
          </Typography>

          <Typography
            sx={{
              maxWidth: 580,
              mx: "auto",
              fontSize: { xs: "15px", md: "17px" },
              color: isDark ? "#999999" : "#71717a",
              fontWeight: 400,
              lineHeight: 1.5,
              letterSpacing: "-0.17px",
            }}
          >
            Every new feature starts with developer feedback.
            Tell us how SyncBoard feels in your daily workflow.
          </Typography>
        </Box>

        <FeedbackForm />

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography sx={{ fontSize: "12px", color: isDark ? "#666666" : "#a1a1aa", letterSpacing: "-0.12px" }}>
            Responses are stored anonymously and reviewed weekly.
          </Typography>
        </Box>
      </Container>
    </>
  );
}