import { useMediaQuery } from "react-responsive";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"; // Assumes components folder is at the same level
import Orb from "../components/Prism";
import Aurora from "../components/Aurora";
import {Planet} from "../components/Planet";

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });
  const text = `turning complexity into intuitive + meaningful experiences 
  across systems, data, and interfaces`;
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
        {<div style={{ width: '100%', height: '100%', position: 'relative' }}>

  <Orb

    hoverIntensity={0.1}

    rotateOnHover={true}

    hue={300}

    forceHoverState={false}

  />

</div>

          // <Aurora

          //   colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}

          //   blend={0.5}

          //   amplitude={0.5}

          //   speed={0.5}

          // />}
        }
      </figure>
    </section>
  );
};

export default Hero;