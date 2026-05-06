import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button, Paper, Typography, Stack, Box } from "@mui/material";
import { SystemUpdate as SystemUpdateIcon } from "@mui/icons-material";

function UpdateAvailableServiceWorker() {
  const registerSW = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered");
    },
    onRegisterError(error) {
      console.error("SW registration error", error);
    },
  });

  // Extremely defensive handling for the PWA hook
  const offlineReadyState = (registerSW && registerSW.offlineReady) ? registerSW.offlineReady : [false, () => {}];
  const needUpdateState = (registerSW && registerSW.needUpdate) ? registerSW.needUpdate : [false, () => {}];
  
  const [offlineReady, setOfflineReady] = offlineReadyState;
  const [needUpdate, setNeedUpdate] = needUpdateState;
  const updateServiceWorker = registerSW ? registerSW.updateServiceWorker : () => {};

  const close = () => {
    if (typeof setOfflineReady === 'function') setOfflineReady(false);
    if (typeof setNeedUpdate === 'function') setNeedUpdate(false);
  };

  if (!offlineReady && !needUpdate) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        maxWidth: 350,
        width: "calc(100% - 48px)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 2.5,
          backgroundColor: "primary.main",
          color: "white",
          borderRadius: 3,
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <SystemUpdateIcon />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {offlineReady ? "App ready to work offline" : "New update available!"}
            </Typography>
          </Stack>
          
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {offlineReady 
              ? "SyncBoard is now cached and available offline." 
              : "A new version of SyncBoard is ready. Update now to get the latest features."}
          </Typography>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button 
              onClick={close} 
              sx={{ color: "white", opacity: 0.8, textTransform: "none" }}
            >
              Close
            </Button>
            {needUpdate && (
              <Button
                variant="contained"
                onClick={() => updateServiceWorker(true)}
                sx={{ 
                  backgroundColor: "white", 
                  color: "primary.main",
                  fontWeight: 700,
                  textTransform: "none",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" }
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