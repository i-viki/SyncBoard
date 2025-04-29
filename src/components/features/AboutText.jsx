import React from "react";
import DevCard from "./DevCard";
import FAQsContent from "./FAQsContent";
import { developers } from "../../constants/developers";
import { frequentlyAskedQuestionsList } from "../../constants/faqs";
import { Container, Box, Typography, Divider, alpha, Stack } from "@mui/material";

function SectionHeader({ title, subtitle }) {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h3" 
        fontWeight={900} 
        gutterBottom
        sx={{
          letterSpacing: "-0.04em",
          color: "text.primary", // Solid color, no gradient
          fontSize: { xs: "2.5rem", md: "3.5rem" }
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 820, lineHeight: 1.6, fontWeight: 500 }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

function GlassSection({ children, sx = {} }) {
  return (
    <Box
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.5),
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
        mb: 8,
        ...sx
      }}
    >
      {children}
    </Box>
  );
}

function AboutText() {
  return (
    <Container maxWidth="lg" sx={{ mt: 16, mb: 16 }}>

      {/* HERO SECTION */}
      <SectionHeader 
        title="Real-Time Collaboration Without the Overhead" 
        subtitle="SyncBoard is a streamlined collaboration platform built for instant sharing. Create a board, share the link, and collaborate in real time. No accounts. No setup. No complexity."
      />

      {/* VALUE PROPS */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={4} sx={{ mb: 12 }}>
        <GlassSection sx={{ flex: 1, mb: 0 }}>
          <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: "primary.main", letterSpacing: "-0.02em" }}>
            Built for Speed
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontWeight: 500 }}>
            Modern teams move fast. SyncBoard removes the friction between idea and execution. Everything updates instantly, keeping everyone aligned without distractions.
          </Typography>
        </GlassSection>

        <GlassSection sx={{ flex: 1, mb: 0 }}>
          <Typography variant="h5" fontWeight={800} gutterBottom sx={{ color: "secondary.main", letterSpacing: "-0.02em" }}>
            Privacy First
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.7, fontWeight: 500 }}>
            Anonymous by design. No tracking, no profiles, no storage of sensitive data. Your collaboration stays in your temporary board, secured by your custom PIN.
          </Typography>
        </GlassSection>
      </Stack>

      {/* WORKFLOW */}
      <Box sx={{ mb: 15 }}>
        <Typography variant="h4" fontWeight={900} sx={{ mb: 8, textAlign: "center", letterSpacing: "-0.03em" }}>
          The Workflow
        </Typography>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="center">
          {[
            { step: "01", title: "Initialize", desc: "Generate a unique board ID in seconds." },
            { step: "02", title: "Share", desc: "Invite anyone instantly. No sign-ups." },
            { step: "03", title: "Sync", desc: "Text and images sync live across devices." }
          ].map((item) => (
            <Box key={item.step} sx={{ textAlign: "center", px: 2, flex: 1 }}>
              <Typography variant="h2" fontWeight={900} sx={{ opacity: 0.08, lineHeight: 1, mb: -2, color: "text.primary" }}>
                {item.step}
              </Typography>
              <Typography variant="h6" fontWeight={800} gutterBottom sx={{ letterSpacing: "-0.01em" }}>{item.title}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{item.desc}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* TEAM SECTION */}
      <GlassSection sx={{ mb: 15, py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="h4" fontWeight={900} gutterBottom sx={{ letterSpacing: "-0.03em" }}>
            Crafted by Engineers
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 700, mx: "auto", fontWeight: 500 }}>
            Built by developers who value performance, reliability, and thoughtful product design.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {developers.map((data) => (
            <DevCard key={data.name} {...data} />
          ))}
        </Box>
      </GlassSection>

      {/* FAQ SECTION */}
      <Box id="faqs" sx={{ mt: 10 }}>
        <Typography variant="h4" fontWeight={900} sx={{ mb: 2, textAlign: "center", letterSpacing: "-0.03em" }}>
          Common Questions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 8, textAlign: "center", fontWeight: 500 }}>
          Everything you need to know about using SyncBoard.
        </Typography>

        <Box sx={{ maxWidth: 800, mx: "auto" }}>
          {frequentlyAskedQuestionsList.map((faq, index) => (
            <FAQsContent key={faq.question} {...faq} index={index} />
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default AboutText;