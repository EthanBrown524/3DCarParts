import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Grid } from '@react-three/drei';
import useStore from '../store/useStore';

function PlaceholderCar({ color }) {
  return (
    <group>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[4, 0.8, 1.8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[2.2, 0.7, 1.6]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Windshield */}
      <mesh position={[-0.7, 1, 0]} rotation={[0, 0, Math.PI * 0.15]}>
        <planeGeometry args={[0.9, 1.4]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.5} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Rear window */}
      <mesh position={[0.7, 1, 0]} rotation={[0, 0, -Math.PI * 0.15]}>
        <planeGeometry args={[0.7, 1.4]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.5} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wheels */}
      {[[-1.3, 0, 1], [-1.3, 0, -1], [1.3, 0, 1], [1.3, 0, -1]].map((pos, i) => (
        <group key={i} position={pos}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.35, 0.12, 16, 32]} />
            <meshStandardMaterial color="#222" roughness={0.9} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
            <meshStandardMaterial color="#999" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      {[[-2, 0.4, 0.6], [-2, 0.4, -0.6]].map((pos, i) => (
        <mesh key={`hl-${i}`} position={pos}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Taillights */}
      {[[2, 0.4, 0.6], [2, 0.4, -0.6]].map((pos, i) => (
        <mesh key={`tl-${i}`} position={pos}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ viewerColor, sceneConfig }) {
  const {
    bgColor,
    groundColor,
    ambientIntensity,
    sunIntensity,
    sunColor,
    envPreset,
    showGrid,
  } = sceneConfig;

  return (
    <>
      {/* Background color */}
      <color attach="background" args={[bgColor]} />

      {/* Lighting */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      {/* Fill light from opposite side */}
      <directionalLight
        position={[-6, 6, -4]}
        intensity={sunIntensity * 0.25}
        color={sunColor}
      />

      {/* IBL for reflections on the car body */}
      <Environment preset={envPreset} background={false} />

      {/* Ground plane — clearly visible solid floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.51, 0]}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color={groundColor} roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Subtle grid on the ground */}
      {showGrid && (
        <Grid
          position={[0, -0.505, 0]}
          cellSize={1}
          cellThickness={0.4}
          cellColor="#c0c0c0"
          sectionSize={5}
          sectionThickness={0.8}
          sectionColor="#999999"
          fadeDistance={26}
          fadeStrength={1.8}
          infiniteGrid
        />
      )}

      {/* Soft contact shadow under the car */}
      <ContactShadows
        position={[0, -0.5, 0]}
        width={14}
        height={14}
        blur={2.2}
        far={1.2}
        opacity={0.75}
      />

      {/* Car model */}
      <PlaceholderCar color={viewerColor} />
    </>
  );
}

export default function CarViewer() {
  const selectedCar = useStore((s) => s.selectedCar);
  const viewerColor = useStore((s) => s.viewerColor);
  const sceneConfig = useStore((s) => s.sceneConfig);

  if (!selectedCar) {
    return (
      <div className="viewer-empty">
        <div className="viewer-empty-content">
          <h2>3D Car Configurator</h2>
          <p>Select a vehicle to start building</p>
        </div>
      </div>
    );
  }

  return (
    <div className="viewer-container">
      <div className="viewer-car-label">
        {selectedCar.year} {selectedCar.make} {selectedCar.model} {selectedCar.trim}
      </div>
      <Canvas shadows camera={{ position: [6, 3, 6], fov: 48 }}>
        <Scene viewerColor={viewerColor} sceneConfig={sceneConfig} />
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={14}
          minPolarAngle={Math.PI * 0.05}
          maxPolarAngle={Math.PI * 0.47}
          target={[0, 0.3, 0]}
        />
      </Canvas>
    </div>
  );
}
