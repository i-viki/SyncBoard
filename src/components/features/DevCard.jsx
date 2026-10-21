import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Avatar,
  Stack,
  Chip,
  useTheme,
} from "@mui/material";
import { LinkedIn as LinkedInIcon, Launch as LaunchIcon } from "@mui/icons-material";

export default function DevCard({
  name,
  link,
  login,
  portfolio,
  badge,
  avatar,
  description,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Card
      elevation={0}
      sx={{
        width: 360,
        borderRadius: "24px", // Framer rounded.xl
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: isDark ? "#141414" : "#ffffff",
        border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
        boxShadow: isDark
          ? "inset 0 1px 0 rgba(255, 255, 255, 0.08)"
          : "0 10px 30px rgba(0, 0, 0, 0.05)",
        p: 1.5,
        "&:hover": {
          borderColor: isDark ? "#383838" : "#d4d4d8",
          transform: "translateY(-4px)",
          boxShadow: isDark
            ? "inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 20px 40px rgba(0, 0, 0, 0.4)"
            : "0 20px 40px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={avatar || `/assets/avatar-${login}.webp`}
            alt={name}
            sx={{
              width: 64,
              height: 64,
              border: `1.5px solid ${isDark ? "#262626" : "#e4e4e7"}`,
              backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
            }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 0.5 }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "17px",
                  letterSpacing: "-0.4px",
                  color: isDark ? "#ffffff" : "#090909",
                }}
              >
                {name}
              </Typography>

              {badge && (
                <Chip
                  label={badge}
                  size="small"
                  sx={{
                    fontSize: 10,
                    height: 20,
                    borderRadius: "100px",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    backgroundColor: isDark ? "#1c1c1c" : "rgba(0, 153, 255, 0.08)",
                    border: `1px solid ${isDark ? "#262626" : "rgba(0, 153, 255, 0.2)"}`,
                    color: "#0099ff", // Framer accent blue
                  }}
                />
              )}
            </Stack>

            <Typography
              variant="body2"
              sx={{
                color: isDark ? "#999999" : "#71717a",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
              }}
            >
              @{login}
            </Typography>
            {description && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 0.75,
                  lineHeight: 1.4,
                  color: isDark ? "#999999" : "#71717a",
                }}
              >
                {description}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>

      <CardActions
        sx={{
          px: 2,
          pb: 1.5,
          pt: 0,
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ width: "100%" }}>
          {portfolio && (
            <Button
              component="a"
              href={portfolio}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="small"
              endIcon={<LaunchIcon sx={{ fontSize: "14px !important" }} />}
              sx={{
                flex: 1,
                borderRadius: "100px",
                py: 0.75,
                fontSize: "13px",
                fontWeight: 600,
                backgroundColor: isDark ? "#ffffff" : "#090909",
                color: isDark ? "#000000" : "#ffffff",
                "&:hover": {
                  backgroundColor: isDark ? "#ececec" : "#222222",
                },
              }}
            >
              Portfolio
            </Button>
          )}

          {link && (
            <Button
              component="a"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<LinkedInIcon sx={{ fontSize: "16px !important" }} />}
              sx={{
                flex: 1,
                borderRadius: "100px",
                py: 0.75,
                fontSize: "13px",
                fontWeight: 500,
                color: isDark ? "#ffffff" : "#090909",
                borderColor: isDark ? "#262626" : "#e4e4e7",
                backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
                "&:hover": {
                  borderColor: isDark ? "#383838" : "#d4d4d8",
                  backgroundColor: isDark ? "#222222" : "#eaeaea",
                },
              }}
            >
              LinkedIn
            </Button>
          )}
        </Stack>
      </CardActions>
    </Card>
  );
}