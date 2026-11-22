// Lamp toggle for the blog pages: the same light/dark switch as the portfolio
// (src/components/LampToggle.jsx and src/theme.js) without React. Pull the
// string (drag, click, or Enter/Space) to switch; the choice is shared with the
// portfolio through localStorage.
(() => {
  const root = document.documentElement;
  const button = document.querySelector("[data-lamp]");
  if (!button) return;
  const lamp = button.closest(".lamp");
  const bulb = lamp.querySelector(".lamp-bulb");
  const meta = document.querySelector('meta[name="theme-color"]');
  const MAX_PULL = 46;
  const TRIGGER = 22;
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let startY = null;
  let moved = false;
  let pull = 0;
  let skipClick = false;

  const sync = () => {
    const light = root.dataset.theme === "light";
    button.setAttribute("aria-checked", String(light));
    button.title = light ? "Pull to turn the light off" : "Pull to turn the light on";
  };

  const setPull = (px, transition) => {
    pull = px;
    button.style.transition = transition || "none";
    button.style.transform = `translateY(${px}px)`;
  };
  const springBack = () => setPull(0, "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)");

  const apply = (theme) => {
    root.dataset.theme = theme;
    meta?.setAttribute("content", theme === "light" ? "#f7f5ff" : "#050816");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Storage blocked: the choice just isn't remembered.
    }
    sync();
  };

  const flip = () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    if (!reduceMotion()) {
      lamp.classList.remove("swing");
      void lamp.offsetWidth; // restart the animation
      lamp.classList.add("swing");
    }
    if (!document.startViewTransition || reduceMotion()) {
      apply(next);
      return;
    }
    const box = bulb.getBoundingClientRect();
    const x = box.left + box.width / 2;
    const y = box.top + box.height / 2;
    const transition = document.startViewTransition(() => apply(next));
    transition.ready
      .then(() => {
        const radius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 750,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      })
      .catch(() => {});
  };

  button.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    skipClick = false;
    startY = event.clientY;
    moved = false;
    button.setPointerCapture(event.pointerId);
    setPull(0);
  });

  button.addEventListener("pointermove", (event) => {
    if (startY === null) return;
    const distance = event.clientY - startY;
    if (Math.abs(distance) > 3) moved = true;
    setPull(distance <= 0 ? 0 : MAX_PULL * (1 - Math.exp(-distance / MAX_PULL)));
  });

  const endDrag = (cancelled) => {
    if (startY === null) return;
    startY = null;
    if (moved && !cancelled) {
      skipClick = true;
      if (pull > TRIGGER) flip();
    }
    springBack();
  };
  button.addEventListener("pointerup", () => endDrag(false));
  button.addEventListener("pointercancel", () => endDrag(true));

  // Click, tap or keyboard: a short pull, then switch.
  button.addEventListener("click", () => {
    if (skipClick) {
      skipClick = false;
      return;
    }
    setPull(TRIGGER + 6, "transform 0.14s ease-in");
    setTimeout(() => {
      flip();
      springBack();
    }, 140);
  });

  sync();
})();
