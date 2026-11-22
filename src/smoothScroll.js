// Smooth (eased) scrolling with Lenis. Visitors who prefer reduced motion keep
// the browser's normal scrolling. On touch screens Lenis leaves scrolling
// native by default.
import Lenis from "lenis";

let lenis = null;

export function startSmoothScroll() {
  if (lenis || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return () => {};
  }
  // `anchors` makes in-page links (#about, #contact…) glide too.
  lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.1 });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0);
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
