"use client"

import type React from "react"

import { useState, useCallback, Suspense } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Environment, Stars, OrbitControls, ContactShadows, Sparkles } from "@react-three/drei"
import {
  ArrowLeft,
  MessageSquare,
  RotateCcw,
  Crown,
  Target,
  Grid3X3,
  Circle,
  Layers,
  Dices,
  Puzzle,
  FlipHorizontal,
  Bomb,
  Hash,
  Loader2,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChessGame } from "@/components/games/chess-game"
import { CheckersGame } from "@/components/games/checkers-game"
import { TicTacToeGame } from "@/components/games/tic-tac-toe-game"
import { ConnectFourGame } from "@/components/games/connect-four-game"
import { MemoryGame } from "@/components/games/memory-game"
import { SnakeLaddersGame } from "@/components/games/snake-ladders-game"
import { LudoGame } from "@/components/games/ludo-game"
import { ReversiGame } from "@/components/games/reversi-game"
import { MinesweeperGame } from "@/components/games/minesweeper-game"
import { Game2048 } from "@/components/games/game-2048"
import { AICoachPanel } from "@/components/ai-coach-panel"
import type { GameState, GameType } from "@/lib/game-types"

const gameConfig: Record<GameType, { name: string; icon: React.ElementType; is3D: boolean; theme: string }> = {
  chess: { name: "Chess", icon: Crown, is3D: true, theme: "egyptian" },
  checkers: { name: "Checkers", icon: Target, is3D: true, theme: "classic" },
  "tic-tac-toe": { name: "Tic-Tac-Toe", icon: Grid3X3, is3D: true, theme: "neon" },
  "connect-four": { name: "Connect Four", icon: Circle, is3D: true, theme: "classic" },
  memory: { name: "Memory Match", icon: Layers, is3D: false, theme: "neon" },
  "snake-ladders": { name: "Snake & Ladders", icon: Puzzle, is3D: false, theme: "classic" },
  ludo: { name: "Ludo", icon: Dices, is3D: false, theme: "classic" },
  reversi: { name: "Reversi", icon: FlipHorizontal, is3D: true, theme: "classic" },
  minesweeper: { name: "Minesweeper", icon: Bomb, is3D: false, theme: "retro" },
  "2048": { name: "2048", icon: Hash, is3D: false, theme: "modern" },
}

function Game3DWrapper({
  game,
  gameState,
  setGameState,
  resetKey,
}: {
  game: GameType
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  resetKey: number
}) {
  const isChess = game === "chess"

  return (
    <Canvas camera={{ position: isChess ? [0, 10, 10] : [0, 8, 8], fov: 45 }} shadows gl={{ antialias: true }}>
      <color attach="background" args={[isChess ? "#0a0812" : "#0a0a14"]} />

      {/* Dramatic Egyptian lighting for chess */}
      {isChess ? (
        <>
          <ambientLight intensity={0.3} />
          {/* Main golden spotlight from above */}
          <spotLight
            position={[0, 15, 0]}
            angle={0.4}
            penumbra={0.8}
            intensity={2}
            color="#ffd700"
            castShadow
            shadow-mapSize={2048}
          />
          {/* Cyan accent light */}
          <pointLight position={[10, 5, 10]} intensity={0.8} color="#00d4ff" />
          {/* Pink accent light */}
          <pointLight position={[-10, 5, -10]} intensity={0.6} color="#ff4488" />
          {/* Rim lights */}
          <pointLight position={[8, 3, -8]} intensity={0.4} color="#d4af37" />
          <pointLight position={[-8, 3, 8]} intensity={0.4} color="#d4af37" />

          {/* Atmospheric particles */}
          <Sparkles count={100} scale={20} size={3} speed={0.2} color="#d4af37" opacity={0.3} />
        </>
      ) : (
        <>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          <pointLight position={[-10, 10, -10]} intensity={0.5} color="#22c55e" />
          <spotLight position={[0, 15, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />
        </>
      )}

      {game === "chess" && <ChessGame key={resetKey} gameState={gameState} setGameState={setGameState} />}
      {game === "checkers" && <CheckersGame key={resetKey} gameState={gameState} setGameState={setGameState} />}
      {game === "tic-tac-toe" && <TicTacToeGame key={resetKey} gameState={gameState} setGameState={setGameState} />}
      {game === "connect-four" && <ConnectFourGame key={resetKey} gameState={gameState} setGameState={setGameState} />}
      {game === "reversi" && <ReversiGame key={resetKey} gameState={gameState} setGameState={setGameState} />}

      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.6}
        scale={15}
        blur={2}
        far={10}
        color={isChess ? "#000000" : "#000000"}
      />

      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={20}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.2}
      />

      <Environment preset={isChess ? "night" : "night"} />
    </Canvas>
  )
}

