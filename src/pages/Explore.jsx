import React, { useEffect } from "react";
import AboutText from "../components/features/AboutText";
import { pageLogging } from "../services/analyticsService";
import { Helmet } from "react-helmet-async";
function About() {
  useEffect(() => {
    pageLogging("About");
  }, []);

  return (
    <>

      <Helmet>
        <title>Explore | SyncBoard</title>

        <meta
          name="description"
          content="Learn about SyncBoard — a lightweight real-time collaboration platform designed for instant sharing. No accounts, no setup, just seamless live collaboration."
        />

        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Explore | SyncBoard"
        />
        <meta
          property="og:description"
          content="Discover how SyncBoard enables fast, distraction-free real-time collaboration for teams and individuals."
        />
        <meta
          property="og:url"
          content="https://isyncboard.vercel.app/explore"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content="About SyncBoard | Real-Time Collaboration Made Simple"
        />
        <meta
          name="twitter:description"
          content="A fast, minimal collaboration tool built for instant sharing and real-time updates."
        />

        <link
          rel="canonical"
          href="https://isyncboard.vercel.app/explore"
        />
      </Helmet>

      <AboutText />
    </>
  );
}

export default About;
