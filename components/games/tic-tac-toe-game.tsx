"use client"

import type React from "react"

import { useRef, useState, useCallback, useEffect } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import type * as THREE from "three"
import type { GameState } from "@/lib/game-types"

type CellValue = "X" | "O" | null

interface TicTacToeGameProps {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

function TicTacToeBoard() {
  return (
    <group>
      {/* Background */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[7, 0.3, 7]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Grid lines */}
      {[-1, 1].map((offset) => (
        <group key={offset}>
          <mesh position={[offset, 0, 0]}>
            <boxGeometry args={[0.1, 0.3, 6]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0, 0, offset]}>
            <boxGeometry args={[6, 0.3, 0.1]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function XPiece({ position, animated = true }: { position: [number, number, number]; animated?: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [scale, setScale] = useState(animated ? 0 : 1)

  useFrame(() => {
    if (animated && scale < 1) {
      setScale((prev) => Math.min(prev + 0.1, 1))
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.2, 1.5, 0.2]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]} castShadow>
        <boxGeometry args={[0.2, 1.5, 0.2]} />
        <meshStandardMaterial
          color="#ec4899"
          emissive="#ec4899"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

function OPiece({ position, animated = true }: { position: [number, number, number]; animated?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [scale, setScale] = useState(animated ? 0 : 1)

  useFrame(() => {
    if (animated && scale < 1) {
      setScale((prev) => Math.min(prev + 0.1, 1))
    }
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.01
    }
  })

  return (
    <mesh ref={meshRef} position={position} scale={scale} castShadow>
      <torusGeometry args={[0.5, 0.15, 16, 32]} />
      <meshStandardMaterial
        color="#22c55e"
        emissive="#22c55e"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

function checkWinner(board: CellValue[][]): CellValue | "draw" | null {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
      return board[i][0]
    }
  }

  // Check columns
  for (let j = 0; j < 3; j++) {
    if (board[0][j] && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
      return board[0][j]
    }
  }

  // Check diagonals
  if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    return board[0][0]
  }
  if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    return board[0][2]
  }

  // Check for draw
  const isFull = board.every((row) => row.every((cell) => cell !== null))
  if (isFull) return "draw"

  return null
}

export function TicTacToeGame({ gameState, setGameState }: TicTacToeGameProps) {
  const [board, setBoard] = useState<CellValue[][]>([
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ])
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")

  useEffect(() => {
    setGameState((prev) => ({
      ...prev,
      currentPlayer: "player1",
      status: "playing",
    }))
  }, [setGameState])

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (board[row][col] || gameState.status !== "playing") return

      const newBoard = board.map((r) => [...r])
      newBoard[row][col] = currentPlayer
      setBoard(newBoard)

      const winner = checkWinner(newBoard)
      const nextPlayer = currentPlayer === "X" ? "O" : "X"

      setCurrentPlayer(nextPlayer)
      setGameState((prev) => ({
        ...prev,
        currentPlayer: nextPlayer === "X" ? "player1" : "player2",
        moves: [...prev.moves, { from: { row, col }, to: { row, col }, piece: null as never }],
        status: winner === "draw" ? "draw" : winner ? "win" : "playing",
      }))
    },
    [board, currentPlayer, gameState.status, setGameState],
  )

  const cellPositions: [number, number, number][] = [
    [-2, 0.3, -2],
    [0, 0.3, -2],
    [2, 0.3, -2],
    [-2, 0.3, 0],
    [0, 0.3, 0],
    [2, 0.3, 0],
    [-2, 0.3, 2],
    [0, 0.3, 2],
    [2, 0.3, 2],
  ]

  return (
    <group>
      <TicTacToeBoard />

      {/* Clickable cells */}
      {cellPositions.map((pos, index) => {
        const row = Math.floor(index / 3)
        const col = index % 3
        return (
          <mesh
            key={index}
            position={pos}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation()
              handleCellClick(row, col)
            }}
          >
            <boxGeometry args={[1.8, 0.5, 1.8]} />
            <meshStandardMaterial transparent opacity={0} />
          </mesh>
        )
      })}

      {/* Pieces */}
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (!cell) return null
          const pos = cellPositions[rowIndex * 3 + colIndex]
          return cell === "X" ? (
            <XPiece key={`${rowIndex}-${colIndex}`} position={pos} />
          ) : (
            <OPiece key={`${rowIndex}-${colIndex}`} position={pos} />
          )
        }),
      )}

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
