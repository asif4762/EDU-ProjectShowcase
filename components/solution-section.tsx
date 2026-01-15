"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, RoundedBox } from "@react-three/drei"
import { motion, useInView } from "framer-motion"
import { FileText, Camera, Mic, Eye } from "lucide-react"
import type * as THREE from "three"

function FloatingCube() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <RoundedBox ref={meshRef} args={[2, 2, 2]} radius={0.2} smoothness={4}>
        <MeshDistortMaterial
          color="#00d4ff"
          attach="material"
          distort={0.2}
          speed={2}
          roughness={0.1}
          metalness={0.9}
        />
      </RoundedBox>
    </Float>
  )
}

const solutions = [
  {
    icon: FileText,
    title: "PDF Rule Parsing",
    description: "Upload any rulebook and AI instantly understands all mechanics",
  },
  {
    icon: Camera,
    title: "Live Game Vision",
    description: "Observes the game board via camera in real-time",
  },
  {
    icon: Mic,
    title: "Voice Queries",
    description: "Ask natural questions through voice commands",
  },
  {
    icon: Eye,
    title: "Smart Analysis",
    description: "Provides instant rule clarifications and strategic advice",
  },
]

export function SolutionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* 3D Element */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-100 lg:h-125 order-2 lg:order-1"
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b9d" />
                <FloatingCube />
              </Suspense>
            </Canvas>

            {/* Glow Effect */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              💡 The Solution
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              AI-Powered <span className="text-primary">Game Coach</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              game.AI is your intelligent companion that transforms how you learn and play board games.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <solution.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{solution.title}</h3>
                    <p className="text-muted-foreground text-sm">{solution.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
