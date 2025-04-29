import React from "react";
import DevCard from "./DevCard";
import FAQsContent from "./FAQsContent";
import { developers } from "../../constants/developers";
import { frequentlyAskedQuestionsList } from "../../constants/faqs";
import { Container, Box, Typography, Divider } from "@mui/material";
function AboutText() {
  return (
    <Container maxWidth="lg" sx={{ mt: 12, mb: 12 }}>

      {/* HERO */}
      <Box sx={{ mb: 10 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Real-Time Collaboration Without the Overhead
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 820, lineHeight: 1.6 }}
        >
          SyncBoard is a streamlined collaboration platform built for instant
          sharing. Create a board, share the link, and collaborate in real time.
          No accounts. No setup. No complexity.
        </Typography>

        <Divider sx={{ mt: 6 }} />
      </Box>

      {/* VALUE PROPOSITION */}
      <Box sx={{ mb: 12 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Built for Speed and Focus
        </Typography>

        <Typography color="text.secondary" sx={{ maxWidth: 820, lineHeight: 1.7 }}>
          Modern teams move fast. SyncBoard removes the friction between idea
          and execution. Whether you're sharing code, drafting content, reviewing
          visuals, or transferring information across devices, everything updates
          instantly — keeping everyone aligned.
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ maxWidth: 820, mt: 3, lineHeight: 1.7 }}
        >
          The experience is intentionally minimal. Every interaction is designed
          to reduce distractions and keep collaboration focused.
        </Typography>
      </Box>

      {/* HOW IT WORKS */}
      <Box sx={{ mb: 12 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          How It Works
        </Typography>

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography color="text.secondary">
            <strong>1. Create a Board</strong> — Generate a unique board ID in seconds.
          </Typography>

          <Typography color="text.secondary">
            <strong>2. Share the Link</strong> — Invite anyone instantly. No sign-ups required.
          </Typography>

          <Typography color="text.secondary">
            <strong>3. Collaborate Live</strong> — Text and images sync in real time across devices.
          </Typography>
        </Box>
      </Box>

      {/* TEAM */}
      <Box sx={{ mb: 12 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Crafted by Engineers
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 820, lineHeight: 1.7 }}
        >
          SyncBoard is built by developers who value performance,
          reliability, and thoughtful product design. The platform evolves
          continuously through iterative improvements and user feedback.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexWrap: "wrap",
          }}
        >
          {developers.map((data) => (
            <DevCard key={data.name} {...data} />
          ))}
        </Box>
      </Box>

      {/* FAQ */}
      <Box id="faqs" sx={{ mt: 14 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Frequently Asked Questions
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 720 }}
        >
          Everything you need to know about using SyncBoard.
        </Typography>

        <Divider sx={{ mb: 8 }} />

        <Box sx={{ maxWidth: 900 }}>
          {frequentlyAskedQuestionsList.map((faq, index) => (
            <FAQsContent key={faq.question} {...faq} index={index} />
          ))}
        </Box>

        <Divider sx={{ mt: 8 }} />
      </Box>
    </Container>
  );
}

export default AboutText;