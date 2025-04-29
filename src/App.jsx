import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Clipboard from "./pages/Clipboard";
import Feedback from "./pages/Feedback";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import UserIdentification from "./components/common/UserIdentification";
import UpdateAvailableServiceWorker from "./components/common/UpdateAvailableServiceWorker";
import ScrollToTop from "./components/common/ScrollToTop";

import "./App.css";

function App({ toggleTheme, mode }) {
  const location = useLocation();

  const isClipboardRoute = /^\/[A-Za-z0-9]{5}$/.test(location.pathname);

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

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
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
      </Box>

      {/* Footer (hide for clipboard route if you want full editor experience) */}
      {!isClipboardRoute && <Footer />}
    </Box>
  );
}

export default App;