import React, { useEffect } from "react";
import FeedbackForm from "../components/FeedbackForm";
import { pageLogging } from "../scripts/analyticsLogging";
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
      <Container maxWidth="md" sx={{ mt: 10, mb: 8 }}>
        {/* <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
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
        </Box> */}
        <FeedbackForm />
      </Container>
    </>
  );
}