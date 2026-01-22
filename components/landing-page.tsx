"use client"

import type React from "react"
import { useRef, Suspense, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import {
  Float,
  Stars,
  Sparkles,
  Environment,
  MeshTransmissionMaterial,
  Center,
} from "@react-three/drei"
import { EffectComposer, Bloom, ChromaticAberration } from "@react-three/postprocessing"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"
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

// --- 3D Components ---

function CameraRig() {
  const { camera, mouse } = useThree()
  const vec = new THREE.Vector3()

  useFrame(() => {
    camera.position.lerp(vec.set(mouse.x * 2, mouse.y * 1, 12), 0.05)
    camera.lookAt(0, 0, 0)
  })
  return null
}

// Realistic Chess King Piece
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
        {/* Base */}
        <mesh position={[0, -1, 0]} castShadow>
          <cylinderGeometry args={[0.8, 1, 0.3, 32] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Body */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.7, 1.5, 32] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Neck */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.5, 0.6, 32] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1.1, 0]} castShadow>
          <sphereGeometry args={[0.5, 32, 32] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        
        {/* Cross - Vertical */}
        <mesh position={[0, 1.8, 0]} castShadow>
          <boxGeometry args={[0.15, 0.8, 0.15] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        
        {/* Cross - Horizontal */}
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[0.6, 0.15, 0.15] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Glowing aura */}
        <pointLight color={color} intensity={2} distance={5} />
      </group>
    </Float>
  )
}

// Chess Pawn
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
        {/* Base */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.6, 0.2, 32] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Body */}
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.4, 0.8, 32] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <sphereGeometry args={[0.35, 32, 32] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        <pointLight color={color} intensity={1.5} distance={4} />
      </group>
    </Float>
  )
}

// Realistic Dice with Dots
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
        {/* Main dice body */}
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

        {/* Dots on faces */}
        {/* Face 1 - Center dot */}
        <mesh position={[0, 0, 0.61]}>
          <sphereGeometry args={[0.12, 16, 16] as any} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        {/* Face 6 - Six dots */}
        {[-0.3, 0, 0.3].map((y, yi) =>
          [-0.3, 0.3].map((x, i) => (
            <mesh key={`${yi}-${i}`} position={[x, y, -0.61]}>
              <sphereGeometry args={[0.08, 16, 16] as any} />
              <meshStandardMaterial color="#000000" />
            </mesh>
          ))
        )}

        {/* Face 3 - Three dots diagonal */}
        {[-0.3, 0, 0.3].map((v, i) => (
          <mesh key={`3-${i}`} position={[0.61, v, v]}>
            <sphereGeometry args={[0.08, 16, 16] as any} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        ))}

        {/* Rounded edges effect */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.2, 1.2, 1.2)] as any} />
          <lineBasicMaterial color="#cccccc" linewidth={2} />
        </lineSegments>

        <pointLight color="#ffffff" intensity={1} distance={3} />
      </group>
    </Float>
  )
}

// Playing Card
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
        {/* Card body */}
        <mesh castShadow>
          <boxGeometry args={[1.2, 1.8, 0.02] as any} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.2}
            roughness={0.1}
          />
        </mesh>
        
        {/* Card border */}
        <mesh position={[0, 0, 0.011]}>
          <planeGeometry args={[1.1, 1.7] as any} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Suit symbols */}
        <mesh position={[0, 0.5, 0.012]}>
          <circleGeometry args={[0.15, 32] as any} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, -0.5, 0.012]}>
          <circleGeometry args={[0.15, 32] as any} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* Glowing edge */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.2, 1.8, 0.02)] as any} />
          <lineBasicMaterial color={color} linewidth={2} />
        </lineSegments>

        <pointLight color={color} intensity={1.5} distance={4} />
      </group>
    </Float>
  )
}

// Game Controller
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
        {/* Main body */}
        <mesh castShadow>
          <boxGeometry args={[2, 1, 0.4] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>

        {/* Left grip */}
        <mesh position={[-0.8, -0.3, 0]} rotation={[0, 0, 0.3]} castShadow>
          <boxGeometry args={[0.6, 0.8, 0.4] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>

        {/* Right grip */}
        <mesh position={[0.8, -0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
          <boxGeometry args={[0.6, 0.8, 0.4] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>

        {/* Buttons */}
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

        {/* D-pad */}
        <mesh position={[-0.5, 0, 0.21]} castShadow>
          <boxGeometry args={[0.15, 0.4, 0.1] as any} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[-0.5, 0, 0.21]} castShadow>
          <boxGeometry args={[0.4, 0.15, 0.1] as any} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        <pointLight color={color} intensity={2} distance={5} />
      </group>
    </Float>
  )
}

// Checkers Piece
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
        {/* Bottom disc */}
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.65, 0.15, 32] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>

        {/* Top disc */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.55, 0.6, 0.2, 32] as any} />
          <meshStandardMaterial
            color={color}
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>

        {/* Crown for king */}
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

      {/* Cinematic Lighting */}
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

      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={150} scale={20} size={4} speed={0.4} opacity={0.5} color="#22c55e" />

      {/* Main Center Piece - Chess King */}
      <Center>
        <ChessKing position={[0, -0.5, 0]} color="#ffffff" />
      </Center>

      {/* Chess Pawns */}
      <ChessPawn position={[-3.5, 0, 2]} color="#22c55e" />
      <ChessPawn position={[3.5, 1, -2]} color="#ec4899" />

      {/* Dice */}
      <FloatingDie position={[-2.5, 2.5, -1]} />
      <FloatingDie position={[2.5, -2, 1]} />

      {/* Playing Cards */}
      <PlayingCard position={[-5, -1, -3]} color="#ef4444" />
      <PlayingCard position={[4.5, 2.5, -4]} color="#3b82f6" />

      {/* Game Controllers */}
      <GameController position={[-4, 3, 1]} color="#8b5cf6" />
      <GameController position={[5, -2.5, 2]} color="#f59e0b" />

      {/* Checkers Pieces */}
      <CheckersPiece position={[1.5, 3, -2]} color="#dc2626" />
      <CheckersPiece position={[-1.5, -3, 1.5]} color="#171717" />

      {/* Post Processing Pipeline */}
      <EffectComposer>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={1.5} radius={0.6} />
        <ChromaticAberration offset={[0.002, 0.002] as any} />
      </EffectComposer>
    </>
  )
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <span className="text-muted-foreground">Loading 3D Experience...</span>
      </div>
    </div>
  )
}

