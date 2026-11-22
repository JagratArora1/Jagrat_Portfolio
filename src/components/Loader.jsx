import { useEffect } from "react";
import { useProgress } from "@react-three/drei";

// Loading spinner for a <Canvas>, drawn as a plain DOM overlay rather than with
// drei's <Html> (which throws a removeChild error on unmount under React 19).
//
//   const [loading, setLoading] = useState(false);
//   <div className="relative w-full h-full">
//     <Canvas>
//       <Suspense fallback={<LoadingFlag onChange={setLoading} />}>…</Suspense>
//     </Canvas>
//     {loading && <LoadingOverlay />}
//   </div>

// Used as the <Suspense> fallback inside a <Canvas>: it draws nothing in the 3D
// scene, it only tells the DOM side that this canvas is still loading.
export const LoadingFlag = ({ onChange }) => {
  useEffect(() => {
    onChange(true);
    return () => onChange(false);
  }, [onChange]);
  return null;
};

export const LoadingOverlay = () => {
  const { progress } = useProgress();
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <span className="canvas-loader">
        <p
          style={{
            fontSize: 14,
            color: "#f1f1f1",
            fontWeight: 800,
            marginTop: 40,
          }}
        >
          {progress.toFixed(2)}%
        </p>
      </span>
    </div>
  );
};
