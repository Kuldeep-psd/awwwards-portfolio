import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { AnimatedTextLines } from "../components/AnimatedTextLines";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useState } from "react";

// A simple inline SVG for the download icon
const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4 transition-transform duration-300 ease-out group-hover:translate-y-[1px]"
  >
    <path d="M12 4v12" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
);

const CredentialItem = ({ icon, logoSrc, logoAlt, title, subtitle, invertLogo = false }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="flex items-center gap-5">
      {logoSrc && !hasError ? (
        <img
          src={logoSrc}
          alt={logoAlt}
          className={`h-10 w-auto object-contain ${invertLogo ? "invert" : ""}`}
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex items-center justify-center w-10 h-10 text-xs font-semibold text-white border rounded-full border-white/30">
          {icon}
        </div>
      )}
      <div>
        <h4 className="text-lg md:text-xl font-medium text-white">{title}</h4>
        <p className="text-lg md:text-xl font-light">{subtitle}</p>
      </div>
    </div>
  );
};

const About = () => {
  const headerText = `I am Kuldeep, an Information Designer bridging the gap between complex data and human-centered experiences.`;

  const aboutText = `My practice is built on active synthesis, combining systems logic, creative technology, and user research to solve complex, human-centered problems. I thrive on untangling messy constraints and shaping them into digital experiences that feel intuitive, scalable, and honest.`;

  const interests = [
    "📝 Reading or breaking apart ideas",
    "🔍 Playing with data, visuals, & code",
    "🌆 Solo traveling and finding the quiet corners of new cities",
    "🎧 Logging world cinema on Letterboxd",
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
            <CredentialItem
              icon="💼"
              logoSrc="/images/deloitte-logo.png"
              logoAlt="Deloitte"
              title="Customer Strategy & Design"
              subtitle="Deloitte India"
            />
            <CredentialItem
              icon="NID"
              logoSrc="/images/nid-logo.png"
              logoAlt="NID Bengaluru"
              title="M.Des, Information Design"
              subtitle="NID Bengaluru"
              invertLogo={true}
            />
            <CredentialItem
              icon="🎓"
              logoSrc="/images/dtu-logo.png"
              logoAlt="DTU"
              title="B.Tech, Computer Science"
              subtitle="DTU"
            />
          </div>

          {/* Resume Button - Outline style with fill on hover */}
          <a
            href="/resume/KuldeepSingh_Resume.pdf" 
            download="KuldeepSingh_Resume.pdf"
            className="group relative w-full lg:w-auto inline-flex items-center justify-center
                       text-black bg-white border border-white/70
                       text-base md:text-lg font-medium tracking-normal
                       pl-7 pr-14 py-4 rounded-full overflow-hidden
                       transition-all duration-300 ease-out
                       hover:text-white hover:shadow-[0_12px_30px_rgba(255,255,255,0.2)]"
          >
            <span
              className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100
                             transition-transform duration-500 ease-out origin-left z-0"
            ></span>
            
            <span className="relative z-10 leading-none">Download Resume</span>
            <span className="absolute right-5 top-1/2 -translate-y-1/2 z-10">
              <DownloadIcon />
            </span>
          </a>
        </div>

        {/* --- COLUMN 2 (formerly Column 1): About Text & Interests (Takes 3 of 5 columns) --- */}
        <div className="flex flex-col gap-12 lg:col-span-3 order-1 lg:order-2"> {/* order-1 makes it first on mobile, order-2 makes it second on desktop */}
          <AnimatedTextLines
            text={aboutText}
            className={"text-lg md:text-xl lg:text-2xl font-light tracking-wide"}
          />

          <div>
            <h3 className="text-sm uppercase tracking-widest text-white/40 mb-6 font-medium">
              When I'm not designing:
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
