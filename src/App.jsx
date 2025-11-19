import React, { useEffect, useState } from "react";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import ServiceSummary from "./sections/ServiceSummary";
import Services from "./sections/Services";
import ReactLenis from "lenis/react";
import About from "./sections/About";
import Works from "./sections/Works";
import Contact from "./sections/Contact";
import { Analytics } from "@vercel/analytics/react"

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setIsLoading(false);
    };

    // Check if the page is ALREADY loaded (e.g., from cache or fast connection)
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      // If not, wait for the real native load event
      window.addEventListener("load", handleLoad);
    }

    // Cleanup listener
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <ReactLenis root className="relative w-screen min-h-screen overflow-x-auto">
      {/* LOADER OVERLAY */}
      {/* The 'pointer-events-none' ensures that once opacity is 0, we can click through it instantly */}
      <div
        className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black text-white transition-opacity duration-700 ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Replaced the specific % bar with a generic infinite loading visual */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl tracking-widest animate-pulse font-light">
            LOADING
          </p>
          {/* Simple infinite line animation instead of a progress bar */}
          <div className="h-0.5 w-48 bg-white/20 overflow-hidden rounded-full">
            <div className="h-full w-1/2 bg-white animate-[shimmer_1.5s_infinite_linear]"></div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      {/* We simply fade this in when loading is false */}
      <div
        className={`transition-opacity duration-1000 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Navbar />
        <Hero />
        <ServiceSummary />
        <Services />
        <About />
        <Works />
        <Contact />
      </div>
    </ReactLenis>
  );
};

export default App;