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
} from "@mui/material";

const USER_UUID = userIdentifier();

export default function FeedbackForm() {
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
      await fetch(import.meta.env.VITE_APP_SHEET_URL, {
        method: "POST",
        body: formData,
      });
    } catch { }
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

        const getData =
          JSON.parse(localStorage.getItem("feedback")) || {};
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
      elevation={4}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: 520,
      }}
    >
      {/* LEFT SIDE */}
      <Box
        sx={{
          flex: 1,
          p: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 3,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          We value your feedback
        </Typography>

        <Typography sx={{ opacity: 0.9 }}>
          Help us improve your experience. Your feedback helps us build
          better collaboration tools and features that truly matter to you.
        </Typography>

        <Box
          component="img"
          src="/assets/feedbackAvatar.png"
          alt="feedback"
          sx={{
            width: "100%",
            maxWidth: 320,
            alignSelf: "center",
            mt: 2,
          }}
        />
      </Box>

      {/* RIGHT SIDE */}
      <Box
        sx={{
          flex: 1.3,
          p: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Fade in={!isSubmitted}>
          <Box>
            {!isSubmitted && (
              <>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Share Your Experience
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Takes less than a minute.
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
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...register("firstName")}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...register("lastName")}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />

                  <TextField
                    fullWidth
                    label="Your Message"
                    multiline
                    rows={4}
                    {...register("message")}
                    error={!!errors.message}
                    helperText={errors.message?.message}
                  />

                  <Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      How was your experience?
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Box
                          key={value}
                          onClick={() => setRating(value)}
                          sx={{
                            cursor: "pointer",
                            px: 2,
                            py: 1.2,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor:
                              rating === value
                                ? "primary.main"
                                : "divider",
                            bgcolor:
                              rating === value
                                ? "primary.main"
                                : "transparent",
                            color:
                              rating === value
                                ? "white"
                                : "text.primary",
                            transition: "0.2s",
                            minWidth: 50,
                            textAlign: "center",
                          }}
                        >
                          {value}
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loader}
                  >
                    {loader ? (
                      <CircularProgress
                        size={22}
                        color="inherit"
                      />
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
            <Box textAlign="center">
              <Typography variant="h4" fontWeight={700} gutterBottom>
                🎉 Thank You!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Your feedback has been successfully submitted.
              </Typography>

              <Button
                variant="outlined"
                onClick={() => setIsSubmitted(false)}
              >
                Send Another Feedback
              </Button>
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );
}