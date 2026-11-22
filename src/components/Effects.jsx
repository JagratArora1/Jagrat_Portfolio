// Page-wide effects: smooth scrolling, a scroll progress bar, a soft glow that
// follows the mouse, and a back-to-top button. None of them render content, so
// they are safe to leave out of the prerendered HTML.
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";

import { scrollToTop, startSmoothScroll } from "../smoothScroll";

export const SmoothScroll = () => {
  useEffect(() => startSmoothScroll(), []);
  return null;
};

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });
  return <motion.div aria-hidden='true' className='scroll-progress' style={{ scaleX }} />;
};

// Only for a real mouse, and not for visitors who prefer reduced motion.
export const CursorGlow = () => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    const fineMouse = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!element || !fineMouse || reduceMotion) return undefined;

    let frame = 0;
    let x = 0;
    let y = 0;
    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        element.style.setProperty("--x", `${x}px`);
        element.style.setProperty("--y", `${y}px`);
        element.style.opacity = "1";
      });
    };
    const onLeave = () => {
      element.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden='true' className='cursor-glow' />;
};

export const BackToTop = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    setVisible(value > window.innerHeight * 1.2);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key='back-to-top'
          type='button'
          aria-label='Back to top'
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.9 }}
          className='fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full green-pink-gradient p-px shadow-card'
        >
          <span className='flex w-full h-full items-center justify-center rounded-full bg-tertiary text-heading'>
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
            >
              <path d='M12 19V5M5 12l7-7 7 7' />
            </svg>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};
