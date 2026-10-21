import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button, Paper, Typography, Stack, Box, useTheme } from "@mui/material";
import { SystemUpdate as SystemUpdateIcon } from "@mui/icons-material";

function UpdateAvailableServiceWorker() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const registerSW = useRegisterSW({
    onRegistered() {
      console.log("SW Registered");
    },
    onRegisterError(error) {
      console.error("SW registration error", error);
    },
  });

  const offlineReadyState = (registerSW && registerSW.offlineReady) ? registerSW.offlineReady : [false, () => {}];
  const needUpdateState = (registerSW && registerSW.needUpdate) ? registerSW.needUpdate : [false, () => {}];

  const [offlineReady, setOfflineReady] = offlineReadyState;
  const [needUpdate, setNeedUpdate] = needUpdateState;
  const updateServiceWorker = registerSW ? registerSW.updateServiceWorker : () => {};

  const close = () => {
    if (typeof setOfflineReady === "function") setOfflineReady(false);
    if (typeof setNeedUpdate === "function") setNeedUpdate(false);
  };

  if (!offlineReady && !needUpdate) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        maxWidth: 360,
        width: "calc(100% - 48px)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          backgroundColor: isDark ? "#141414" : "#ffffff",
          border: `1px solid ${isDark ? "#262626" : "#e4e4e7"}`,
          color: isDark ? "#ffffff" : "#090909",
          borderRadius: "20px",
          boxShadow: isDark
            ? "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 40px rgba(0, 0, 0, 0.6)"
            : "0 20px 40px rgba(0, 0, 0, 0.12)",
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "rgba(0, 153, 255, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SystemUpdateIcon sx={{ color: "#0099ff", fontSize: 18 }} />
            </Box>
            <Typography
              sx={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "14px",
                letterSpacing: "-0.2px",
                color: isDark ? "#ffffff" : "#090909",
              }}
            >
              {offlineReady ? "App Cached for Offline Use" : "New SyncBoard Release Available"}
            </Typography>
          </Stack>

          <Typography sx={{ fontSize: "13px", color: isDark ? "#999999" : "#71717a", lineHeight: 1.45 }}>
            {offlineReady
              ? "SyncBoard is now cached and ready to launch without an internet connection."
              : "A new version with performance and design improvements is ready."}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end", pt: 0.5 }}>
            <Button
              onClick={close}
              size="small"
              sx={{
                color: isDark ? "#999999" : "#71717a",
                borderRadius: "100px",
                px: 2,
                "&:hover": {
                  color: isDark ? "#ffffff" : "#090909",
                  backgroundColor: isDark ? "#1c1c1c" : "#f4f4f5",
                },
              }}
            >
              Dismiss
            </Button>
            {needUpdate && (
              <Button
                variant="contained"
                size="small"
                onClick={() => updateServiceWorker(true)}
                sx={{
                  borderRadius: "100px",
                  px: 2.5,
                  py: 0.75,
                  fontWeight: 600,
                  fontSize: "13px",
                  backgroundColor: isDark ? "#ffffff" : "#090909",
                  color: isDark ? "#000000" : "#ffffff",
                  "&:hover": {
                    backgroundColor: isDark ? "#ececec" : "#222222",
                  },
                }}
              >
                Update Now
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}

export default UpdateAvailableServiceWorker;