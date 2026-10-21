import React, { useState, useEffect } from "react";
import ClipNavbar from "../components/common/ClipNavbar";
import ClipField from "../components/features/ClipField";
import NoInternetComponent from "../components/common/NoInternetComponent";
import { pageLogging } from "../services/analyticsService";
import { Toaster, toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";


function Clipboard({ toggleTheme, mode }) {
  const navigate = useNavigate();
  const [internetStatus, setInternetStatus] = useState(navigator.onLine);

  // Board History Logic (Obfuscated Storage)
  const { code } = useParams();
  useEffect(() => {
    if (code && /^[A-Za-z0-9]{5}$/.test(code)) {
      try {
        const rawHistory = localStorage.getItem("board_history");
        const history = rawHistory ? JSON.parse(atob(rawHistory)) : [];
        const newHistory = [code, ...history.filter(c => c !== code)].slice(0, 5);
        localStorage.setItem("board_history", btoa(JSON.stringify(newHistory)));
      } catch (e) {
        // Fallback for legacy plain-text or corrupt data
        localStorage.setItem("board_history", btoa(JSON.stringify([code])));
      }
    }
  }, [code]);

  // Feedback Toast
  useEffect(() => {
    const getData = JSON.parse(localStorage.getItem("feedback")) || {};
    if (!getData?.hasSubmittedFeedbackResponse) {
      toast("Shape the future of SyncBoard", {
        description:
          "Share your thoughts and help us prioritize the next set of improvements.",
        duration: 3000,
        action: {
          label: "Provide Feedback",
          onClick: () => navigate("/feedback"),
        },
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateInternetStatus = () => {
      setInternetStatus(navigator.onLine);
    };

    window.addEventListener("online", updateInternetStatus);
    window.addEventListener("offline", updateInternetStatus);

    pageLogging("Clipboard");

    return () => {
      window.removeEventListener("online", updateInternetStatus);
      window.removeEventListener("offline", updateInternetStatus);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>{code ? `Board ${code} | SyncBoard` : "Workspace | SyncBoard"}</title>
      </Helmet>
      <ClipNavbar
        internetStatus={internetStatus}
        toggleTheme={toggleTheme}
        mode={mode}
      />

      {internetStatus ? (
        <ClipField />
      ) : (
        <NoInternetComponent />
      )}

      <Toaster
        theme={mode === "dark" ? "dark" : "light"}
        position="bottom-right"
        closeButton
        richColors
        toastOptions={{
          style: {
            minHeight: "54px",
            padding: "14px 18px",
            borderRadius: "16px",
            fontSize: "13px",
            fontWeight: 500,
            backgroundColor: mode === "dark" ? "#141414" : "#ffffff",
            border: `1px solid ${mode === "dark" ? "#262626" : "#e4e4e7"}`,
            color: mode === "dark" ? "#ffffff" : "#090909",
            backdropFilter: "blur(20px)",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.4)",
          },
        }}
      />
    </>
  );
}

export default Clipboard;