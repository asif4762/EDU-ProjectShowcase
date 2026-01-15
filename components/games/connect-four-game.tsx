"use client"

import type React from "react"
import { useRef, useState, useEffect, useCallback } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import type * as THREE from "three"
import type { GameState } from "@/lib/game-types"

interface ConnectFourGameProps {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const ROWS = 6
const COLS = 7

function Board() {
  return (
    <group>
      {/* Main board */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[7.5, 6.5, 0.8]} />
        <meshStandardMaterial color="#1e40af" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Holes */}
      {Array.from({ length: ROWS }).map((_, row) =>
        Array.from({ length: COLS }).map((_, col) => (
          <mesh
            key={`hole-${row}-${col}`}
            position={[col - 3, 2.5 - row, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.4, 0.4, 1, 32]} />
            <meshStandardMaterial color="#0a0a14" />
          </mesh>
        )),
      )}
    </group>
  )
}

function Disc({
  position,
  color,
  isNew,
}: { position: [number, number, number]; color: string; isNew: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [targetY] = useState(position[1])
  const [currentY, setCurrentY] = useState(isNew ? 5 : position[1])

  useFrame(() => {
    if (meshRef.current && currentY > targetY) {
      const newY = Math.max(targetY, currentY - 0.3)
      setCurrentY(newY)
      meshRef.current.position.y = newY
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[position[0], currentY, position[2]]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <cylinderGeometry args={[0.38, 0.38, 0.3, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.6}
        roughness={0.3}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  )
}

function ColumnSelector({
  col,
  onSelect,
  disabled,
}: { col: number; onSelect: () => void; disabled: boolean }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.position.y = 4 + Math.sin(state.clock.elapsedTime * 4) * 0.1
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={[col - 3, 4, 0]}
      rotation={[Math.PI / 2, 0, 0]}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        if (!disabled) onSelect()
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      visible={hovered && !disabled}
    >
      <cylinderGeometry args={[0.35, 0.35, 0.2, 32]} />
      <meshStandardMaterial color="#22c55e" transparent opacity={0.7} />
    </mesh>
  )
}

export function ConnectFourGame({ gameState, setGameState }: ConnectFourGameProps) {
  const [board, setBoard] = useState<number[][]>([])
  const [lastMove, setLastMove] = useState<{ row: number; col: number } | null>(null)

  useEffect(() => {
    const initialBoard = Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(0))
    setBoard(initialBoard)
    setGameState((prev) => ({
      ...prev,
      board: initialBoard,
      currentPlayer: "player1",
      status: "playing",
    }))
  }, [setGameState])

  const checkWin = useCallback((board: number[][], row: number, col: number, player: number) => {
    const directions = [
      [0, 1],
      [1, 0],
      [1, 1],
      [1, -1],
    ]

    for (const [dr, dc] of directions) {
      let count = 1
      for (let i = 1; i < 4; i++) {
        const r = row + dr * i
        const c = col + dc * i
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) count++
        else break
      }
      for (let i = 1; i < 4; i++) {
        const r = row - dr * i
        const c = col - dc * i
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) count++
        else break
      }
      if (count >= 4) return true
    }
    return false
  }, [])

  const handleColumnClick = useCallback(
    (col: number) => {
      if (gameState.status !== "playing") return

      let row = -1
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === 0) {
          row = r
          break
        }
      }

      if (row === -1) return

      const player = gameState.currentPlayer === "player1" ? 1 : 2
      const newBoard = board.map((r) => [...r])
      newBoard[row][col] = player
      setBoard(newBoard)
      setLastMove({ row, col })

      const won = checkWin(newBoard, row, col, player)
      const isDraw = newBoard[0].every((cell) => cell !== 0)

      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        currentPlayer: prev.currentPlayer === "player1" ? "player2" : "player1",
        status: won ? "win" : isDraw ? "draw" : "playing",
      }))
    },
    [board, gameState.currentPlayer, gameState.status, checkWin, setGameState],
  )

  return (
    <group rotation={[0.3, 0, 0]}>
      <Board />

      {/* Column selectors */}
      {Array.from({ length: COLS }).map((_, col) => (
        <ColumnSelector
          key={`selector-${col}`}
          col={col}
          onSelect={() => handleColumnClick(col)}
          disabled={gameState.status !== "playing" || board[0]?.[col] !== 0}
        />
      ))}

      {/* Discs */}
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell !== 0 ? (
            <Disc
              key={`disc-${rowIndex}-${colIndex}`}
              position={[colIndex - 3, 2.5 - rowIndex, 0.5]}
              color={cell === 1 ? "#ef4444" : "#eab308"}
              isNew={lastMove?.row === rowIndex && lastMove?.col === colIndex}
            />
          ) : null,
        ),
      )}
    </group>
  )
}