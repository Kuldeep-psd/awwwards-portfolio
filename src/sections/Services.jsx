import { useRef } from 'react';
import AnimatedHeaderSection from '../components/AnimatedHeaderSection';
import { servicesData } from '../constants';
import { useMediaQuery } from 'react-responsive';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ShinyText from '../components/ShinyText';

// Icon for the button
const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
  >
    <path
      fillRule="evenodd"
      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
      clipRule="evenodd"
    />
  </svg>
);

const STACK_TOP_VH = 10;
const STACK_STEP_REM = 6;

const Services = () => {
  const text = `A look at how I explore ideas, 
  learn from people, and shape them into 
  thoughtful design.`;

  const serviceRefs = useRef([]);
  const isDesktop = useMediaQuery({ minWidth: '70rem' }); // 1120px

  useGSAP(() => {
    serviceRefs.current.forEach((el) => {
      if (!el) return;
      gsap.from(el, {
        y: 200,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
        duration: 1,
        ease: 'circ.out',
      });
      const imgContainer = el.querySelector('.image-container');
      const img = el.querySelector('.project-image');
      if (imgContainer) {
        gsap.set(imgContainer, {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
        });
        gsap.to(imgContainer, {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
          },
        });
      }
      if (img) {
        gsap.to(img, {
          y: '-15%',
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    });
  }, []);

  return (
    <section id="projects" className="min-h-screen bg-black rounded-t-4xl">
      <AnimatedHeaderSection
        subTitle={'The work behind the work.'}
        title={'Case Studies'}
        text={text}
        textColor={'text-white'}
        withScrollTrigger={true}
      />
      <div className="relative pb-96">
        {servicesData.map((service, index) => (
          <div
            ref={(el) => (serviceRefs.current[index] = el)}
            key={service.title}
            className="sticky px-6 md:px-10 pt-10 pb-16 text-white bg-black border-t-2 border-white/30 lg:h-[72vh]"
            style={
              isDesktop
                ? {
                    top: `calc(${STACK_TOP_VH}vh + ${index * STACK_STEP_REM}rem)`,
                    marginBottom: `${(servicesData.length - index - 1) * STACK_STEP_REM}rem`,
                    zIndex: index + 1,
                  }
                : { top: 0 }
            }
          >
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center lg:h-full">
              <div className="flex flex-col gap-8 order-2 lg:order-1 lg:h-full lg:justify-between">
                
                <div className="flex flex-col gap-2">
                  <h2 className="text-4xl lg:text-5xl font-light">
                    {service.title}
                  </h2>
                  {service.status && (
                    <span className="text-sm font-medium tracking-wider text-gray-400 uppercase">
                      {service.status}
                    </span>
                  )}
                </div>

                <a
                  href={service.caseStudyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3
                             text-white border-2 border-white text-lg font-medium px-8 py-5 
                             rounded-lg overflow-hidden transition-colors duration-500 ease-out hover:text-black mt-4
                             lg:order-4"
                >
                  <span
                    className="absolute inset-0 bg-white transform 
                               scale-x-0 group-hover:scale-x-100
                               transition-transform duration-500 ease-out 
                               origin-left z-0"
                  ></span>
                  <span className="relative z-10 flex items-center gap-3">
                    View Case Study
                    <ArrowIcon />
                  </span>
                </a>

                <p className="text-lg leading-relaxed tracking-wide lg:text-xl text-white/60 text-pretty lg:order-2"> {/* <-- DESKTOP ORDER */}
                  {service.description}
                </p>

                {service.award && (
                  <div
                    className="relative px-5 py-3 rounded-xl border border-amber-300/40
                               bg-gradient-to-r from-amber-300/10 via-yellow-200/10 to-amber-300/10
                               shadow-[0_0_30px_rgba(251,191,36,0.12)]
                               text-base lg:text-lg font-medium tracking-wide
                               lg:order-3"
                  >
                    <span className="mr-2 text-lg" aria-hidden="true">🏆</span>
                    <ShinyText
                      text={service.award}
                      className="font-semibold"
                      speed={2.8}
                      spread={110}
                      color="#d6b26e"
                      shineColor="#fff7dc"
                      yoyo
                      delay={0.2}
                      pauseOnHover
                    />
                  </div>
                )}

                <div
                  className="flex flex-wrap gap-3
                             lg:order-5"
                >
                  {service.tags.map((tag) => (
                    <span
                      key={`${service.title}-${tag}`}
                      className="px-4 py-2 text-sm font-medium tracking-wider text-white/70 uppercase
                                 bg-white/5 border border-white/10 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
              </div>

              <div className="order-1 lg:order-2 lg:h-full">
                <a
                  href={service.caseStudyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block overflow-hidden rounded-2xl image-container group lg:h-full"
                >
                  <div className="transition-transform duration-500 ease-out group-hover:scale-[1.04] lg:h-full">
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full h-auto object-cover project-image lg:h-full"
                      style={{ minHeight: '300px' }}
                    />
                  </div>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
