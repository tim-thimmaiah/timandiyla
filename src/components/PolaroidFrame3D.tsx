import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

interface ThreeDEffectParams {
  rotationSpeed: number;
  floatAmplitude: number;
  hoverRotation: number;
}

interface CameraSettings {
  positionZ: number;
  fov: number;
}

interface PolaroidFrameProps {
  photoData: string | null;
  note: string;
  isPreview?: boolean;
  effectParams?: ThreeDEffectParams;
  cameraSettings?: CameraSettings;
  className?: string;
}

const PolaroidModel: React.FC<{
  photoData: string | null;
  note: string;
  isPreview: boolean;
  isHovered: boolean;
  mouseX: number;
  mouseY: number;
  effectParams: ThreeDEffectParams;
  scaleFactor: number;
}> = ({
  photoData,
  note,
  isPreview,
  isHovered,
  mouseX,
  mouseY,
  effectParams,
  scaleFactor,
}) => {
  const polaroidRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [isTextureLoaded, setIsTextureLoaded] = useState(false);

  // Texture loading logic (unchanged)
  useEffect(() => {
    if (!photoData) {
      setTexture(null);
      setIsTextureLoaded(false);
      return;
    }

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    let isMounted = true;

    const loadTexture = async () => {
      try {
        const loadedTexture = await loader.loadAsync(photoData);
        if (!isMounted) return;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.minFilter = THREE.LinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
        setIsTextureLoaded(true);
      } catch (error) {
        console.error("Texture loading failed:", error);
        if (isMounted) {
          setTexture(null);
          setIsTextureLoaded(false);
        }
      }
    };

    loadTexture();

    return () => {
      isMounted = false;
      if (texture) texture.dispose();
    };
  }, [photoData]);

  useEffect(() => {
    if (materialRef.current && texture) {
      materialRef.current.map = texture;
      materialRef.current.needsUpdate = true;
    }
  }, [texture]);

  useEffect(() => {
    if (texture) {
      const aspect = texture.image.width / texture.image.height;
      const photoAspect = photoWidth / photoHeight;

      if (aspect > photoAspect) {
        texture.repeat.set(photoAspect / aspect, 1);
        texture.offset.set((1 - photoAspect / aspect) / 2, 0);
      } else {
        texture.repeat.set(1, aspect / photoAspect);
        texture.offset.set(0, (1 - aspect / photoAspect) / 2);
      }
      texture.needsUpdate = true;
    }
  }, [texture]);

  // Animation logic with mouse-based tilt and minimal scale
  useFrame((state) => {
    if (polaroidRef.current) {
      if (isHovered) {
        const targetRotationY = mouseX * effectParams.hoverRotation;
        const targetRotationX = -mouseY * effectParams.hoverRotation;

        polaroidRef.current.rotation.y = THREE.MathUtils.lerp(
          polaroidRef.current.rotation.y,
          targetRotationY,
          0.1
        );
        polaroidRef.current.rotation.x = THREE.MathUtils.lerp(
          polaroidRef.current.rotation.x,
          targetRotationX,
          0.1
        );
        polaroidRef.current.position.y = THREE.MathUtils.lerp(
          polaroidRef.current.position.y,
          0.1 * scaleFactor,
          0.1
        );
        polaroidRef.current.position.z = THREE.MathUtils.lerp(
          polaroidRef.current.position.z,
          0.2 * scaleFactor,
          0.1
        );
        // Minimal scale change on hover
        polaroidRef.current.scale.set(
          scaleFactor * 1.02, // Subtle scale (2% increase)
          scaleFactor * 1.02,
          scaleFactor * 1.02
        );
      } else {
        polaroidRef.current.rotation.y =
          Math.sin(state.clock.getElapsedTime() * effectParams.rotationSpeed) *
          0.03;
        polaroidRef.current.rotation.x = 0;
        polaroidRef.current.position.y =
          Math.sin(state.clock.getElapsedTime() * 0.5) *
          effectParams.floatAmplitude *
          scaleFactor;
        polaroidRef.current.position.z = THREE.MathUtils.lerp(
          polaroidRef.current.position.z,
          0,
          0.1
        );
        polaroidRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor); // Reset scale
      }
    }
  });

  // Polaroid dimensions
  const baseWidth = isPreview ? 2 : 2.5;
  const baseHeight = baseWidth * 1.4;
  const frameThickness = 0.005;
  const borderSide = 0.15;
  const borderBottom = 0.7;
  const photoWidth = baseWidth - borderSide * 2;
  const photoHeight = baseHeight - borderSide - borderBottom;
  const photoYPosition = baseHeight / 2 - borderSide - photoHeight / 2;

  return (
    <group ref={polaroidRef} position={[0, 0, 0]}>
      {/* Polaroid frame */}
      <RoundedBox
        args={[baseWidth, baseHeight, frameThickness]}
        radius={0.02}
        smoothness={4}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0}
          envMapIntensity={0.5}
        />
      </RoundedBox>

      {/* AO rim around photo */}
      {(isTextureLoaded || !photoData) && (
        <mesh position={[0, photoYPosition, frameThickness / 2 + 0.0075]}>
          <planeGeometry args={[photoWidth + 0.06, photoHeight + 0.06]} />
          <meshStandardMaterial
            color="#f0f0f0"
            roughness={0.7}
            metalness={0}
            transparent={true}
            opacity={0.4}
          />
        </mesh>
      )}

      {/* Photo */}
      {(isTextureLoaded || !photoData) && (
        <mesh
          position={[0, photoYPosition, frameThickness / 2 + 0.015]}
          castShadow
          receiveShadow
        >
          <planeGeometry args={[photoWidth, photoHeight]} />
          <meshStandardMaterial
            ref={materialRef}
            map={texture}
            color={texture ? "#ffffff" : "#e5e7eb"}
            roughness={0.15}
            metalness={0.05}
            envMapIntensity={0.2}
            transparent={true}
          />
        </mesh>
      )}

      {/* AO rim around note area */}
      <mesh
        position={[
          0,
          -baseHeight / 2 + borderBottom * 0.75,
          frameThickness / 2 + 0.0025,
        ]}
        castShadow
        receiveShadow
      >
        <planeGeometry
          args={[baseWidth * 0.8 + 0.06, borderBottom * 0.5 + 0.06]}
        />
        <meshStandardMaterial
          color="#f0f0f0"
          roughness={0.7}
          metalness={0}
          transparent={true}
          opacity={0.2}
        />
      </mesh>

      {/* Note area */}
      <mesh
        position={[
          0,
          -baseHeight / 2 + borderBottom * 0.75,
          frameThickness / 2 + 0.005,
        ]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[baseWidth * 0.8, borderBottom * 0.5]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.3}
          metalness={0}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Note text */}
      {note && (
        <Text
          font="/fonts/Caveat-Regular.woff"
          position={[
            0,
            -baseHeight / 2 + borderBottom * 0.75,
            frameThickness / 2 + 0.0075,
          ]}
          characters="abcdefghijklmnopqrstuvwxyz0123456789!"
          fontSize={0.15}
          color="#2a2a2a"
          anchorX="center"
          anchorY="middle"
          maxWidth={baseWidth * 0.75}
          textAlign="center"
          overflowWrap="break-word"
        >
          {note}
        </Text>
      )}
    </group>
  );
};

