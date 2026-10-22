import React from "react";
import DevCard from "./DevCard";
import FAQsContent from "./FAQsContent";
import { developers } from "../../constants/developers";
import { frequentlyAskedQuestionsList } from "../../constants/faqs";
import { Container, Box, Typography, Grid, useTheme } from "@mui/material";
import { Bolt as BoltIcon, ShieldOutlined as ShieldIcon } from "@mui/icons-material";

function SectionHeader({ title, subtitle, eyebrow, isDark }) {
  return (
    <Box sx={{ mb: { xs: 6, md: 8 }, textAlign: "center" }}>
      {eyebrow && (
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
            {eyebrow}
          </Typography>
        </Box>
      )}

      <Typography
        variant="h1"
        sx={{
          fontFamily: "var(--font-display)",
          fontSize: { xs: "2.5rem", sm: "3.75rem", md: "4.75rem" },
          fontWeight: 500,
          lineHeight: { xs: 1.05, md: 0.98 },
          letterSpacing: { xs: "-1.5px", md: "-3.5px" },
          color: isDark ? "#ffffff" : "#090909",
          mb: 2.5,
          maxWidth: "920px",
          mx: "auto",
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          sx={{
            maxWidth: 700,
            mx: "auto",
            fontSize: { xs: "15px", sm: "17px", md: "18px" },
            lineHeight: 1.5,
            letterSpacing: "-0.18px",
            color: isDark ? "#999999" : "#71717a",
            fontWeight: 400,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

function AboutText() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 10 }, mb: { xs: 8, md: 16 } }}>
      {/* HERO SECTION */}
      <SectionHeader
        isDark={isDark}
        eyebrow="Architected for Velocity"
        title="Real-time collaboration without the overhead."
        subtitle="SyncBoard strips away sign-ups, subscriptions, and setup friction. Create a board, share the 5-character key, and work together in live sync."
      />

      {/* VALUE PROPS */}
      <Grid container spacing={3} sx={{ mb: { xs: 10, md: 14 } }}>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Spotlight Card (SaaS Ambient Blue) */}
          <Box
            sx={{
              height: "100%",
              p: { xs: 4, md: 5 },
              borderRadius: "24px",
              backgroundColor: isDark ? "#141414" : "#ffffff",
              background: isDark
                ? "radial-gradient(420px circle at 50% 0%, rgba(0, 153, 255, 0.12), transparent 70%), #141414"
                : "radial-gradient(420px circle at 50% 0%, rgba(0, 153, 255, 0.05), transparent 70%), #ffffff",
              border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
              boxShadow: isDark
                ? "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 16px 36px -12px rgba(0, 0, 0, 0.5)"
                : "0 10px 30px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "20%",
                right: "20%",
                height: "1px",
                background: isDark
                  ? "linear-gradient(90deg, transparent, rgba(0, 153, 255, 0.4), transparent)"
                  : "linear-gradient(90deg, transparent, rgba(0, 153, 255, 0.3), transparent)",
                pointerEvents: "none",
              },
              "&:hover": {
                borderColor: isDark ? "#383838" : "#d4d4d8",
                transform: "translateY(-4px)",
                boxShadow: isDark
                  ? "0 20px 40px -15px rgba(0, 153, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12)"
                  : "0 20px 40px -15px rgba(0, 153, 255, 0.12)",
              },
            }}
          >
            <Box>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: isDark ? "rgba(0, 153, 255, 0.12)" : "rgba(0, 153, 255, 0.08)",
                  border: `1px solid ${isDark ? "rgba(0, 153, 255, 0.25)" : "rgba(0, 153, 255, 0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <BoltIcon sx={{ color: "#0099ff", fontSize: 24 }} />
              </Box>

              <Typography
                sx={{
                  fontFamily: "var(--font-display)",
                  fontSize: { xs: "22px", md: "26px" },
                  fontWeight: 600,
                  letterSpacing: "-0.8px",
                  lineHeight: 1.15,
                  mb: 1.5,
                  color: isDark ? "#ffffff" : "#090909",
                }}
              >
                Built for High Speed
              </Typography>

              <Typography
                sx={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: isDark ? "#999999" : "#71717a",
                  letterSpacing: "-0.15px",
                }}
              >
                Zero-friction exchange. Whether copying code snippets during live calls or passing
                screenshots between phones and computers, changes reflect immediately without latency.
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 4,
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#0099ff",
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#0099ff" }} />
              Realtime WebSocket Broadcast
            </Typography>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          {/* Surface Card */}
          <Box
            sx={{
              height: "100%",
              p: { xs: 4, md: 5 },
              borderRadius: "24px",
              backgroundColor: isDark ? "#141414" : "#ffffff",
              border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
              boxShadow: isDark
                ? "inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                : "0 10px 30px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              "&:hover": {
                borderColor: isDark ? "#383838" : "#d4d4d8",
                transform: "translateY(-4px)",
              },
            }}
          >
            <Box>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 153, 255, 0.08)",
                  border: `1px solid ${isDark ? "#262626" : "rgba(0, 153, 255, 0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <ShieldIcon sx={{ color: "#0099ff", fontSize: 24 }} />
              </Box>

              <Typography
                sx={{
                  fontFamily: "var(--font-display)",
                  fontSize: { xs: "22px", md: "26px" },
                  fontWeight: 600,
                  letterSpacing: "-0.8px",
                  lineHeight: 1.15,
                  color: isDark ? "#ffffff" : "#090909",
                  mb: 1.5,
                }}
              >
                Anonymous & Ephemeral
              </Typography>

              <Typography
                sx={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: isDark ? "#999999" : "#71717a",
                  letterSpacing: "-0.15px",
                }}
              >
                No tracking cookies. No user accounts. No harvesting. Secure your boards with
                custom 6-digit SHA-256 PINs, or enable auto-expiration countdowns so data evaporates safely.
              </Typography>
            </Box>

            <Typography
              sx={{
                mt: 4,
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#0099ff",
              }}
            >
              Zero Database Retention
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* WORKFLOW */}
      <Box sx={{ mb: { xs: 10, md: 15 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: { xs: "28px", md: "38px" },
              fontWeight: 500,
              letterSpacing: "-1.5px",
              color: isDark ? "#ffffff" : "#090909",
              mb: 1,
            }}
          >
            The Three-Step Flow
          </Typography>
          <Typography sx={{ color: isDark ? "#999999" : "#71717a", fontSize: "15px", letterSpacing: "-0.15px" }}>
            How quick it really is to connect your devices.
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {[
            {
              step: "01",
              title: "Generate Key",
              desc: "Instant 5-letter board code created right in your browser. No forms or emails required.",
            },
            {
              step: "02",
              title: "Share Access",
              desc: "Pass the link or scan the QR code from any tablet, mobile device, or teammate workstation.",
            },
            {
              step: "03",
              title: "Stream Live",
              desc: "Edit code with syntax highlighting, drop media assets, and watch changes stream in real time.",
            },
          ].map((item) => (
            <Grid key={item.step} size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  p: { xs: 3.5, md: 4 },
                  borderRadius: "24px",
                  backgroundColor: isDark ? "#141414" : "#ffffff",
                  border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                  boxShadow: isDark
                    ? "inset 0 1px 0 rgba(255, 255, 255, 0.08)"
                    : "0 10px 30px rgba(0, 0, 0, 0.05)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "36px",
                    fontWeight: 700,
                    color: isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.12)",
                    letterSpacing: "-1px",
                    mb: 1.5,
                  }}
                >
                  {item.step}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "var(--font-display)",
                    fontSize: "19px",
                    fontWeight: 600,
                    letterSpacing: "-0.5px",
                    color: isDark ? "#ffffff" : "#090909",
                    mb: 1,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    lineHeight: 1.55,
                    color: isDark ? "#999999" : "#71717a",
                    letterSpacing: "-0.14px",
                  }}
                >
                  {item.desc}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* TEAM SECTION */}
      <Box sx={{ mb: { xs: 10, md: 16 } }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: { xs: "28px", md: "38px" },
              fontWeight: 500,
              letterSpacing: "-1.5px",
              color: isDark ? "#ffffff" : "#090909",
              mb: 1,
            }}
          >
            Crafted by Engineers
          </Typography>
          <Typography sx={{ color: isDark ? "#999999" : "#71717a", fontSize: "15px", letterSpacing: "-0.15px" }}>
            Built by developers passionate about speed, minimalism, and polished user interfaces.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {developers.map((data) => (
            <DevCard key={data.name} {...data} />
          ))}
        </Box>
      </Box>

      {/* FAQ SECTION */}
      <Box id="faqs" sx={{ maxWidth: 840, mx: "auto" }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            sx={{
              fontFamily: "var(--font-display)",
              fontSize: { xs: "28px", md: "38px" },
              fontWeight: 500,
              letterSpacing: "-1.5px",
              color: isDark ? "#ffffff" : "#090909",
              mb: 1,
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography sx={{ color: isDark ? "#999999" : "#71717a", fontSize: "15px", letterSpacing: "-0.15px" }}>
            Common questions about sessions, data encryption, and device support.
          </Typography>
        </Box>

        <Box>
          {frequentlyAskedQuestionsList.map((faq, index) => (
            <FAQsContent key={faq.question} {...faq} index={index} />
          ))}
        </Box>
      </Box>
    </Container>
  );
}

export default AboutText;