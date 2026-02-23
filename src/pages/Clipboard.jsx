import React, { useState, useEffect } from "react";
import ClipNavbar from "../components/ClipNavbar";
import ClipField from "../components/ClipField";
import NoInternetComponent from "../components/NoInternetComponent";
import { pageLogging } from "../scripts/analyticsLogging";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { userIdentifier } from "../scripts/userIdentifier";


const USER_UUID = userIdentifier() || "";

function Clipboard({ toggleTheme, mode }) {
  const navigate = useNavigate();
  const [internetStatus, setInternetStatus] = useState(navigator.onLine);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const uuid = userIdentifier();
    setUser(uuid);
  }, []);

  // Feedback Toast
  useEffect(() => {
    const getData = JSON.parse(localStorage.getItem("feedback")) || {};
    if (!getData?.hasSubmittedFeedbackResponse) {
      toast(
        "We'd love your feedback 💛",
        {
          description:
            "Please let us know how you like SyncBoard and what we can improve.",
          duration: Infinity,
          action: {
            label: "Give Feedback",
            onClick: () => navigate("/feedback"),
          },
        }
      );
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