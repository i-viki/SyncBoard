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
} from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LaunchIcon from "@mui/icons-material/Launch";
export default function DevCard({
  name,
  link,
  login,
  portfolio,
  badge,
}) {
  return (
    <Card
      sx={(theme) => ({
        width: 360,
        borderRadius: 3,
        transition: "all .3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        "&:hover": {
          border: `1px solid ${theme.palette.primary.main}`,
          boxShadow: theme.shadows[4],
        },
      })}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={`/assets/avatar-${login}.webp`}
            alt={name}
            sx={{
              width: 70,
              height: 70,
              border: "2px solid",
              borderColor: "primary.main",
            }}
          />

          <Box sx={{ flex: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mb: 0.5 }}
            >
              <Typography variant="h6" fontWeight={600}>
                {name}
              </Typography>

              <Chip
                label={badge}
                size="small"
                sx={{
                  fontSize: 11,
                  height: 22,
                  borderRadius: 999,
                  color: "#000",
                  background: "linear-gradient(90deg,#FFD700,#FFA500)",
                }}
              />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              @{login}
            </Typography>
          </Box>
        </Stack>
      </CardContent>

      <CardActions
        sx={{
          px: 2,
          pb: 2,
          justifyContent: "flex-start",
        }}
      >
        <Stack direction="row" spacing={1}>
          <Chip
            icon={<LinkedInIcon sx={{ fontSize: 18 }} />}
            label="LinkedIn"
            component="a"
            href={link}
            target="_blank"
            clickable
            variant="outlined"
            sx={{
              height: 28,
              borderRadius: 2,
              fontWeight: 500,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          />

          <Chip
            icon={<LaunchIcon sx={{ fontSize: 18 }} />}
            label="Portfolio"
            component="a"
            href={portfolio}
            target="_blank"
            clickable
            color="primary"
            sx={{
              height: 26,
              borderRadius: 2,
              fontWeight: 500,
            }}
          />
        </Stack>
      </CardActions>
    </Card>
  );
}