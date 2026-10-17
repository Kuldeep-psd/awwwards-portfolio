import { useEffect, useRef } from "react";
import lottie from "lottie-web/build/player/lottie_light";
import animationData from "../assets/sparkle-mono.json";

// "AI icon" by LottieFiles (Lottie Simple License), recolored to white-to-gray.
const SparklesIcon = ({ size = 50 }) => {
  const container = useRef(null);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animation = lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: !still,
      autoplay: !still,
      animationData,
    });
    if (still) animation.goToAndStop(0, true);
    return () => animation.destroy();
  }, []);

  return <span ref={container} aria-hidden="true" style={{ width: size, height: size, display: "block" }} />;
};

export default SparklesIcon;
