import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Container,
  Divider,
  MenuItem,
  Drawer,
  Box,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Link } from "react-router-dom";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: theme.shape.borderRadius * 2,

  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",

  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(20, 24, 31, 0.65)"
      : "rgba(255, 255, 255, 0.7)",

  border: `1px solid ${theme.palette.divider}`,
  boxShadow: theme.shadows[3],
  padding: "8px 16px",
}));

export default function Navbar({ toggleTheme, mode }) {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Explore", path: "/explore" },
    { label: "Feedback", path: "/feedback" },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "transparent",
        color: "text.primary",
        boxShadow: "none",
        top: 16,
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar disableGutters>
          {/* Left Side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "text.primary",
              }}
            >
              <Box
                component="img"
                src="/assets/pasteboard_logo.png"
                alt="SyncBoard Logo"
                sx={{
                  width: 28,
                  height: 28,
                  objectFit: "contain",
                  transition: "transform .25s ease",
                  "&:hover": {
                    transform: "rotate(-6deg) scale(1.05)",
                  },
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1,
                }}
              >
                SyncBoard
              </Typography>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  variant="text"
                  sx={{
                    color: "text.primary",
                    borderRadius: 999,
                    px: 2,
                    transition: "all .2s ease",
                    "&:hover": {
                      backgroundColor:
                        mode === "dark"
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                    },
                  }}
                  size="small"
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Desktop Right */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={toggleTheme}
              sx={{ color: "text.primary" }}
            >
              {mode === "dark" ? (
                <DarkModeIcon />
              ) : (
                <LightModeIcon />
              )}
            </IconButton>
          </Box>

          {/* Mobile */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton
              onClick={toggleTheme}
              sx={{ color: "text.primary" }}
            >
              {mode === "dark" ? (
                <DarkModeIcon />
              ) : (
                <LightModeIcon />
              )}
            </IconButton>

            <IconButton
              onClick={toggleDrawer(true)}
              sx={{ color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  width: 260,
                  backdropFilter: "blur(20px)",
                  backgroundColor:
                    mode === "dark"
                      ? "rgba(20, 24, 31, 0.95)"
                      : "rgba(255,255,255,0.95)",
                },
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Header */}
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      component="img"
                      src="/assets/pasteboard_logo.png"
                      sx={{ width: 24 }}
                    />
                    <Typography fontWeight={600}>SyncBoard</Typography>
                  </Box>

                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <Divider />

                {/* Navigation */}
                <Box sx={{ px: 1, py: 2, flex: 1 }}>
                  {navItems.map((item) => (
                    <MenuItem
                      key={item.label}
                      component={Link}
                      to={item.path}
                      onClick={toggleDrawer(false)}
                      sx={{
                        mb: 0.5,
                        py: 1.2,
                        fontWeight: 500,
                        transition: "0.2s",
                        "&:hover": {
                          backgroundColor:
                            mode === "dark"
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  ))}
                </Box>

                <Divider />

                {/* Bottom Section */}
                <Box sx={{ p: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
                    onClick={toggleTheme}
                    sx={{ borderRadius: 999 }}
                  >
                    Toggle Theme
                  </Button>
                </Box>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
