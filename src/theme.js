// Light / dark theme.
//
// The theme is the `data-theme` attribute on <html>. index.html sets it before
// the first paint (dark unless the visitor chose light before), and every
// colour on the site comes from CSS variables keyed on it (src/index.css), so
// switching is a single attribute change. The blog pages share the same
// attribute and storage key (scripts/blog/theme.js).
import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

const STORAGE_KEY = "theme";
const THEME_COLORS = { dark: "#050816", light: "#f7f5ff" };

const listeners = new Set();
const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getTheme = () =>
  document.documentElement.dataset.theme === "light" ? "light" : "dark";

// The prerendered HTML is always built as dark; React switches after hydrating.
export const useTheme = () => useSyncExternalStore(subscribe, getTheme, () => "dark");

const applyTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage blocked (private mode etc.): the choice just isn't remembered.
  }
  listeners.forEach((listener) => listener());
};

// `origin` is the viewport point the new theme spreads out from (the lamp's
// bulb). Browsers without view transitions, and visitors who prefer reduced
// motion, get an instant switch.
export function setTheme(theme, origin) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduceMotion || !origin) {
    applyTheme(theme);
    return;
  }

  const transition = document.startViewTransition(() => {
    flushSync(() => applyTheme(theme));
  });
  transition.ready
    .then(() => {
      const { x, y } = origin;
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 750,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    })
    .catch(() => {});
}

export const toggleTheme = (origin) =>
  setTheme(getTheme() === "light" ? "dark" : "light", origin);