export function GameArena({
  game,
  onBack,
}: {
  game: GameType
  onBack: () => void
}) {
  const [showCoach, setShowCoach] = useState(true)
  const [gameState, setGameState] = useState<GameState>({
    board: [],
    currentPlayer: "white",
    moves: [],
    status: "playing",
    selectedPiece: null,
    validMoves: [],
    score: 0,
    level: 1,
  })
  const [resetKey, setResetKey] = useState(0)

  const handleReset = useCallback(() => {
    setResetKey((prev) => prev + 1)
    setGameState({
      board: [],
      currentPlayer: "white",
      moves: [],
      status: "playing",
      selectedPiece: null,
      validMoves: [],
      score: 0,
      level: 1,
      flippedCards: [],
      matchedPairs: [],
      playerPositions: { red: 0, blue: 0, green: 0, yellow: 0 },
    })
  }, [])

  const GameIcon = gameConfig[game].icon
  const is3DGame = gameConfig[game].is3D
  const isChess = game === "chess"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen flex"
    >
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <Canvas camera={{ position: [0, 0, 30], fov: 60 }}>
          <color attach="background" args={[isChess ? "#050408" : "#0a0a14"]} />
          <ambientLight intensity={0.2} />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
          {isChess && <Sparkles count={200} scale={50} size={2} speed={0.1} color="#d4af37" opacity={0.2} />}
          <Environment preset="night" />
        </Canvas>
      </div>

      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b ${
          isChess
            ? "bg-linear-to-r from-amber-950/80 via-background/80 to-amber-950/80 border-amber-800/50"
            : "bg-background/80 border-border"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onBack} className={isChess ? "hover:bg-amber-900/50" : ""}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GameIcon className={`w-6 h-6 ${isChess ? "text-amber-400" : "text-primary"}`} />
              <span className={`font-bold text-lg ${isChess ? "text-amber-100" : ""}`}>{gameConfig[game].name}</span>
              {isChess && (
                <span className="text-xs text-amber-500 ml-2 px-2 py-0.5 rounded-full border border-amber-700 bg-amber-950/50">
                  Pharaoh Edition
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(game === "2048" || game === "minesweeper" || game === "memory") && gameState.score !== undefined && (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Score: {gameState.score}</span>
              </div>
            )}

            {(game === "chess" ||
              game === "checkers" ||
              game === "tic-tac-toe" ||
              game === "connect-four" ||
              game === "reversi") && (
              <div
                className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border ${
                  isChess ? "bg-amber-950/50 border-amber-700" : "bg-card border-border"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    gameState.currentPlayer === "white" || gameState.currentPlayer === "player1"
                      ? isChess
                        ? "bg-amber-100"
                        : "bg-white"
                      : gameState.currentPlayer === "red"
                        ? "bg-red-500"
                        : isChess
                          ? "bg-amber-900 border border-amber-700"
                          : "bg-zinc-800 border border-zinc-600"
                  }`}
                />
                <span className={`text-sm font-medium capitalize ${isChess ? "text-amber-100" : ""}`}>
                  {gameState.currentPlayer}&apos;s Turn
                </span>
              </div>
            )}

            <Button
              variant="outline"
              size="icon"
              onClick={handleReset}
              className={isChess ? "border-amber-700 hover:bg-amber-900/50" : ""}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              variant={showCoach ? "default" : "outline"}
              size="icon"
              onClick={() => setShowCoach(!showCoach)}
              className={
                showCoach
                  ? isChess
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-primary text-primary-foreground"
                  : isChess
                    ? "border-amber-700 hover:bg-amber-900/50"
                    : ""
              }
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Game Area */}
      <div className="flex-1 flex pt-16">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`flex-1 flex items-center justify-center p-4 ${showCoach ? "lg:pr-0" : ""}`}
        >
          {is3DGame ? (
            <div className="w-full max-w-2xl aspect-square rounded-xl overflow-hidden border border-border/50">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-card/50">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className={`w-10 h-10 animate-spin ${isChess ? "text-amber-400" : "text-primary"}`} />
                      <span className="text-sm text-muted-foreground">Loading game...</span>
                    </div>
                  </div>
                }
              >
                <Game3DWrapper game={game} gameState={gameState} setGameState={setGameState} resetKey={resetKey} />
              </Suspense>
            </div>
          ) : (
            <div className="w-full max-w-2xl">
              {game === "memory" && <MemoryGame key={resetKey} gameState={gameState} setGameState={setGameState} />}
              {game === "snake-ladders" && (
                <SnakeLaddersGame key={resetKey} gameState={gameState} setGameState={setGameState} />
              )}
              {game === "ludo" && <LudoGame key={resetKey} gameState={gameState} setGameState={setGameState} />}
              {game === "minesweeper" && (
                <MinesweeperGame key={resetKey} gameState={gameState} setGameState={setGameState} />
              )}
              {game === "2048" && <Game2048 key={resetKey} gameState={gameState} setGameState={setGameState} />}
            </div>
          )}
        </motion.div>

        {/* AI Coach Panel */}
        {showCoach && (
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ delay: 0.4 }}
            className={`hidden lg:block w-96 border-l backdrop-blur-xl ${
              isChess ? "border-amber-800/50 bg-linear-to-b from-amber-950/50 to-card/50" : "border-border bg-card/50"
            }`}
          >
            <AICoachPanel gameState={gameState} game={game} />
          </motion.div>
        )}
      </div>

      {/* Game Status Overlay */}
      {(gameState.status === "win" ||
        gameState.status === "lose" ||
        gameState.status === "checkmate" ||
        gameState.status === "draw") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex items-center justify-center"
        >
          <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} className="text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-4">
              {gameState.status === "checkmate" && (
                <span
                  className={`bg-linear-to-r ${isChess ? "from-amber-400 to-amber-600" : "from-primary to-accent"} bg-clip-text text-transparent`}
                >
                  Checkmate!
                </span>
              )}
              {gameState.status === "draw" && <span className="text-muted-foreground">Draw!</span>}
              {gameState.status === "win" && (
                <span
                  className={`bg-linear-to-r ${isChess ? "from-amber-400 to-amber-600" : "from-primary to-accent"} bg-clip-text text-transparent`}
                >
                  Victory!
                </span>
              )}
              {gameState.status === "lose" && <span className="text-destructive">Defeated!</span>}
            </h2>
            {gameState.score !== undefined && gameState.score > 0 && (
              <p className="text-2xl text-muted-foreground mb-4">Final Score: {gameState.score}</p>
            )}
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={handleReset} className={isChess ? "bg-amber-600 hover:bg-amber-700" : ""}>
                Play Again
              </Button>
              <Button size="lg" variant="outline" onClick={onBack}>
                Back to Menu
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
