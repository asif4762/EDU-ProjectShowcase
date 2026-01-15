"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sparkles, Stars } from "@react-three/drei"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Target, SparklesIcon } from "lucide-react"
import type * as THREE from "three"

function FloatingGem() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.5, 0]} />
        <MeshDistortMaterial
          color="#00d4ff"
          attach="material"
          distort={0.2}
          speed={2}
          roughness={0.1}
          metalness={0.95}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  )
}

const visionPoints = [
  {
    icon: Zap,
    title: "Learn Faster",
    description: "Jump into any game without spending hours on rulebooks",
  },
  {
    icon: Target,
    title: "Make Better Decisions",
    description: "Get strategic insights and move suggestions in real-time",
  },
  {
    icon: SparklesIcon,
    title: "Enjoy Deeper Gameplay",
    description: "Focus on fun and strategy, not rule confusion",
  },
]

export function VisionSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="vision" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Canvas>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
              🌱 Our Vision
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
              Universal AI Companion for <span className="text-primary">Tabletop Games</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              game.AI aims to become the go-to AI companion for all tabletop games, helping players around the world
              experience the joy of gaming without barriers.
            </p>

            <div className="space-y-6 mb-10">
              {visionPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <point.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{point.title}</h3>
                    <p className="text-muted-foreground text-sm">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                Get Started Today <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* 3D Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] lg:h-[500px]"
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff6b9d" />
                <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} intensity={1} />
                <FloatingGem />
                <Sparkles count={50} scale={6} size={3} speed={0.3} color="#00d4ff" />
              </Suspense>
            </Canvas>

            {/* Glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-primary/30 rounded-full blur-[100px]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
