import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, label[for], .cursor-pointer';
const MotionDiv = motion.div;

const CustomCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');

    const syncMode = () => {
      const nextEnabled = mediaQuery.matches;
      setEnabled(nextEnabled);
      document.body.classList.toggle('custom-cursor-enabled', nextEnabled);
    };

    syncMode();
    mediaQuery.addEventListener('change', syncMode);

    return () => {
      mediaQuery.removeEventListener('change', syncMode);
      document.body.classList.remove('custom-cursor-enabled');
    };
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    const handleMove = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      setIsInteractive(Boolean(event.target.closest(INTERACTIVE_SELECTOR)));
    };

    const handleMouseOver = (event) => {
      setIsInteractive(Boolean(event.target.closest(INTERACTIVE_SELECTOR)));
    };

    const handleEnter = () => setVisible(true);
    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseenter', handleEnter);
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', handleEnter);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <MotionDiv
      aria-hidden="true"
      className="fixed top-0 left-0 z-[1001] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
      style={{
        left: x,
        top: y,
        mixBlendMode: 'difference',
        backgroundColor: '#ffffff',
      }}
      animate={{
        width: isInteractive ? 34 : 14,
        height: isInteractive ? 34 : 14,
        opacity: visible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 450, damping: 34, mass: 0.35 }}
    />
  );
};

export default CustomCursor;
