import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";

import { toggleTheme, useTheme } from "../theme";

// A hanging lamp: pull its string (drag it down, click it, or press Enter or
// Space when it has focus) to switch between light and dark mode. Light on
// means light mode.
//
// The lamp's look (bulb colour, glow) comes from CSS variables keyed on
// <html data-theme>, so it is right from the first paint; React state is only
// used for the accessible "checked" state.

const MAX_PULL = 46; // px the string can be pulled
const TRIGGER = 22; // px of pull that switches the light
const HINT_KEY = "lamp-pulled";

const LampToggle = () => {
  const isLight = useTheme() === "light";
  const reduceMotion = useReducedMotion();
  const pull = useMotionValue(0);
  const swing = useMotionValue(0);
  const bulbRef = useRef(null);
  const drag = useRef(null);
  const skipClick = useRef(false);
  const touched = useRef(false);
  const hintRef = useRef(null);
  const showHint = (show) => {
    if (hintRef.current) hintRef.current.style.opacity = show ? "1" : "0";
  };

  // First visit: tug the string now and then so people notice it.
  useEffect(() => {
    if (reduceMotion) return undefined;
    try {
      if (localStorage.getItem(HINT_KEY)) return undefined;
    } catch {
      return undefined;
    }
    showHint(true);
    let count = 0;
    const id = setInterval(() => {
      if (touched.current) {
        clearInterval(id);
        return;
      }
      animate(pull, [0, 12, 0], { duration: 0.9, ease: "easeInOut" });
      if (++count >= 4) {
        clearInterval(id);
        showHint(false);
      }
    }, 3500);
    return () => clearInterval(id);
  }, [pull, reduceMotion]);

  const springBack = () =>
    animate(pull, 0, { type: "spring", stiffness: 520, damping: 13 });

  const switchLight = () => {
    showHint(false);
    try {
      localStorage.setItem(HINT_KEY, "1");
    } catch {
      // ignore
    }
    const bulb = bulbRef.current?.getBoundingClientRect();
    toggleTheme(
      bulb && { x: bulb.left + bulb.width / 2, y: bulb.top + bulb.height / 2 }
    );
    if (!reduceMotion) {
      animate(swing, [0, 7, -5, 3, -1.5, 0], { duration: 1.4, ease: "easeOut" });
    }
  };

  const onPointerDown = (event) => {
    if (event.button !== 0) return;
    // Take over from any hint tug that is still running.
    touched.current = true;
    pull.stop();
    showHint(false);
    skipClick.current = false;
    drag.current = { startY: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    const state = drag.current;
    if (!state) return;
    const distance = event.clientY - state.startY;
    if (Math.abs(distance) > 3) state.moved = true;
    // Rubber band: easy at first, stiffer towards the end.
    pull.set(distance <= 0 ? 0 : MAX_PULL * (1 - Math.exp(-distance / MAX_PULL)));
  };

  const onPointerUp = () => {
    const state = drag.current;
    drag.current = null;
    if (!state?.moved) return;
    skipClick.current = true; // the click that follows this drag
    if (pull.get() > TRIGGER) switchLight();
    springBack();
  };

  const onPointerCancel = () => {
    drag.current = null;
    springBack();
  };

  // Click, tap or keyboard: play a short pull, then switch.
  const onClick = async () => {
    if (skipClick.current) {
      skipClick.current = false;
      return;
    }
    touched.current = true;
    pull.stop();
    await animate(pull, TRIGGER + 6, { duration: 0.14, ease: "easeIn" });
    switchLight();
    springBack();
  };

  return (
    <div className='relative w-14 h-9 shrink-0 pointer-events-none select-none'>
      <motion.div
        className='absolute left-0 -top-5 w-14 origin-top'
        style={{ rotate: swing }}
      >
        <svg
          width='56'
          height='64'
          viewBox='0 0 56 64'
          aria-hidden='true'
          className='overflow-visible'
        >
          <defs>
            <linearGradient id='lamp-shade' x1='0' y1='0' x2='1' y2='1'>
              <stop offset='0' stopColor='#b08cff' />
              <stop offset='1' stopColor='#6a3be0' />
            </linearGradient>
            <radialGradient id='lamp-light'>
              <stop offset='0' stopColor='#ffe9a6' stopOpacity='0.9' />
              <stop offset='0.45' stopColor='#ffd96b' stopOpacity='0.35' />
              <stop offset='1' stopColor='#ffd96b' stopOpacity='0' />
            </radialGradient>
          </defs>
          <circle className='lamp-glow' cx='28' cy='50' r='26' fill='url(#lamp-light)' />
          <line x1='28' y1='0' x2='28' y2='20' stroke='var(--lamp-cable)' strokeWidth='2' />
          <rect x='23' y='17' width='10' height='8' rx='2' fill='var(--lamp-cable)' />
          <circle ref={bulbRef} className='lamp-bulb' cx='28' cy='47' r='6' />
          <path d='M21 24h14l15 21c-6 4-38 4-44 0z' fill='url(#lamp-shade)' />
          <path d='M7 45c6 3.2 36 3.2 42 0' stroke='#d9c8ff' strokeOpacity='0.6' strokeWidth='1.5' fill='none' />
        </svg>

        {/* The string comes out from under the shade; the box clips its top. */}
        <div className='absolute left-[30px] top-[46px] w-6 h-[100px] overflow-hidden pointer-events-none'>
          <motion.button
            type='button'
            role='switch'
            aria-checked={isLight}
            aria-label='Light mode'
            title={isLight ? "Pull to turn the light off" : "Pull to turn the light on"}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
            onClick={onClick}
            style={{ y: pull, touchAction: "none" }}
            className='group pointer-events-auto absolute left-0 -top-10 w-6 h-[86px] flex flex-col items-center cursor-grab active:cursor-grabbing outline-none'
          >
            <span className='lamp-cord-line w-[2px] h-[70px] rounded-full' />
            <span className='w-3 h-3 -mt-px rounded-full bg-[#915eff] ring-2 ring-[#c9b3ff]/40 transition-transform group-hover:scale-125 group-focus-visible:ring-4 group-focus-visible:ring-[#915eff]/60' />
          </motion.button>
        </div>

        <span
          ref={hintRef}
          aria-hidden='true'
          className='absolute top-[78px] right-[34px] whitespace-nowrap rounded-full bg-tertiary/90 px-2 py-0.5 text-[11px] text-secondary shadow transition-opacity duration-500 opacity-0'
        >
          Pull me
        </span>
      </motion.div>
    </div>
  );
};

export default LampToggle;