// --- Data & Logic ---

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
  {
    icon: Brain,
    title: "AI Coach",
    description: "Get real-time strategic suggestions powered by Google Gemini",
  },
  {
    icon: Zap,
    title: "Move Predictions",
    description: "See the best possible moves and their winning probability",
  },
  {
    icon: Mic,
    title: "Voice Commands",
    description: "Ask questions and get advice using voice input",
  },
  {
    icon: Eye,
    title: "Game Analysis",
    description: "Post-game analysis to improve your skills",
  },
]

const categories = ["all", "strategy", "puzzle", "board", "party"] as const

export function LandingPage({
  onStartGame,
}: {
  onStartGame: (game: GameType) => void
}) {
  const [mounted, setMounted] = useState(false)
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categories)[number]>("all")
  const [hoveredGame, setHoveredGame] = useState<GameType | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredGames =
    selectedCategory === "all"
      ? games
      : games.filter((g) => g.category === selectedCategory)

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
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white to-transparent h-[200%] animate-[scanline_8s_linear_infinite]" />
      </div>

      {/* 3D Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[#050505] z-0">
          {mounted && (
            <Suspense fallback={<LoadingFallback />}>
              <Canvas
                shadows
                camera={{ position: [0, 0, 12], fov: 45 }}
                dpr={[1, 2]}
                gl={{ antialias: false }}
              >
                <color attach="background" args={["#050505"] as any} />
                <fog attach="fog" args={["#050505", 10, 40] as any} />
                <Hero3DScene />
              </Canvas>
            </Suspense>
          )}
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-background pointer-events-none z-10" />
        <div className="absolute inset-0 bg-linear-to-r from-background/50 via-transparent to-background/50 pointer-events-none z-10" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 z-20 pointer-events-none">
          {/* Allow pointer events only on interactive elements */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mt-32 pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-primary font-medium">
                Powered by Google Gemini
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4">
              <span className="bg-linear-to-r from-primary via-white to-accent bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                GAME.AI
              </span>
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
              YOUR AI GAME COACH
            </h2>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 drop-shadow-sm">
              Play 10+ classic games with an AI coach that provides real-time
              suggestions, move predictions, and strategic analysis.
            </p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-linear-to-r from-primary to-emerald-400 hover:from-primary/90 hover:to-emerald-400/90 text-primary-foreground shadow-lg shadow-primary/25 border-0"
                onClick={() => onStartGame("chess")}
              >
                <Gamepad2 className="mr-2 h-5 w-5" />
                Start Playing
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-primary/30 hover:bg-primary/10 bg-background/20 backdrop-blur-md text-white"
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
              <Badge
                variant="secondary"
                className="bg-black/40 backdrop-blur border border-white/10 text-white"
              >
                <Crown className="w-3 h-3 mr-1" /> 10+ Games
              </Badge>
              <Badge
                variant="secondary"
                className="bg-black/40 backdrop-blur border border-white/10 text-white"
              >
                <Brain className="w-3 h-3 mr-1" /> AI Powered
              </Badge>
              <Badge
                variant="secondary"
                className="bg-black/40 backdrop-blur border border-white/10 text-white"
              >
                <Zap className="w-3 h-3 mr-1" /> Real-time Tips
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Game Selection Section */}
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
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-card/50 hover:bg-card"
                  }
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </motion.div>

          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
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
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${game.color}15, transparent 70%)`,
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
                          <div style={{ borderColor: `${game.color}50`, color: game.color }}>
                            <Badge
                                variant="outline"
                                className="text-xs border-current"
                            >
                                {game.difficulty}
                            </Badge>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                          {game.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {game.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {game.players} Players
                          </span>
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
      <section className="relative py-32 px-4 bg-linear-to-b from-background via-card/50 to-background">
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
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
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
            <div className="absolute inset-0 bg-linear-to-r from-primary/30 via-accent/30 to-primary/30 rounded-3xl blur-3xl" />
            <div className="relative bg-card border border-border rounded-3xl p-12 md:p-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ready to <span className="text-primary">Level Up</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Start playing now and let our AI coach help you master any game.
                No signup required - just pick a game and start winning.
              </p>
              <Button
                size="lg"
                className="text-lg px-12 py-6 bg-linear-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-xl shadow-primary/20"
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
          <p className="text-sm text-muted-foreground">
            Powered by EDU ARM. 10+ Games with AI Coaching.
          </p>
        </div>
      </footer>
    </motion.div>
  )
}