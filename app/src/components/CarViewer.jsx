import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';
import useStore from '../store/useStore';

/**
 * Placeholder 3D car model — a stylized car shape built from primitives.
 * This will be replaced with actual GLB/glTF models when available.
 */
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
          {/* Tire */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.35, 0.12, 16, 32]} />
            <meshStandardMaterial color="#222" roughness={0.9} />
          </mesh>
          {/* Rim */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
            <meshStandardMaterial color="#999" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Headlights */}
      {[[0.9, -2, 0.55], [0.9, -2, -0.55]].map((pos, i) => (
        <mesh key={`hl-${i}`} position={[pos[1], pos[0], pos[2]]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#ffffcc" emissive="#ffffcc" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* Taillights */}
      {[[0.9, 2, 0.55], [0.9, 2, -0.55]].map((pos, i) => (
        <mesh key={`tl-${i}`} position={[pos[1], pos[0], pos[2]]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#ff3333" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export default function CarViewer() {
  const selectedCar = useStore((s) => s.selectedCar);
  const viewerColor = useStore((s) => s.viewerColor);

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
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
        <Stage environment="city" intensity={0.5} shadows>
          <PlaceholderCar color={viewerColor} />
        </Stage>
        <OrbitControls
          enablePan={false}
          minDistance={4}
          maxDistance={12}
          minPolarAngle={Math.PI * 0.1}
          maxPolarAngle={Math.PI * 0.45}
        />
      </Canvas>
    </div>
  );
}
