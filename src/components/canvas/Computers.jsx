/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Suspense, useEffect, useState} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import { LoadingFlag, LoadingOverlay } from '../Loader';
// import { Mesh } from 'three';

const Computers = ({isMobile}) => {
  const computer = useGLTF('/desktop_pc/scene.glb');
  return (
    <mesh>
      <hemisphereLight intensity={1.5} groundColor="black" />
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