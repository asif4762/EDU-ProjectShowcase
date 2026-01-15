"use client"

import { Suspense, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, Torus, MeshDistortMaterial, Ring } from "@react-three/drei"
import { motion, useInView } from "framer-motion"
import type * as THREE from "three"

const steps = [
  {
    number: "01",
    title: "Rule Ingestion",
    description: "User uploads a PDF rulebook. The AI processes and understands the complete game mechanics.",
    color: "#00d4ff",
  },
  {
    number: "02",
    title: "Rule Understanding",
    description:
      "Gemini analyzes the PDF to understand game mechanics, identify components, and generate game-specific behavior.",
    color: "#ff6b9d",
  },
  {
    number: "03",
    title: "Live Game Interface",
    description: "Access webcam feed of the board, voice input, and real-time interaction log all in one place.",
    color: "#7c3aed",
  },
  {
    number: "04",
    title: "Player Interaction",
    description: "Hold the backtick key and speak. The system captures transcribed audio and current board image.",
    color: "#00d4ff",
  },
  {
    number: "05",
    title: "AI Analysis & Response",
    description:
      "Gemini receives your question, board image, and game rules context to provide accurate clarifications and suggestions.",
    color: "#ff6b9d",
  },
]

function AnimatedRings() {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)
  const ring3 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.3
      ring1.current.rotation.y = t * 0.2
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.2
      ring2.current.rotation.z = t * 0.3
    }
    if (ring3.current) {
      ring3.current.rotation.y = t * 0.4
      ring3.current.rotation.z = -t * 0.2
    }
  })

  return (
    <group>
      <Float speed={1} rotationIntensity={0.3}>
        <Torus ref={ring1} args={[2, 0.1, 16, 100]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#00d4ff" metalness={0.9} roughness={0.1} />
        </Torus>
      </Float>
      <Float speed={1.5} rotationIntensity={0.4}>
        <Torus ref={ring2} args={[2.5, 0.08, 16, 100]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#ff6b9d" metalness={0.9} roughness={0.1} />
        </Torus>
      </Float>
      <Float speed={2} rotationIntensity={0.5}>
        <Ring ref={ring3} args={[1.3, 1.5, 64]} position={[0, 0, 0]}>
          <MeshDistortMaterial color="#7c3aed" distort={0.2} speed={3} roughness={0.2} metalness={0.8} />
        </Ring>
      </Float>

      {/* Center Sphere */}
      <Float speed={2} floatIntensity={0.5}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <MeshDistortMaterial color="#00d4ff" distort={0.3} speed={2} roughness={0.1} metalness={0.9} />
        </mesh>
      </Float>
    </group>
  )
}

export function HowItWorksSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="how-it-works" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            🔄 How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Simple <span className="text-primary">5-Step</span> Process
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From uploading rules to getting real-time advice in minutes
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* 3D Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="relative h-[400px] lg:h-[500px] order-2 lg:order-1"
          >
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00d4ff" />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ff6b9d" />
                <AnimatedRings />
              </Suspense>
            </Canvas>
          </motion.div>

          {/* Steps */}
          <div className="space-y-6 order-1 lg:order-2">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group flex gap-4"
              >
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${step.color}20`, color: step.color }}
                >
                  {step.number}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-lg text-foreground mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
