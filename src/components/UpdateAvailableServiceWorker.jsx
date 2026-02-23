import React, { useState, useEffect } from "react";

function UpdateAvailableServiceWorker() {
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handler = (event) => {
      if (event.data?.type === "NEW_VERSION_AVAILABLE") {
        setNewVersionAvailable(true);
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, []);

  const reloadPage = () => {
    window.location.reload();
  };

  if (!newVersionAvailable) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "#1976d2",
        color: "white",
        padding: "12px",
        textAlign: "center",
        cursor: "pointer",
        zIndex: 9999,
      }}
      onClick={reloadPage}
    >
      ✨ Update available! Click to refresh.
    </div>
  );
}

export default UpdateAvailableServiceWorker;