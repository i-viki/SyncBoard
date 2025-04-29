import React, { useEffect } from "react";
import Hero from "../components/features/Hero";
import { pageLogging } from "../services/analyticsService";
import { Helmet } from "react-helmet-async";

function Home() {
  useEffect(() => {
    pageLogging("Home");
  }, []);

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>
          SyncBoard | Real-Time Text & Image Sharing Across Devices
        </title>

        <meta
          name="description"
          content="SyncBoard is a fast and anonymous real-time collaboration tool that lets you instantly share text and images across devices. No sign-up required. Simple, secure, and seamless."
        />

        <meta
          name="keywords"
          content="SyncBoard, real-time collaboration, online clipboard, instant text sharing, image sharing tool, anonymous board, live sync app, cross device sharing"
        />

        <meta name="robots" content="index, follow" />

        {/* Open Graph (Facebook / LinkedIn) */}
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="SyncBoard | Real-Time Text & Image Sharing"
        />
        <meta
          property="og:description"
          content="Share text and images instantly with SyncBoard. A real-time, anonymous collaboration platform built for speed and simplicity."
        />
        <meta
          property="og:url"
          content="https://isyncboard.vercel.app/"
        />
        <meta
          property="og:image"
          content="https://isyncboard.vercel.app/og-image.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="SyncBoard | Instant Real-Time Collaboration"
        />
        <meta
          name="twitter:description"
          content="Collaborate instantly with SyncBoard. Share text and images in real-time across devices without accounts."
        />
        <meta
          name="twitter:image"
          content="https://isyncboard.vercel.app/og-image.png"
        />

        <link
          rel="canonical"
          href="https://isyncboard.vercel.app/"
        />
      </Helmet>
      <Hero />
    </>
  );
}

export default Home;