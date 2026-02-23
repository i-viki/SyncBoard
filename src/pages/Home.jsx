import React, { useEffect } from "react";
import Hero from "../components/Hero";
import { pageLogging } from "../scripts/analyticsLogging";

function Home() {
  useEffect(() => {
    pageLogging("Home");
  }, []);

  return (
    <>
      <Hero />
    </>
  );
}

export default Home;
