/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Suspense, useEffect, useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, Preload, useGLTF } from '@react-three/drei';
import { LoadingFlag, LoadingOverlay } from '../Loader';
import { useTheme } from '../../theme';

// Light mode: the model is mostly black, so on the pale background it needs
// studio lighting to read as a lit desk instead of a dark silhouette. Soft
// light panels (Lightformers) give its glossy surfaces highlights; they are
// rendered locally, so nothing is downloaded. Dark mode keeps the original
// moody lighting.
const StudioLights = () => (
  <>
    <ambientLight intensity={0.9} />
    <directionalLight position={[10, 12, 6]} intensity={2.6} />
    <directionalLight position={[-8, 6, -6]} intensity={1.2} color='#d9ccff' />
    <Environment resolution={256} frames={1}>
      <Lightformer form='rect' intensity={3} position={[0, 6, 8]} scale={[14, 5, 1]} />
      <Lightformer form='rect' intensity={1.6} color='#c9b6ff' position={[-9, 3, 0]} scale={[8, 5, 1]} />
      <Lightformer form='rect' intensity={1.6} color='#bff3e8' position={[9, 3, 0]} scale={[8, 5, 1]} />
    </Environment>
  </>
);

const Computers = ({isMobile}) => {
  const computer = useGLTF('/desktop_pc/scene.glb');
  const light = useTheme() === 'light';
  return (
    <mesh>
      {light && <StudioLights />}
      <hemisphereLight intensity={light ? 2.2 : 1.5} groundColor={light ? '#bfb3e6' : 'black'} />
      <pointLight intensity={1.25} />
      <spotLight 
        position={[-20,50,10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <primitive 
        object={computer.scene} 
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0,-3,-2.2] : [0,-4,-1,5]}
        rotation={[-0.01,-0.2,-0.1]}
      />
    </mesh>
  )
}

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(
    // `window` doesn't exist while the page is prerendered at build time.
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 500px)').matches
  );
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 500px)');
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    }
    mediaQuery.addEventListener('change',handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener('change',handleMediaQueryChange);
    }
  },[])
  const [loading, setLoading] = useState(false);
  return(
    <div className="relative w-full h-full">
      <Canvas
        frameloop="demand"
        shadows="percentage"
        camera={{position: [20,3,5],fov:25}}
        gl={{preserveDrawingBuffer: true}}
      >
        <Suspense fallback={<LoadingFlag onChange={setLoading} />}>
          <OrbitControls
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
          <Computers isMobile={isMobile}/>
        </Suspense>
        <Preload all />
      </Canvas>
      {loading && <LoadingOverlay />}
    </div>
  )
}

export default ComputersCanvas