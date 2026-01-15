"use client"

import type React from "react"

import { useRef, Suspense, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Stars, Sparkles } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import type * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Crown,
  Target,
  Grid3X3,
  ChevronRight,
  Zap,
  Brain,
  Mic,
  Eye,
  Loader2,
  Circle,
  Layers,
  Dices,
  Puzzle,
  Gamepad2,
  Bomb,
  Hash,
  FlipHorizontal,
} from "lucide-react"
import type { GameType, GameConfig } from "@/lib/game-types"

function FloatingChessPiece({
  position,
  scale = 1,
  color,
}: { position: [number, number, number]; scale?: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group ref={meshRef} position={position} scale={scale}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.5, 1.5, 16]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

function FloatingKing({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={3}>
      <group ref={meshRef} position={position}>
        <mesh>
          <cylinderGeometry args={[0.4, 0.6, 2, 16]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.5, 0.15, 0.15]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </Float>
  )
}

function FloatingDice({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.7
    }
  })

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
    </Float>
  )
}

function FloatingToken({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.8
    }
  })

  return (
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={2.5}>
      <group ref={meshRef} position={position}>
        <mesh>
          <coneGeometry args={[0.3, 0.8, 16]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.2, 16]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </Float>
  )
}

function AnimatedSphere({
  position,
  color,
  speed = 1,
}: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.8, 32, 32]} />
      <MeshDistortMaterial color={color} speed={2} distort={0.3} metalness={0.8} roughness={0.2} />
    </mesh>
  )
}

function Hero3DScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#22c55e" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ec4899" />
      <pointLight position={[5, -5, 10]} intensity={0.6} color="#f59e0b" />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1.5} color="#ffffff" />

      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={80} scale={15} size={3} speed={0.4} color="#22c55e" />

      <FloatingKing position={[0, 0, 0]} color="#22c55e" />
      <FloatingChessPiece position={[-4, -1, -2]} color="#ec4899" scale={0.8} />
      <FloatingChessPiece position={[4, 1, -3]} color="#ffffff" scale={0.7} />
      <FloatingDice position={[-3, 2, -4]} color="#f59e0b" />
      <FloatingDice position={[5, -1, -2]} color="#3b82f6" />
      <FloatingToken position={[3, -2, -3]} color="#ef4444" />
      <FloatingToken position={[-5, 1, -3]} color="#8b5cf6" />

      <AnimatedSphere position={[-6, 0, -5]} color="#22c55e" speed={0.8} />
      <AnimatedSphere position={[6, -1, -4]} color="#ec4899" speed={1.2} />
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <span className="text-muted-foreground">Loading 3D Scene...</span>
      </div>
    </div>
  )
}

const games: GameConfig[] = [
  {
    id: "chess",
    name: "Chess",
    description: "Classic strategy - outsmart your opponent",
    category: "strategy",
    players: "1-2",
    difficulty: "hard",
    color: "#22c55e",
  },
  {
    id: "checkers",
    name: "Checkers",
    description: "Jump and capture all pieces",
    category: "strategy",
    players: "1-2",
    difficulty: "medium",
    color: "#3b82f6",
  },
  {
    id: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    description: "Quick match - 3 in a row wins",
    category: "strategy",
    players: "1-2",
    difficulty: "easy",
    color: "#8b5cf6",
  },
  {
    id: "connect-four",
    name: "Connect Four",
    description: "Drop discs to connect 4",
    category: "strategy",
    players: "1-2",
    difficulty: "medium",
    color: "#ef4444",
  },
  {
    id: "memory",
    name: "Memory Match",
    description: "Find all matching pairs",
    category: "puzzle",
    players: "1-4",
    difficulty: "easy",
    color: "#f59e0b",
  },
  {
    id: "snake-ladders",
    name: "Snake & Ladders",
    description: "Race to the finish with dice",
    category: "board",
    players: "2-4",
    difficulty: "easy",
    color: "#10b981",
  },
  {
    id: "ludo",
    name: "Ludo",
    description: "Roll dice and race home",
    category: "party",
    players: "2-4",
    difficulty: "easy",
    color: "#ec4899",
  },
  {
    id: "reversi",
    name: "Reversi",
    description: "Flip tiles to dominate",
    category: "strategy",
    players: "1-2",
    difficulty: "hard",
    color: "#06b6d4",
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    description: "Clear the field safely",
    category: "puzzle",
    players: "1",
    difficulty: "medium",
    color: "#64748b",
  },
  {
    id: "2048",
    name: "2048",
    description: "Merge tiles to reach 2048",
    category: "puzzle",
    players: "1",
    difficulty: "medium",
    color: "#eab308",
  },
]

const gameIcons: Record<GameType, React.ElementType> = {
  chess: Crown,
  checkers: Target,
  "tic-tac-toe": Grid3X3,
  "connect-four": Circle,
  memory: Layers,
  "snake-ladders": Puzzle,
  ludo: Dices,
  reversi: FlipHorizontal,
  minesweeper: Bomb,
  "2048": Hash,
}

