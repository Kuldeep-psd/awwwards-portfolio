import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// A simple inline SVG for the download icon
const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v5.69l-1.97-1.97a.75.75 0 00-1.06 1.06l3.5 3.5a.75.75 0 001.06 0l3.5-3.5a.75.75 0 10-1.06-1.06l-1.97 1.97V6.75z"
      clipRule="evenodd"
    />
  </svg>
);

const About = () => {
  const headerText = `I am Kuldeep, an information designer who loves exploring 
  ideas and understanding people.`;

  const aboutText = `My work is driven by a practice of active synthesis—applying systems logic, artistic craft, and creative technology to human-centered problems. I enjoy digging into messy problems and shaping ideas into experiences that feel intuitive and honest.`;

  const interests = [
    "📝 Reading or breaking apart ideas",
    "🔍 Playing with data, visuals, & code",
    "🌆 Taking the road less taken in new cities",
    "🎧 Exploring films, music, & anything beautifully made",
  ];

  useGSAP(() => {
    gsap.to("#about", {
      scale: 0.95,
      scrollTrigger: {
        trigger: "#about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
        markers: false,
      },
      ease: "power1.inOut",
    });
  });

  return (
    <section id="about" className="min-h-screen bg-black rounded-b-4xl">
      <AnimatedHeaderSection
        subTitle={"Curious by nature, grounded in design."}
        title={"About"}
        text={headerText}
        textColor={"text-white"}
        withScrollTrigger={true}
      />

      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24 px-10 lg:px-20 pb-20 lg:pb-32 text-white/60">
        {/* --- COLUMN 1 (formerly Column 2): Experience & Resume (Takes 2 of 5 columns) --- */}
        <div className="flex flex-col gap-16 lg:col-span-2 order-2 lg:order-1"> {/* order-2 makes it second on mobile, order-1 makes it first on desktop */}
          
          {/* Experience & Education Section */}
          <div className="space-y-10">
            {/* Deloitte */}
            <div className="flex items-center gap-5">
              <img 
                src="/images/deloitte-logo.png" 
                alt="Deloitte" 
                className="h-10 w-auto" // Adjusted for prominent horizontal logo
              />
              <div>
                <h4 className="text-lg md:text-xl font-medium text-white">
                  Customer Strategy & Design
                </h4>
                <p className="text-lg md:text-xl font-light">Deloitte India</p>
              </div>
            </div>
            
            {/* DTU */}
            <div className="flex items-center gap-5">
              <img 
                src="/images/dtu-logo.png" 
                alt="DTU" 
                className="w-14 h-auto" // Adjusted for prominent square/circular logo
              />
              <div>
                <h4 className="text-lg md:text-xl font-medium text-white">
                  B.Tech, Computer Science
                </h4>
                <p className="text-lg md:text-xl font-light">
                  Delhi Technological University
                </p>
              </div>
            </div>
          </div>

          {/* Resume Button - Outline style with fill on hover */}
          <a
            href="/resume/KuldeepSingh_Resume.pdf" 
            download="KuldeepSingh_Resume.pdf"
            className="group relative w-full lg:w-auto inline-flex items-center justify-center gap-3
                       text-white border-1 border-white text-lg font-medium px-8 py-5 rounded-full
                       overflow-hidden transition-colors duration-500 ease-out hover:text-black"
          >
            {/* Background fill on hover */}
            <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100
                             transition-transform duration-500 ease-out origin-left z-0"></span>
            
            <span className="relative z-10 flex items-center gap-3">
              Download Resume
              <DownloadIcon />
            </span>
          </a>
        </div>

        {/* --- COLUMN 2 (formerly Column 1): About Text & Interests (Takes 3 of 5 columns) --- */}
        <div className="flex flex-col gap-12 lg:col-span-3 order-1 lg:order-2"> {/* order-1 makes it first on mobile, order-2 makes it second on desktop */}
          <AnimatedTextLines
            text={aboutText}
            className={
              "text-xl md:text-2xl lg:text-3xl font-light tracking-wide"
            }
          />

          <div>
            <h3 className="text-sm uppercase tracking-widest text-white/40 mb-6 font-medium">
              When I'm not designing
            </h3>
            <ul className="text-lg md:text-xl font-light space-y-3">
              {interests.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;