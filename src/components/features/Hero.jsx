import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { clickLogging, clipboardLogging } from "../../services/analyticsService";
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
    <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 10 }, mb: { xs: 6, md: 10 } }}>
      {/* Header */}
      <Box textAlign="center" mb={{ xs: 4, md: 8 }}>
        <img
          src="./assets/icon.png"
          alt="Clipboard Logo"
          style={{
            width: 110 ,
            marginBottom: 20,
          }}
        />

        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          sx={{ fontSize: "4rem" }}
        >
          SyncBoard
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            maxWidth: { xs: 400, sm: 500, md: 700 },
            mx: "auto",
            fontSize: { xs: "1rem", sm: "1rem", md: "1.125rem" },
          }}
        >
          Instantly join a board with a unique key. Share text and images in real time.
          No setup. No friction. Just collaboration.
        </Typography>
      </Box>

      {/* Main Panel */}
      <Paper
        elevation={0}
        sx={(theme) => ({
          p: { xs: 3, sm: 4, md: 6 },
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
          spacing={{ xs: 4, md: 6 }}
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
            <Typography
              variant="h5"
              fontWeight={600}
              gutterBottom
              sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
            >
              Create a New Board
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 3,
                fontSize: { xs: "0.85rem", md: "1rem" },
              }}
            >
              Generate a unique board instantly and start collaborating.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={generateJoiningCode}
              sx={{
                px: { xs: 3, sm: 4 },
                py: 1.5,
                borderRadius: 999,
                width: { xs: "100%", sm: "auto" },
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
              width: "100%",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              gutterBottom
              color={codeError ? "error" : "text.primary"}
              sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
            >
              {codeError ? "Invalid Board ID" : "Join Existing Board"}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, fontSize: { xs: "0.85rem", md: "1rem" } }}
            >
              Enter the 5-character board ID to join instantly.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%" }}
            >
              <TextField
                aria-label="Board ID"
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
                sx={{ flex: 1, width: { xs: "100%", sm: "auto" } }}
              />

              <Button
                aria-label="Join Board"
                variant="outlined"
                size="large"
                onClick={validateJoiningCode}
                sx={{
                  borderRadius: 999,
                  width: { xs: "100%", sm: "auto" },
                }}
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