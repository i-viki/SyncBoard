import React, { useState, useEffect } from "react";
import ClipNavbar from "../components/common/ClipNavbar";
import ClipField from "../components/features/ClipField";
import NoInternetComponent from "../components/common/NoInternetComponent";
import { pageLogging } from "../services/analyticsService";
import { Toaster, toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { userIdentifier } from "../utils/userIdentifier";


const USER_UUID = userIdentifier() || "";

function Clipboard({ toggleTheme, mode }) {
  const navigate = useNavigate();
  const [internetStatus, setInternetStatus] = useState(navigator.onLine);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const uuid = userIdentifier();
    setUser(uuid);
  }, []);

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
        position="bottom-right"
        closeButton
        richColors
        toastOptions={{
          style: {
            minHeight: "60px",
            padding: "16px 20px",
            borderRadius: "20px",
            fontSize: "14px",
            fontWeight: 500,
            backdropFilter: "blur(12px)",
          },
        }}
      />
    </>
  );
}

export default Clipboard;