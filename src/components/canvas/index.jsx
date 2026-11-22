import { lazy, Suspense, useRef } from "react";
import { useInView } from "motion/react";

// The 3D scenes (three.js + react-three-fiber + drei, ~1 MB) are split into a
// separate chunk that loads after the page's text and links are interactive.
// Their containers have fixed sizes, so nothing shifts while it loads.
const lazyScene = (load) => {
  const Scene = lazy(load);
  const LazyScene = (props) => (
    <Suspense fallback={null}>
      <Scene {...props} />
    </Suspense>
  );
  return LazyScene;
};

// Below-the-fold scenes are only created when they come near the viewport.
// Each canvas is a separate WebGL context; creating all 15 at page load blocked
// the main thread for seconds, and mobile Safari drops contexts past its limit.
// (useInView is false during prerender and the first client render, so the
// hydrated HTML matches.)
const whenNearViewport = (Scene, className = "w-full h-full") => {
  const NearViewport = (props) => {
    const ref = useRef(null);
    const near = useInView(ref, { once: true, margin: "300px" });
    return (
      <div ref={ref} className={className}>
        {near && <Scene {...props} />}
      </div>
    );
  };
  return NearViewport;
};

export const ComputersCanvas = lazyScene(() => import("./Computers"));
export const EarthCanvas = whenNearViewport(lazyScene(() => import("./Earth")));
export const BallCanvas = whenNearViewport(lazyScene(() => import("./Ball")));
// Stars fill their section from behind, so the placeholder takes that box too.
export const StarsCanvas = whenNearViewport(
  lazyScene(() => import("./Stars")),
  "absolute inset-0 z-[-1]"
);