const features = [
  { icon: Brain, title: "AI Coach", description: "Get real-time strategic suggestions powered by Google Gemini" },
  { icon: Zap, title: "Move Predictions", description: "See the best possible moves and their winning probability" },
  { icon: Mic, title: "Voice Commands", description: "Ask questions and get advice using voice input" },
  { icon: Eye, title: "Game Analysis", description: "Post-game analysis to improve your skills" },
]

const categories = ["all", "strategy", "puzzle", "board", "party"] as const

export function LandingPage({ onStartGame }: { onStartGame: (game: GameType) => void }) {
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>("all")
  const [hoveredGame, setHoveredGame] = useState<GameType | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredGames = selectedCategory === "all" ? games : games.filter((g) => g.category === selectedCategory)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen bg-background"
    >
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden opacity-[0.03]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent h-[200%] animate-[scanline_8s_linear_infinite]" />
      </div>

      {/* 3D Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-background">
          {mounted && (
            <Suspense fallback={<LoadingFallback />}>
              <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 2]}>
                <color attach="background" args={["#0a0a14"]} />
                <fog attach="fog" args={["#0a0a14", 10, 50]} />
                <Hero3DScene />
              </Canvas>
            </Suspense>
          )}
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50 pointer-events-none" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mt-32"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">Powered by Google Gemini</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4">
              <span className="bg-gradient-to-r from-primary via-white to-accent bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                GAME.AI
              </span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">YOUR AI GAME COACH</h2>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Play 10+ classic games with an AI coach that provides real-time suggestions, move predictions, and
              strategic analysis.
            </p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-emerald-400 hover:from-primary/90 hover:to-emerald-400/90 text-primary-foreground shadow-lg shadow-primary/25"
                onClick={() => onStartGame("chess")}
              >
                <Gamepad2 className="mr-2 h-5 w-5" />
                Start Playing
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/10 bg-background/50 backdrop-blur"
              >
                Watch Demo
              </Button>
            </motion.div>

            {/* Game count badges */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              <Badge variant="secondary" className="bg-card/50 backdrop-blur border border-border">
                <Crown className="w-3 h-3 mr-1" /> 10+ Games
              </Badge>
              <Badge variant="secondary" className="bg-card/50 backdrop-blur border border-border">
                <Brain className="w-3 h-3 mr-1" /> AI Powered
              </Badge>
              <Badge variant="secondary" className="bg-card/50 backdrop-blur border border-border">
                <Zap className="w-3 h-3 mr-1" /> Real-time Tips
              </Badge>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-sm">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                className="w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex items-start justify-center p-2"
              >
                <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-32 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Choose Your <span className="text-primary">Arena</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              Select a game and let our AI coach guide you to victory
            </p>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category ? "bg-primary text-primary-foreground" : "bg-card/50 hover:bg-card"
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </motion.div>

          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game, index) => {
                const GameIcon = gameIcons[game.id]
                return (
                  <motion.div
                    key={game.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    onClick={() => onStartGame(game.id)}
                    onMouseEnter={() => setHoveredGame(game.id)}
                    onMouseLeave={() => setHoveredGame(null)}
                    className="group relative cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ backgroundColor: `${game.color}33` }}
                    />
                    <div className="relative bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/50 transition-all duration-300 overflow-hidden">
                      {/* Animated background gradient on hover */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${game.color}, transparent 70%)`,
                        }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors"
                            style={{ backgroundColor: `${game.color}20` }}
                          >
                            <GameIcon
                              className="w-6 h-6 transition-transform group-hover:scale-110"
                              style={{ color: game.color }}
                            />
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs"
                            style={{ borderColor: `${game.color}50`, color: game.color }}
                          >
                            {game.difficulty}
                          </Badge>
                        </div>

                        <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                          {game.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">{game.description}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{game.players} Players</span>
                          <div className="flex items-center text-primary font-medium text-sm">
                            Play
                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-background via-card/50 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              AI-Powered <span className="text-accent">Features</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the future of gaming with cutting-edge AI assistance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-6 h-full hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-3xl blur-3xl" />
            <div className="relative bg-card border border-border rounded-3xl p-12 md:p-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to <span className="text-primary">Level Up</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start playing now and let our AI coach help you master any game. No signup required - just pick a game
                and start winning.
              </p>
              <Button
                size="lg"
                className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-xl shadow-primary/20"
                onClick={() => onStartGame("chess")}
              >
                Enter the Arena
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-primary" />
            <span className="font-bold text-lg">GAME.AI</span>
          </div>
          <p className="text-sm text-muted-foreground">Powered by Google Gemini. 10+ Games with AI Coaching.</p>
        </div>
      </footer>
    </motion.div>
  )
}
