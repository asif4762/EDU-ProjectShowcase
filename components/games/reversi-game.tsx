"use client"

import type React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import type * as THREE from "three"
import type { GameState } from "@/lib/game-types"

interface ReversiGameProps {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const BOARD_SIZE = 8
const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

function Board() {
  return (
    <group>
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <boxGeometry args={[8.5, 0.2, 8.5]} />
        <meshStandardMaterial color="#15803d" metalness={0.3} roughness={0.8} />
      </mesh>
      {/* Grid lines */}
      {Array.from({ length: 9 }).map((_, i) => (
        <group key={i}>
          <mesh position={[i - 4, 0, 0]}>
            <boxGeometry args={[0.02, 0.01, 8]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
          <mesh position={[0, 0, i - 4]}>
            <boxGeometry args={[8, 0.01, 0.02]} />
            <meshStandardMaterial color="#166534" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Disc({
  position,
  color,
  isFlipping,
}: { position: [number, number, number]; color: "white" | "black"; isFlipping: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [flipProgress, setFlipProgress] = useState(0)

  useFrame(() => {
    if (meshRef.current && isFlipping && flipProgress < Math.PI) {
      const newProgress = Math.min(flipProgress + 0.15, Math.PI)
      setFlipProgress(newProgress)
      meshRef.current.rotation.x = newProgress
    }
  })

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
      <meshStandardMaterial color={color === "white" ? "#f5f5f5" : "#1a1a1a"} metalness={0.5} roughness={0.3} />
    </mesh>
  )
}

function ValidMoveIndicator({ position, onClick }: { position: [number, number, number]; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
      <meshStandardMaterial
        color="#22c55e"
        transparent
        opacity={hovered ? 0.8 : 0.4}
        emissive="#22c55e"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

export function ReversiGame({ gameState, setGameState }: ReversiGameProps) {
  const [board, setBoard] = useState<(0 | 1 | 2)[][]>([])
  const [validMoves, setValidMoves] = useState<{ row: number; col: number }[]>([])

  const getValidMoves = useCallback((board: (0 | 1 | 2)[][], player: 1 | 2) => {
    const moves: { row: number; col: number }[] = []
    const opponent = player === 1 ? 2 : 1

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (board[row][col] !== 0) continue

        for (const [dr, dc] of DIRECTIONS) {
          let r = row + dr
          let c = col + dc
          let foundOpponent = false

          while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
            if (board[r][c] === opponent) {
              foundOpponent = true
            } else if (board[r][c] === player && foundOpponent) {
              moves.push({ row, col })
              break
            } else {
              break
            }
            r += dr
            c += dc
          }
          if (moves.some((m) => m.row === row && m.col === col)) break
        }
      }
    }
    return moves
  }, [])

  useEffect(() => {
    const initialBoard: (0 | 1 | 2)[][] = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0))
    initialBoard[3][3] = 2
    initialBoard[3][4] = 1
    initialBoard[4][3] = 1
    initialBoard[4][4] = 2
    setBoard(initialBoard)

    const moves = getValidMoves(initialBoard, 1)
    setValidMoves(moves)

    setGameState((prev) => ({
      ...prev,
      board: initialBoard,
      currentPlayer: "black",
      status: "playing",
    }))
  }, [setGameState, getValidMoves])

  const makeMove = useCallback(
    (row: number, col: number) => {
      const player = gameState.currentPlayer === "black" ? 1 : 2
      const opponent = player === 1 ? 2 : 1

      const newBoard = board.map((r) => [...r])
      newBoard[row][col] = player

      for (const [dr, dc] of DIRECTIONS) {
        const toFlip: { r: number; c: number }[] = []
        let r = row + dr
        let c = col + dc

        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
          if (newBoard[r][c] === opponent) {
            toFlip.push({ r, c })
          } else if (newBoard[r][c] === player) {
            toFlip.forEach(({ r, c }) => {
              newBoard[r][c] = player
            })
            break
          } else {
            break
          }
          r += dr
          c += dc
        }
      }

      setBoard(newBoard)

      const nextPlayer = player === 1 ? 2 : 1
      const nextMoves = getValidMoves(newBoard, nextPlayer)

      if (nextMoves.length === 0) {
        const currentMoves = getValidMoves(newBoard, player)
        if (currentMoves.length === 0) {
          const blackCount = newBoard.flat().filter((c) => c === 1).length
          const whiteCount = newBoard.flat().filter((c) => c === 2).length
          setGameState((prev) => ({
            ...prev,
            board: newBoard,
            status: blackCount > whiteCount ? "win" : blackCount < whiteCount ? "lose" : "draw",
            score: blackCount,
          }))
        } else {
          setValidMoves(currentMoves)
        }
      } else {
        setValidMoves(nextMoves)
        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          currentPlayer: nextPlayer === 1 ? "black" : "white",
        }))
      }
    },
    [board, gameState.currentPlayer, getValidMoves, setGameState],
  )

  const blackCount = board.flat().filter((c) => c === 1).length
  const whiteCount = board.flat().filter((c) => c === 2).length

  return (
    <group>
      <Board />

      {/* Score display using 3D text position */}
      <group position={[-5, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
      <group position={[5, 0, 0]}>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color="#f5f5f5" />
        </mesh>
      </group>

      {/* Discs */}
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell !== 0 ? (
            <Disc
              key={`${rowIndex}-${colIndex}`}
              position={[colIndex - 3.5, 0.1, rowIndex - 3.5]}
              color={cell === 1 ? "black" : "white"}
              isFlipping={false}
            />
          ) : null,
        ),
      )}

      {/* Valid move indicators */}
      {gameState.status === "playing" &&
        validMoves.map((move, index) => (
          <ValidMoveIndicator
            key={index}
            position={[move.col - 3.5, 0.05, move.row - 3.5]}
            onClick={() => makeMove(move.row, move.col)}
          />
        ))}

      <OrbitControls
        enablePan={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={8}
        maxDistance={15}
      />
    </group>
  )
}
