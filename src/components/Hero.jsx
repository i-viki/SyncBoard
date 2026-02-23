import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clickLogging, clipboardLogging } from "../scripts/analyticsLogging";
import Footer from "./Footer";
import FAQsIcon from "./FAQsIcon";

import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  Stack,
} from "@mui/material";

function Hero() {
  const navigate = useNavigate();
  const [joiningCode, setJoiningCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const JOINING_CODE_LENGTH = 5;

  const generateJoiningCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let createdCode = "";

    for (let i = 0; i < JOINING_CODE_LENGTH; i++) {
      createdCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    setJoiningCode("");
    clipboardLogging(createdCode, true);
    navigate(`/${createdCode}`);
  };

  const validateJoiningCode = () => {
    const regExp = /^[a-zA-Z0-9]+$/;
    const valid =
      joiningCode.length === JOINING_CODE_LENGTH &&
      regExp.test(joiningCode);

    if (valid) {
      setCodeError(false);
      clipboardLogging(joiningCode, false);
      navigate(`/${joiningCode}`);
    } else {
      setCodeError(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 10 }}>
      {/* Header */}
      <Box textAlign="center" mb={8}>
        <img
          src="./assets/clipboard.webp"
          alt="Clipboard Logo"
          style={{ width: 110, marginBottom: 20 }}
        />

        <Typography variant="h3" fontWeight={700} gutterBottom>
          SyncBoard
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: "auto" }}
        >
          Instantly join a board with a unique key. Share text and images in real time.
          No setup. No friction. Just collaboration.
        </Typography>
      </Box>

      {/* Main Panel */}
      <Paper
        elevation={0}
        sx={(theme) => ({
          p: 6,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        })}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", md: "block" } }}
            />
          }
          spacing={6}
          alignItems="center"
          justifyContent="space-between"
        >
          {/* LEFT — CREATE */}
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Create a New Board
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Generate a unique board instantly and start collaborating.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={generateJoiningCode}
              sx={{
                px: 4,
                borderRadius: 999,
              }}
            >
              Create Board
            </Button>
          </Box>

          {/* RIGHT — JOIN */}
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              gutterBottom
              color={codeError ? "error" : "text.primary"}
            >
              {codeError
                ? "Invalid Board ID"
                : "Join Existing Board"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Enter the 5-character board ID to join instantly.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
            >
              <TextField
                label="Board ID"
                variant="outlined"
                size="medium"
                value={joiningCode}
                error={codeError}
                inputProps={{ maxLength: 5 }}
                onChange={(e) => {
                  setJoiningCode(e.target.value);
                  setCodeError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") validateJoiningCode();
                }}
                sx={{ flex: 1 }}
              />

              <Button
                variant="outlined"
                size="large"
                onClick={validateJoiningCode}
                sx={{ borderRadius: 999 }}
              >
                Join
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      <FAQsIcon />
    </Container>
  );
}

export default Hero;