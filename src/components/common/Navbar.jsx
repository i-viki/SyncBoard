import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Divider,
  MenuItem,
  Drawer,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  CloseRounded as CloseRoundedIcon, 
  DarkMode as DarkModeIcon, 
  LightMode as LightModeIcon 
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";


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
  const location = useLocation();
  const currentPath = location.pathname;

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
      sx={{ bgcolor: "transparent", color: "text.primary", boxShadow: "none", top: 16 }}
    >
      <Container maxWidth="lg">
        <StyledToolbar disableGutters>
          {/* Left side */}
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
                  "&:hover": { transform: "rotate(-6deg) scale(1.05)" },
                }}
              />
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                lineHeight: 1,
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #fff 0%, #94a3b8 100%)"
                    : "linear-gradient(135deg, #0f172a 0%, #475569 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                SyncBoard
              </Typography>
            </Box>

            {/* Desktop nav */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                position: "relative",
              }}
            >
              {navItems.map((item, index) => {
                const isActive = currentPath === item.path;
                return (
                  <Box key={item.label} sx={{ position: "relative" }}>
                    <Button
                      component={Link}
                      to={item.path}
                      sx={{
                        color: isActive ? "primary.main" : "text.primary",
                        fontWeight: isActive ? 600 : 500,
                        borderRadius: 999,
                        px: 2,
                        py: 1,
                        transition: "color 0.3s",
                        backgroundColor: "transparent",
                        // transition: "all .2s ease",
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
                    {/* Sliding highlight
                    {isActive && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: "10%",
                          width: "80%",
                          height: 3,
                          bgcolor: "primary.main",
                          borderRadius: 2,
                          transition: "all 0.3s ease",
                        }}
                      />
                    )} */}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Desktop right theme toggle */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            <IconButton onClick={toggleTheme} sx={{ color: "text.primary" }}>
              {mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Box>

          {/* Mobile section */}
          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <IconButton onClick={toggleTheme} sx={{ color: "text.primary" }}>
              {mode === "dark" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <IconButton onClick={() => toggleDrawer(true)} sx={{ color: "text.primary" }}>
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={open}
              onClose={() => toggleDrawer(false)}
              slotProps={{
                paper: {
                  sx: {
                    width: 260,
                    backdropFilter: "blur(20px)",
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(20, 24, 31, 0.95)"
                        : "rgba(255,255,255,0.95)",
                  },
                },
              }}
            >
              <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Box
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box component="img" src="/assets/pasteboard_logo.png" sx={{ width: 24 }} />
                    <Typography sx={{ 
                      fontWeight: 700,
                      background: (theme) =>
                        theme.palette.mode === "dark"
                          ? "linear-gradient(135deg, #fff 0%, #94a3b8 100%)"
                          : "linear-gradient(135deg, #0f172a 0%, #475569 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>SyncBoard</Typography>
                  </Box>
                  <IconButton onClick={() => toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <Divider />

                <Box sx={{ px: 1, py: 2, flex: 1 }}>
                  {navItems.map((item) => {
                    const isActive = currentPath === item.path;
                    return (
                      <MenuItem
                        key={item.label}
                        component={Link}
                        to={item.path}
                        onClick={() => toggleDrawer(false)}
                        sx={{
                          mb: 0.5,
                          py: 1.2,
                          color: isActive ? "primary.main" : "text.primary",
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
                    );
                  })}
                </Box>

                <Divider />
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