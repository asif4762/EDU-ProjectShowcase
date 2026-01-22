"use client"

import { useRef, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Float,
  Stars,
  Sparkles,
  Environment,
  Center,
} from "@react-three/drei"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import * as THREE from "three"

function CameraRig() {
  const { camera, mouse } = useThree()
  const vec = new THREE.Vector3()

  useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 1, 12), 0.05)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function ChessKing({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
      <group position={position}>
        <mesh position={[0, -1, 0]} castShadow>
          <cylinderGeometry args={[0.8, 1, 0.3, 32] as any} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.7, 1.5, 32] as any} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.5, 0.6, 32] as any} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.1, 0]} castShadow>
          <sphereGeometry args={[0.5, 32, 32] as any} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[0.15, 0.8, 0.15] as any} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[0.6, 0.15, 0.15] as any} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </mesh>
        <pointLight color={color} intensity={2} distance={5} />
      </group>
    </Float>
  )
}

function ChessPawn({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
      <group position={position}>
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.6, 0.2, 32] as any} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.4, 0.8, 32] as any} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.35, 32, 32] as any} />
          <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
        </mesh>
        <pointLight color={color} intensity={1.5} distance={4} />
      </group>
    </Float>
  )
}

function FloatingDie({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.3
      groupRef.current.rotation.y += delta * 0.4
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <group ref={groupRef} position={position}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 1.2, 1.2] as any} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.1}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0, 0.61]}>
          <sphereGeometry args={[0.12, 16, 16] as any} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        {[-0.3, 0, 0.3].map((y, yi) =>
          [-0.3, 0.3].map((x, i) => (
            <mesh key={`${yi}-${i}`} position={[x, y, -0.61]}>
              <sphereGeometry args={[0.08, 16, 16] as any} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          ))
        )}
        <pointLight color="#ffffff" intensity={1} distance={3} />
      </group>
    </Float>
  )
}

function PlayingCard({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={1}>
      <group position={position} rotation={[0, 0.3, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 1.8, 0.02] as any} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[1.1, 1.7] as any} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.5, 0.012]}>
          <circleGeometry args={[0.15, 32] as any} />
          <meshStandardMaterial color={color} />
        </mesh>
        <pointLight color={color} intensity={1.5} distance={4} />
      </group>
    </Float>
  )
}

function GameController({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  return (
    <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.2}>
      <group position={position} rotation={[0.3, 0.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2, 1, 0.4] as any} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[-0.8, -0.3, 0]} rotation={[0, 0, 0.3]} castShadow>
          <boxGeometry args={[0.6, 0.8, 0.4] as any} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[0.8, -0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.6, 0.8, 0.4] as any} />
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
        </mesh>
        {[-0.3, 0, 0.3].map((x, i) => (
          <mesh key={i} position={[x, 0.2, 0.21]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 32] as any} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
        <pointLight color={color} intensity={2} distance={5} />
      </group>
    </Float>
  )
}

function CheckersPiece({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={1.2}>
      <group position={position}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.65, 0.15, 32] as any} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.6, 0.2, 32] as any} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.2, 0]} castShadow>
          <torusGeometry args={[0.3, 0.05, 16, 32] as any} />
          <meshStandardMaterial
            color="#ffd700"
            metalness={0.9}
            roughness={0.1}
            emissive="#ffd700"
            emissiveIntensity={0.3}
          />
        </mesh>
        <pointLight color={color} intensity={1.2} distance={3} />
      </group>
    </Float>
  )
}

function Hero3DScene() {
  return (
    <>
      <CameraRig />
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={10}
        castShadow
        color="#ffffff"
      />
      <pointLight position={[-10, -10, -10]} intensity={2} color="#ec4899" />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={150} scale={20} size={4} speed={0.4} opacity={0.5} color="#22c55e" />
      
      <Center>
        <ChessKing position={[0, -0.5, 0]} color="#ffffff" />
      </Center>
      <ChessPawn position={[-3.5, 0, 2]} color="#22c55e" />
      <ChessPawn position={[3.5, 1, -2]} color="#ec4899" />
      <FloatingDie position={[-2.5, 2.5, -1]} />
      <FloatingDie position={[2.5, -2, 1]} />
      <PlayingCard position={[-5, -1, -3]} color="#ef4444" />
      <PlayingCard position={[4.5, 2.5, -4]} color="#3b82f6" />
      <GameController position={[-4, 3, 1]} color="#8b5cf6" />
      <GameController position={[5, -2.5, 2]} color="#f59e0b" />
      <CheckersPiece position={[1.5, 3, -2]} color="#dc2626" />
      <CheckersPiece position={[-1.5, -3, 1.5]} color="#171717" />
      
      <EffectComposer>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
        <ChromaticAberration offset={[0.002, 0.002] as any} />
      </EffectComposer>
    </>
  )
}

export default function Hero3DCanvas() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 0, 12], fov: 45 }}
      dpr={[1, 2]}
      gl={{ 
        antialias: false,
        powerPreference: "high-performance"
      }}
    >
      <color attach="background" args={["#050505"] as any} />
      <fog attach="fog" args={["#050505", 10, 40] as any} />
      <Suspense fallback={null}>
        <Hero3DScene />
      </Suspense>
    </Canvas>
  )
}