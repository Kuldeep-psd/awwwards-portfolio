import { useMediaQuery } from "react-responsive";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection"; // Assumes components folder is at the same level
import Orb from "../components/Orb";

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
        {<div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Orb
            hoverIntensity={0.1}
            rotateOnHover={true}
            hue={300}
            forceHoverState={false}
          />
        </div>
        }
      </figure>
    </section>
  );
};

export default Hero;