import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  Divider,
} from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={(theme) => ({
        py: 0.5,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.02)"
            : "rgba(0,0,0,0.02)",
      })}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          textAlign={{ xs: "center", md: "left" }}
        >
          <Typography variant="body2" color="text.secondary">
            © SyncBoard {new Date().getFullYear()} · All Rights Reserved
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
          >
            <Link
              component={RouterLink}
              to="/feedback"
              underline="hover"
              color="text.secondary"
            >
              Contact
            </Link>

            <Link
              component={RouterLink}
              to="/privacy-policy"
              underline="hover"
              color="text.secondary"
            >
              Privacy
            </Link>

            <Link
              component={RouterLink}
              to="/terms-conditions"
              underline="hover"
              color="text.secondary"
            >
              Terms
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;