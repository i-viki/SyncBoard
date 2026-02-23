import React, { useEffect } from "react";
import AboutText from "../components/AboutText";
import { pageLogging } from "../scripts/analyticsLogging";
function About() {
  useEffect(() => {
    pageLogging("About");
  }, []);

  return (
    <>
      <AboutText />
    </>
  );
}

export default About;
