import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Environment,
  Sparkles,
  MeshTransmissionMaterial,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

interface ShieldModelProps {
  scrollProgress?: number;
  className?: string;
}

// Animated 3D Security Orb with rings
function SecurityOrb({ scrollProgress = 0 }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Smooth rotation based on scroll
    const targetRotationY = scrollProgress * Math.PI * 2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      0.05
    );

    // Gentle floating animation
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.5) * 0.15;

    // Inner glow pulse
    if (innerRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
      innerRef.current.scale.setScalar(scale);
    }

    // Ring rotations
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += 0.003;
      ring1Ref.current.rotation.z += 0.002;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += 0.004;
      ring2Ref.current.rotation.x -= 0.001;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z -= 0.003;
      ring3Ref.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
        {/* Main glass sphere */}
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[1.3, 4]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            resolution={512}
            transmission={0.95}
            roughness={0.05}
            thickness={0.5}
            ior={1.5}
            chromaticAberration={0.06}
            anisotropy={0.1}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.2}
            clearcoat={1}
            attenuationDistance={0.5}
            attenuationColor="#3b82f6"
            color="#60a5fa"
          />
        </mesh>

        {/* Inner glowing core */}
        <mesh ref={innerRef}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={3}
            toneMapped={false}
          />
        </mesh>

        {/* Primary ring */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.04, 16, 100]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={1}
            metalness={1}
            roughness={0}
            toneMapped={false}
          />
        </mesh>

        {/* Secondary ring */}
        <mesh
          ref={ring2Ref}
          rotation={[Math.PI / 3, Math.PI / 4, 0]}
        >
          <torusGeometry args={[2.1, 0.03, 16, 100]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0}
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </mesh>

        {/* Tertiary ring */}
        <mesh
          ref={ring3Ref}
          rotation={[-Math.PI / 4, Math.PI / 6, Math.PI / 3]}
        >
          <torusGeometry args={[2.4, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#a855f7"
            emissiveIntensity={0.6}
            metalness={1}
            roughness={0}
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </mesh>

        {/* Outer dots/nodes on rings */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 6) * Math.PI * 2) * 1.8,
              0,
              Math.sin((i / 6) * Math.PI * 2) * 1.8,
            ]}
          >
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#60a5fa"
              emissive="#3b82f6"
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        ))}
      </Float>

      {/* Sparkle particles */}
      <Sparkles
        count={60}
        scale={5}
        size={3}
        speed={0.4}
        opacity={0.7}
        color="#60a5fa"
      />

      {/* Secondary particles */}
      <Sparkles
        count={40}
        scale={6}
        size={2}
        speed={0.2}
        opacity={0.5}
        color="#a855f7"
      />
    </group>
  );
}

// Scene component with lighting
function Scene({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-5, 3, -5]} intensity={1} color="#8b5cf6" />
      <pointLight position={[5, -3, 2]} intensity={0.8} color="#06b6d4" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        color="#3b82f6"
      />

      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Main 3D object */}
      <SecurityOrb scrollProgress={scrollProgress} />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />
    </>
  );
}

// Main export component
export function ShieldModel({
  scrollProgress = 0,
  className = "",
}: ShieldModelProps) {
  return (
    <div className={`w-full h-full min-h-100 ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
      >
        <Scene scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}

// Static fallback for mobile/reduced motion
export function ShieldModelFallback({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`w-full h-full min-h-100 flex items-center justify-center ${className}`}
    >
      <div className="relative">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -m-12">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-purple-500/20 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-500/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Modern orb with rings */}
        <div className="relative w-56 h-56">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
            <defs>
              <linearGradient
                id="orbGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient
                id="coreGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <radialGradient id="glassGradient" cx="30%" cy="30%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0.1)" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="strongGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Outer ring 3 */}
            <ellipse
              cx="50"
              cy="50"
              rx="46"
              ry="18"
              fill="none"
              stroke="url(#orbGradient)"
              strokeWidth="0.8"
              opacity="0.4"
              transform="rotate(-20 50 50)"
              className="animate-spin"
              style={{
                animationDuration: "25s",
                transformOrigin: "50% 50%",
              }}
            />

            {/* Outer ring 2 */}
            <ellipse
              cx="50"
              cy="50"
              rx="42"
              ry="42"
              fill="none"
              stroke="#a855f7"
              strokeWidth="0.5"
              opacity="0.5"
              className="animate-spin"
              style={{
                animationDuration: "20s",
                animationDirection: "reverse",
                transformOrigin: "50% 50%",
              }}
            />

            {/* Outer ring 1 */}
            <ellipse
              cx="50"
              cy="50"
              rx="38"
              ry="15"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1"
              opacity="0.7"
              transform="rotate(60 50 50)"
              className="animate-spin"
              style={{
                animationDuration: "15s",
                transformOrigin: "50% 50%",
              }}
            />

            {/* Main orb - glass effect */}
            <circle
              cx="50"
              cy="50"
              r="28"
              fill="url(#glassGradient)"
              stroke="url(#orbGradient)"
              strokeWidth="1.5"
              filter="url(#glow)"
            />

            {/* Inner core */}
            <circle
              cx="50"
              cy="50"
              r="12"
              fill="url(#coreGradient)"
              filter="url(#strongGlow)"
              className="animate-pulse"
            />

            {/* Highlight */}
            <ellipse
              cx="42"
              cy="42"
              rx="8"
              ry="5"
              fill="rgba(255,255,255,0.3)"
              transform="rotate(-30 42 42)"
            />

            {/* Ring nodes */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <circle
                key={i}
                cx={50 + Math.cos((angle * Math.PI) / 180) * 38}
                cy={50 + Math.sin((angle * Math.PI) / 180) * 15}
                r="2"
                fill="#60a5fa"
                filter="url(#glow)"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </svg>

          {/* Floating particles */}
          <div
            className="absolute top-0 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-70"
            style={{ animationDelay: "0s", animationDuration: "2s" }}
          />
          <div
            className="absolute top-1/4 right-0 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce opacity-70"
            style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
          />
          <div
            className="absolute bottom-1/4 left-0 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce opacity-70"
            style={{ animationDelay: "1s", animationDuration: "2s" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-70"
            style={{ animationDelay: "1.5s", animationDuration: "2.5s" }}
          />
          <div
            className="absolute top-1/2 left-0 w-1 h-1 bg-blue-300 rounded-full animate-ping opacity-50"
            style={{ animationDelay: "0.3s" }}
          />
          <div
            className="absolute top-1/2 right-0 w-1 h-1 bg-cyan-300 rounded-full animate-ping opacity-50"
            style={{ animationDelay: "0.8s" }}
          />
        </div>
      </div>
    </div>
  );
}
