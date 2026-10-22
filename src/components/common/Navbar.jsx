import * as React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Divider,
  Drawer,
  Box,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  CloseRounded as CloseRoundedIcon,
  DarkModeOutlined as DarkModeIcon,
  LightModeOutlined as LightModeIcon,
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ toggleTheme, mode }) {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const isDark = mode === "dark";

  const toggleDrawer = (state) => setOpen(state);

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
        top: 0,
        zIndex: 1100,
        backgroundColor: isDark ? "rgba(9, 9, 9, 0.85)" : "rgba(250, 250, 250, 0.85)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        borderBottom: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
        boxShadow: "none",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            height: 56,
            minHeight: "56px !important",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Brand Wordmark & Icon */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              textDecoration: "none",
              color: isDark ? "#ffffff" : "#090909",
              transition: "opacity 0.15s ease",
              "&:hover": { opacity: 0.8 },
            }}
          >
            <Box
              component="img"
              src="/assets/pasteboard_logo.png"
              alt="SyncBoard Logo"
              sx={{
                width: 22,
                height: 22,
                objectFit: "contain",
              }}
            />
            <Typography
              sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "15px",
                letterSpacing: "-0.035em",
                color: isDark ? "#ffffff" : "#090909",
              }}
            >
              SyncBoard
            </Typography>
          </Box>

          {/* Desktop Framer Navigation Links */}
          <Box
            component="nav"
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 4,
            }}
          >
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Box
                  key={item.label}
                  component={Link}
                  to={item.path}
                  sx={{
                    position: "relative",
                    fontSize: "14px",
                    fontWeight: 500,
                    letterSpacing: "-0.14px",
                    color: isActive
                      ? (isDark ? "#ffffff" : "#090909")
                      : (isDark ? "#999999" : "#71717a"),
                    textDecoration: "none",
                    py: 2,
                    transition: "color 0.15s ease",
                    "&:hover": {
                      color: isDark ? "#ffffff" : "#090909",
                    },
                    "&::after": isActive
                      ? {
                          content: '""',
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: "2px",
                          backgroundColor: isDark ? "#ffffff" : "#090909",
                          borderRadius: "1px",
                        }
                      : {},
                  }}
                >
                  {item.label}
                </Box>
              );
            })}
          </Box>

          {/* Right Action Suite: Theme Toggle & Launch CTA */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5 }}>
            {/* Theme Toggle Button */}
            <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
              <IconButton
                onClick={toggleTheme}
                size="small"
                aria-label="Toggle theme"
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  color: isDark ? "#999999" : "#71717a",
                  transition: "color 0.15s ease, background-color 0.15s ease",
                  "&:hover": {
                    color: isDark ? "#ffffff" : "#090909",
                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                {isDark ? (
                  <LightModeIcon sx={{ fontSize: 18 }} />
                ) : (
                  <DarkModeIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </Tooltip>

            {/* Launch Board Primary CTA Pill */}
            <Button
              component={Link}
              to="/explore"
              variant="contained"
              size="small"
              sx={{
                borderRadius: "100px",
                px: 2,
                py: 0.65,
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "-0.13px",
                backgroundColor: isDark ? "#ffffff" : "#090909",
                color: isDark ? "#000000" : "#ffffff",
                boxShadow: "none",
                transition: "background-color 0.15s ease, transform 0.1s ease",
                "&:hover": {
                  backgroundColor: isDark ? "#ececec" : "#222222",
                  boxShadow: "none",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              Get Started
            </Button>
          </Box>

          {/* Mobile hamburger & Theme Toggle */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 0.5 }}>
            <IconButton
              onClick={toggleTheme}
              size="small"
              aria-label="Toggle theme"
              sx={{
                width: 34,
                height: 34,
                color: isDark ? "#999999" : "#71717a",
                "&:hover": { color: isDark ? "#ffffff" : "#090909" },
              }}
            >
              {isDark ? <LightModeIcon sx={{ fontSize: 18 }} /> : <DarkModeIcon sx={{ fontSize: 18 }} />}
            </IconButton>

            <IconButton
              onClick={() => toggleDrawer(true)}
              size="small"
              aria-label="Open menu"
              sx={{
                width: 34,
                height: 34,
                color: isDark ? "#ffffff" : "#090909",
              }}
            >
              <MenuIcon sx={{ fontSize: 20 }} />
            </IconButton>

            {/* Mobile Drawer */}
            <Drawer
              anchor="right"
              open={open}
              onClose={() => toggleDrawer(false)}
              slotProps={{
                paper: {
                  sx: {
                    width: 280,
                    backdropFilter: "blur(20px)",
                    backgroundColor: isDark ? "rgba(9, 9, 9, 0.96)" : "rgba(255, 255, 255, 0.98)",
                    borderLeft: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
                    p: 2.5,
                  },
                },
              }}
            >
              <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box component="img" src="/assets/pasteboard_logo.png" sx={{ width: 20, height: 20 }} />
                    <Typography
                      sx={{
                        fontFamily: "var(--font-display)",
                        fontWeight: 600,
                        fontSize: "15px",
                        letterSpacing: "-0.03em",
                        color: isDark ? "#ffffff" : "#090909",
                      }}
                    >
                      SyncBoard
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => toggleDrawer(false)}
                    size="small"
                    sx={{ color: isDark ? "#999999" : "#71717a" }}
                  >
                    <CloseRoundedIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 2, borderColor: isDark ? "#1a1a1a" : "#e4e4e7" }} />

                <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                  {navItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                      <Box
                        key={item.label}
                        component={Link}
                        to={item.path}
                        onClick={() => toggleDrawer(false)}
                        sx={{
                          py: 1.2,
                          px: 2,
                          borderRadius: "8px",
                          color: isActive
                            ? (isDark ? "#ffffff" : "#090909")
                            : (isDark ? "#999999" : "#71717a"),
                          backgroundColor: isActive
                            ? (isDark ? "#141414" : "#f4f4f5")
                            : "transparent",
                          fontWeight: isActive ? 600 : 500,
                          fontSize: "14px",
                          letterSpacing: "-0.14px",
                          textDecoration: "none",
                          display: "block",
                          transition: "all 0.15s ease",
                          "&:hover": {
                            backgroundColor: isDark ? "#141414" : "#f4f4f5",
                            color: isDark ? "#ffffff" : "#090909",
                          },
                        }}
                      >
                        {item.label}
                      </Box>
                    );
                  })}
                </Box>

                <Divider sx={{ my: 2, borderColor: isDark ? "#1a1a1a" : "#e4e4e7" }} />

                <Button
                  component={Link}
                  to="/explore"
                  variant="contained"
                  onClick={() => toggleDrawer(false)}
                  fullWidth
                  sx={{
                    mb: 1.5,
                    backgroundColor: isDark ? "#ffffff" : "#090909",
                    color: isDark ? "#000000" : "#ffffff",
                    borderRadius: "100px",
                    py: 1,
                    fontSize: "13px",
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: isDark ? "#ececec" : "#222222",
                      boxShadow: "none",
                    },
                  }}
                >
                  Get Started
                </Button>

                <Button
                  variant="outlined"
                  onClick={toggleTheme}
                  fullWidth
                  startIcon={isDark ? <LightModeIcon sx={{ fontSize: 16 }} /> : <DarkModeIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderRadius: "100px",
                    borderColor: isDark ? "#262626" : "#e4e4e7",
                    color: isDark ? "#ffffff" : "#090909",
                    py: 0.9,
                    fontSize: "13px",
                    fontWeight: 500,
                  }}
                >
                  {isDark ? "Light Mode" : "Dark Mode"}
                </Button>
              </Box>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}