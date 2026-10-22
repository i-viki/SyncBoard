import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { clickLogging } from "../../services/analyticsService";
import { userIdentifier } from "../../utils/userIdentifier";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Stack,
  Fade,
  useTheme,
} from "@mui/material";
import { Sparkles, CheckCircle2 } from "lucide-react";

const USER_UUID = userIdentifier();

export default function FeedbackForm() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const schema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    message: yup.string().required("Please share your feedback"),
  });

  const requestActive = useRef(false);
  const [loader, setLoader] = useState(false);
  const [rating, setRating] = useState(5);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const submitFeedbackFormToSheet = async (data) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentTime = new Date().toISOString();
    const userAgent = navigator?.userAgent || "NA";
    const language = navigator?.language || "NA";

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("message", data.message);
    formData.append("rating", rating);
    formData.append("timezone", timezone);
    formData.append("currentTime", currentTime);
    formData.append("userId", USER_UUID);
    formData.append("userAgent", userAgent);
    formData.append("language", language);

    try {
      if (import.meta.env.VITE_APP_SHEET_URL) {
        await fetch(import.meta.env.VITE_APP_SHEET_URL, {
          method: "POST",
          body: formData,
        });
      }
    } catch (e) {
      // Optional logging failure is safely ignored
    }
  };

  const sendEmail = (data) => {
    if (!rating) return;
    if (requestActive.current) return;

    requestActive.current = true;
    setLoader(true);
    clickLogging("User Feedback Submitted");

    submitFeedbackFormToSheet(data);

    const secret = {
      service: import.meta.env.VITE_APP_EMAILJSSERVICE_KEY,
      template: import.meta.env.VITE_APP_EMAILJSTEMPLATE_KEY,
      key: import.meta.env.VITE_APP_EMAILJSAPIKEY,
    };

    emailjs
      .send(
        secret.service,
        secret.template,
        {
          ...data,
          rating,
          user: USER_UUID,
        },
        { publicKey: secret.key }
      )
      .then(() => {
        setLoader(false);
        requestActive.current = false;

        reset();
        setRating(5);
        setIsSubmitted(true);

        const getData = JSON.parse(localStorage.getItem("feedback")) || {};
        localStorage.setItem(
          "feedback",
          JSON.stringify({
            ...getData,
            hasSubmittedFeedbackResponse: true,
          })
        );
        setTimeout(() => {
          setIsSubmitted(false);
        }, 6000);
      })
      .catch(() => {
        setLoader(false);
        requestActive.current = false;
      });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "28px",
        overflow: "hidden",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: 520,
        backgroundColor: isDark ? "#141414" : "#ffffff",
        border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
        boxShadow: isDark
          ? "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 24px 60px rgba(0, 0, 0, 0.5)"
          : "0 24px 60px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* LEFT SIDE: SaaS Spotlight Panel */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 4, md: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: isDark
            ? "radial-gradient(420px circle at 0% 0%, rgba(0, 153, 255, 0.14), transparent 70%), #141414"
            : "radial-gradient(420px circle at 0% 0%, rgba(0, 153, 255, 0.08), transparent 70%), #fafafa",
          color: isDark ? "#ffffff" : "#090909",
          borderRight: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: "100px",
              backgroundColor: isDark ? "rgba(0, 153, 255, 0.12)" : "rgba(0, 153, 255, 0.08)",
              border: `1px solid ${isDark ? "rgba(0, 153, 255, 0.25)" : "rgba(0, 153, 255, 0.2)"}`,
              mb: 3,
            }}
          >
            <Sparkles size={14} color="#0099ff" />
            <Typography sx={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#0099ff" }}>
              Community Driven
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              fontSize: { xs: "24px", md: "30px" },
              letterSpacing: "-1px",
              lineHeight: 1.15,
              mb: 2,
              color: isDark ? "#ffffff" : "#090909",
            }}
          >
            We build SyncBoard with your voice.
          </Typography>

          <Typography
            sx={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: isDark ? "#999999" : "#71717a",
              letterSpacing: "-0.14px",
            }}
          >
            Have ideas for new syntax languages, shortcut keys, or file formats?
            Every submission helps us prioritize our next release.
          </Typography>
        </Box>

        <Box
          component="img"
          src="/assets/feedbackAvatar.png"
          alt="Feedback avatar"
          sx={{
            width: "100%",
            maxWidth: 240,
            alignSelf: "center",
            my: 2,
            opacity: 0.95,
          }}
        />

        <Typography
          sx={{
            fontSize: "12px",
            color: isDark ? "#666666" : "#a1a1aa",
            letterSpacing: "-0.12px",
          }}
        >
          Encrypted transmission directly to core maintainers.
        </Typography>
      </Box>

      {/* RIGHT SIDE: The Form */}
      <Box
        sx={{
          flex: 1.3,
          p: { xs: 3.5, md: 5 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: isDark ? "#141414" : "#ffffff",
        }}
      >
        <Fade in={!isSubmitted}>
          <Box>
            {!isSubmitted && (
              <>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "20px", md: "24px" },
                    letterSpacing: "-0.6px",
                    color: isDark ? "#ffffff" : "#090909",
                    mb: 0.5,
                  }}
                >
                  Share Your Thoughts
                </Typography>

                <Typography
                  sx={{
                    color: isDark ? "#999999" : "#71717a",
                    fontSize: "14px",
                    letterSpacing: "-0.14px",
                    mb: 3,
                  }}
                >
                  Takes less than 60 seconds.
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit(sendEmail)}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...register("firstName")}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
                        },
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...register("lastName")}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
                        },
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Email Address"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Your Message"
                    multiline
                    rows={4}
                    {...register("message")}
                    error={!!errors.message}
                    helperText={errors.message?.message}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
                      },
                    }}
                  />

                  {/* Rating selector */}
                  <Box sx={{ my: 0.5 }}>
                    <Typography
                      sx={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: isDark ? "#999999" : "#71717a",
                        mb: 1,
                      }}
                    >
                      Overall Experience Rating:
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      {[1, 2, 3, 4, 5].map((value) => {
                        const isSelected = rating === value;
                        return (
                          <Box
                            key={value}
                            onClick={() => setRating(value)}
                            sx={{
                              cursor: "pointer",
                              px: 2,
                              py: 1,
                              borderRadius: "100px",
                              border: `1px solid ${
                                isSelected
                                  ? (isDark ? "#ffffff" : "#090909")
                                  : (isDark ? "#262626" : "#e4e4e7")
                              }`,
                              backgroundColor: isSelected
                                ? (isDark ? "#ffffff" : "#090909")
                                : (isDark ? "#1c1c1c" : "#f4f4f5"),
                              color: isSelected
                                ? (isDark ? "#000000" : "#ffffff")
                                : (isDark ? "#999999" : "#71717a"),
                              fontWeight: 600,
                              fontSize: "14px",
                              fontFamily: "var(--font-mono)",
                              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                              minWidth: 44,
                              textAlign: "center",
                              "&:hover": {
                                color: isSelected
                                  ? (isDark ? "#000000" : "#ffffff")
                                  : (isDark ? "#ffffff" : "#090909"),
                                borderColor: isSelected
                                  ? (isDark ? "#ffffff" : "#090909")
                                  : (isDark ? "#3a3a3a" : "#a1a1aa"),
                              },
                            }}
                          >
                            {value}★
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loader}
                    sx={{
                      mt: 1,
                      py: 1.4,
                      borderRadius: "100px",
                      fontSize: "14px",
                      fontWeight: 600,
                      letterSpacing: "-0.14px",
                      backgroundColor: isDark ? "#ffffff" : "#090909",
                      color: isDark ? "#000000" : "#ffffff",
                      "&:hover": {
                        backgroundColor: isDark ? "#ececec" : "#222222",
                      },
                    }}
                  >
                    {loader ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Submit Feedback"
                    )}
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Fade>

        {/* SUCCESS STATE */}
        {isSubmitted && (
          <Fade in={isSubmitted}>
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  backgroundColor: "rgba(34, 197, 94, 0.12)",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2.5,
                }}
              >
                <CheckCircle2 size={28} color="#22c55e" />
              </Box>

              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: 600,
                  letterSpacing: "-0.6px",
                  color: isDark ? "#ffffff" : "#090909",
                  mb: 1,
                }}
              >
                Thank You!
              </Typography>
              <Typography
                sx={{
                  color: isDark ? "#999999" : "#71717a",
                  fontSize: "14px",
                  letterSpacing: "-0.14px",
                  maxWidth: 320,
                  mx: "auto",
                  mb: 3,
                }}
              >
                Your feedback has been delivered directly to the engineering team.
              </Typography>

              <Button
                variant="outlined"
                onClick={() => setIsSubmitted(false)}
                sx={{
                  borderRadius: "100px",
                  px: 3,
                  borderColor: isDark ? "#262626" : "#e4e4e7",
                  color: isDark ? "#ffffff" : "#090909",
                }}
              >
                Send Another Response
              </Button>
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );
}