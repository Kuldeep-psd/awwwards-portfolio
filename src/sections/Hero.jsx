import { useMediaQuery } from "react-responsive";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"; // Assumes components folder is at the same level
import Prism from "../components/Prism";
import Aurora from "../components/Aurora";
import {Planet} from "../components/Planet";

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const text = `A versatile designer that will help fix your lifedd`;
  return (
    <section id="home" className="flex flex-col justify-end min-h-screen">
      <AnimatedHeaderSection
        subTitle={""}
        title={"KulDes"}
        text={text}
        textColor={"text-black"}
      />
      <figure
        className="absolute inset-0 -z-50"
        style={{ width: "100vw", height: "100vh" }}
      >
        {/* This is the correct implementation of the Prism component */}
        {/* <Prism
          animationType="3drotate"
          timeScale={0.5}
          height={3}
          baseWidth={3}
          scale={3.6}
          hueShift={1}
          colorFrequency={0.5}
          noise={0.1}
          glow={1}
          transparent={true}
          bloom = {0.5}
        /> */

          <Aurora

            colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}

            blend={0.5}

            amplitude={0.5}

            speed={0.5}

          />}
      </figure>
    </section>
  );
};

export default Hero;