const defaultEffectParams: ThreeDEffectParams = {
  rotationSpeed: 0.3,
  floatAmplitude: 0.05,
  hoverRotation: 0.15, // Increased for more prominent tilt (about 8.6° max)
};

const defaultCameraSettings: CameraSettings = {
  positionZ: 4,
  fov: 45,
};

const PolaroidFrame: React.FC<PolaroidFrameProps> = ({
  photoData,
  note,
  isPreview = false,
  effectParams = defaultEffectParams,
  cameraSettings = defaultCameraSettings,
  className = "",
}) => {
  const [hovered, setHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Calculate scale factor with dynamic padding
  useEffect(() => {
    const updateScale = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement;
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        const baseWidth = isPreview ? 2 : 2.5;
        const baseHeight = baseWidth * 1.4;
        const polaroidAspect = baseWidth / baseHeight;
        const containerAspect = parentWidth / parentHeight;

        const paddingFactor = 0.9;
        let newScale;
        if (containerAspect > polaroidAspect) {
          newScale = (parentHeight / baseHeight) * paddingFactor;
        } else {
          newScale = (parentWidth / baseWidth) * paddingFactor;
        }

        setScaleFactor(newScale);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [isPreview]);

  // Mouse move handler
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      setMousePosition({ x: mouseX, y: mouseY });
    }
  };

  // Dynamic camera position
  const baseWidth = isPreview ? 2 : 2.5;
  const baseHeight = baseWidth * 1.4;
  const cameraZ = Math.max(baseHeight, baseWidth) * scaleFactor * 1.5;

  return (
    <motion.div
      className={`w-full h-full ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Canvas
        ref={canvasRef}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        dpr={[1, 2]}
        camera={{
          position: [0, 0, cameraZ],
          fov: cameraSettings.fov,
        }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={4} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={0.8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0002}
          shadow-camera-near={0.1}
          shadow-camera-far={50}
          shadow-camera-left={-15}
          shadow-camera-right={15}
          shadow-camera-top={15}
          shadow-camera-bottom={-15}
        />
        <hemisphereLight
          position={[0, 1, 0]}
          args={["#ffffff", "#ffffff", 1]}
        />
        <Suspense fallback={null}>
          <PolaroidModel
            photoData={photoData}
            note={note}
            isPreview={isPreview}
            isHovered={hovered}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
            effectParams={effectParams}
            scaleFactor={scaleFactor}
          />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(3 * Math.PI) / 4}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
    </motion.div>
  );
};

export default PolaroidFrame;
