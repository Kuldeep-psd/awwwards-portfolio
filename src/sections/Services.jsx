import { useRef } from 'react';
import AnimatedHeaderSection from '../components/AnimatedHeaderSection';
import { servicesData } from '../constants';
import { useMediaQuery } from 'react-responsive';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

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

const Services = () => {
  const text = `A look at how I explore ideas, 
  learn from people, and shape them into 
  thoughtful design.`;

  const serviceRefs = useRef([]);
  const isDesktop = useMediaQuery({ minWidth: '70rem' }); // 1120px

  useGSAP(() => {
    serviceRefs.current.forEach((el) => {
      if (!el) return;

      // 1. The fade-in animation for the whole sticky card
      gsap.from(el, {
        y: 200,
        opacity: 0,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
        },
        duration: 1,
        ease: 'circ.out',
      });

      // 2. The image clip-path reveal animation
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

      // 3. The "parallax" effect for the image
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
    <section id="services" className="min-h-screen bg-black rounded-t-4xl">
      <AnimatedHeaderSection
        subTitle={'The work behind the work.'}
        title={'Case Studies'}
        text={text}
        textColor={'text-white'}
        withScrollTrigger={true}
      />

      {/* --- Projects Section --- */}
      {/* FIX 1: Added 'pb-96' (padding-bottom) here. 
        This gives the last sticky card enough scrollable
        space at the end to complete its animation.
      */}
      <div className="relative pb-96">
        {servicesData.map((service, index) => (
          <div
            ref={(el) => (serviceRefs.current[index] = el)}
            key={index}
            className="sticky px-6 md:px-10 pt-10 pb-16 text-white bg-black border-t-2 border-white/30"
            style={
              isDesktop
                ? {
                    top: `calc(10vh + ${index * 6}em)`,
                    marginBottom: `${(servicesData.length - index - 1) * 6}rem`,
                  }
                : { top: 0 }
            }
          >
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              {/* --- COLUMN 1: Text Content --- */}
              <div className="flex flex-col gap-8 order-2 lg:order-1">
                <h2 className="text-4xl lg:text-5xl font-light">
                  {service.title}
                </h2>
                <p className="text-xl leading-relaxed tracking-wide lg:text-2xl text-white/60 text-pretty">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  {service.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-4 py-2 text-sm font-medium tracking-wider text-white/70 uppercase
                                 bg-white/5 border border-white/10 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* --- FIX 2: Updated Button --- */}
                <a
                  href={service.caseStudyUrl}
                  className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3
                             text-white border-2 border-white text-lg font-medium px-8 py-5 
                             rounded-lg {/* <-- Sharper corners */}
                             overflow-hidden transition-colors duration-500 ease-out hover:text-black mt-4"
                >
                  {/* Fill animation now comes from the bottom */}
                  <span
                    className="absolute inset-0 bg-white transform 
                               scale-y-0 group-hover:scale-y-100 {/* <-- Changed from scale-x */}
                               transition-transform duration-500 ease-out 
                               origin-bottom z-0"
                  ></span>

                  {/* Text and Icon */}
                  <span className="relative z-10 flex items-center gap-3">
                    View Case Study
                    <ArrowIcon />
                  </span>
                </a>
              </div>

              {/* --- COLUMN 2: Image --- */}
              <div className="order-1 lg:order-2">
                <div className="overflow-hidden rounded-2xl image-container">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    className="w-full h-auto object-cover project-image"
                    style={{ minHeight: '300px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;