import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";

// Code-split pages for optimized initial bundle delivery
const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const Clipboard = lazy(() => import("./pages/Clipboard"));
const Feedback = lazy(() => import("./pages/Feedback"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

// Prefetch secondary pages on idle so route transitions feel instantaneous and seamless
if (typeof window !== "undefined") {
  const prefetchPages = () => {
    import("./pages/Explore");
    import("./pages/Feedback");
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(prefetchPages);
  } else {
    setTimeout(prefetchPages, 800);
  }
}

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import UserIdentification from "./components/common/UserIdentification";
import UpdateAvailableServiceWorker from "./components/common/UpdateAvailableServiceWorker";
import ScrollToTop from "./components/common/ScrollToTop";

import "./App.css";

const PageLoader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 120px)",
    }}
  >
    <CircularProgress size={32} sx={{ color: "#0099ff" }} />
  </Box>
);

function App({ toggleTheme, mode }) {
  const location = useLocation();
  
  // A clipboard route is exactly 5 characters long and alpha-numeric (excluding the leading slash)
  const path = location.pathname.substring(1);
  const isClipboardRoute = /^[A-Za-z0-9]{5}$/.test(path);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <UserIdentification />
      <UpdateAvailableServiceWorker />
      <ScrollToTop />

      {/* Navbar (hidden for clipboard route) */}
      {!isClipboardRoute && (
        <Navbar toggleTheme={toggleTheme} mode={mode} />
      )}

      {/* Main Content with Route Code Splitting */}
      <Box sx={{ flex: 1 }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route
              path="/:code"
              element={<Clipboard toggleTheme={toggleTheme} mode={mode} />}
            />
          </Routes>
        </Suspense>
      </Box>

      {/* Footer (hide for clipboard route if you want full editor experience) */}
      {!isClipboardRoute && <Footer />}
    </Box>
  );
}

export default App;