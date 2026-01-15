"use client"

import type React from "react"

import { useRef, useState, useEffect, useCallback } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import type { GameState, Position } from "@/lib/game-types"

interface CheckersPiece {
  color: "white" | "black"
  isKing: boolean
}

interface CheckersGameProps {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

function CheckersBoard() {
  const squares = []

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0
      squares.push(
        <mesh key={`${row}-${col}`} position={[col - 3.5, -0.1, row - 3.5]} receiveShadow>
          <boxGeometry args={[1, 0.2, 1]} />
          <meshStandardMaterial color={isLight ? "#f5deb3" : "#8b4513"} metalness={0.2} roughness={0.8} />
        </mesh>,
      )
    }
  }

  return (
    <group>
      <mesh position={[0, -0.3, 0]} receiveShadow>
        <boxGeometry args={[9, 0.2, 9]} />
        <meshStandardMaterial color="#5d3a1a" metalness={0.4} roughness={0.6} />
      </mesh>
      {squares}
    </group>
  )
}

function CheckerPiece({
  piece,
  position,
  isSelected,
  onClick,
}: {
  piece: CheckersPiece
  position: Position
  isSelected: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.1
      } else if (hovered) {
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.2, 0.1)
      } else {
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1)
      }
    }
  })

  const color = piece.color === "white" ? "#f5f5f5" : "#1a1a1a"
  const emissive = piece.color === "white" ? "#22c55e" : "#ec4899"

  return (
    <group
      ref={meshRef}
      position={[position.col - 3.5, 0, position.row - 3.5]}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <mesh castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.15, 32]} />
        <meshStandardMaterial
          color={color}
          metalness={0.7}
          roughness={0.2}
          emissive={isSelected ? emissive : "#000"}
          emissiveIntensity={isSelected ? 0.4 : 0}
        />
      </mesh>
      {piece.isKing && (
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
          <meshStandardMaterial
            color={piece.color === "white" ? "#ffd700" : "#ffd700"}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      )}
    </group>
  )
}

function ValidMoveIndicator({ position }: { position: Position }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.1)
    }
  })

  return (
    <mesh ref={meshRef} position={[position.col - 3.5, 0.05, position.row - 3.5]}>
      <cylinderGeometry args={[0.2, 0.2, 0.05, 32]} />
      <meshStandardMaterial color="#22c55e" transparent opacity={0.6} emissive="#22c55e" emissiveIntensity={0.5} />
    </mesh>
  )
}

function initializeCheckersBoard(): (CheckersPiece | null)[][] {
  const board: (CheckersPiece | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: "black", isKing: false }
      }
    }
  }

  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) {
        board[row][col] = { color: "white", isKing: false }
      }
    }
  }

  return board
}

function getCheckersValidMoves(board: (CheckersPiece | null)[][], pos: Position, piece: CheckersPiece): Position[] {
  const moves: Position[] = []
  const directions = piece.isKing
    ? [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1],
      ]
    : piece.color === "white"
      ? [
          [-1, -1],
          [-1, 1],
        ]
      : [
          [1, -1],
          [1, 1],
        ]

  for (const [dr, dc] of directions) {
    const newRow = pos.row + dr
    const newCol = pos.col + dc

    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (!board[newRow][newCol]) {
        moves.push({ row: newRow, col: newCol })
      } else if (board[newRow][newCol]?.color !== piece.color) {
        const jumpRow = newRow + dr
        const jumpCol = newCol + dc
        if (jumpRow >= 0 && jumpRow < 8 && jumpCol >= 0 && jumpCol < 8 && !board[jumpRow][jumpCol]) {
          moves.push({ row: jumpRow, col: jumpCol })
        }
      }
    }
  }

  return moves
}

export function CheckersGame({ gameState, setGameState }: CheckersGameProps) {
  const [board, setBoard] = useState<(CheckersPiece | null)[][]>([])

  useEffect(() => {
    const initialBoard = initializeCheckersBoard()
    setBoard(initialBoard)
    setGameState((prev) => ({
      ...prev,
      currentPlayer: "white",
      status: "playing",
    }))
  }, [setGameState])

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      const clickedPiece = board[row]?.[col]

      if (gameState.selectedPiece) {
        const isValidMove = gameState.validMoves.some((move) => move.row === row && move.col === col)

        if (isValidMove) {
          const newBoard = board.map((r) => [...r])
          const { row: fromRow, col: fromCol } = gameState.selectedPiece
          const piece = newBoard[fromRow][fromCol] as CheckersPiece

          const rowDiff = Math.abs(row - fromRow)
          if (rowDiff === 2) {
            const capturedRow = (row + fromRow) / 2
            const capturedCol = (col + fromCol) / 2
            newBoard[capturedRow][capturedCol] = null
          }

          if ((piece.color === "white" && row === 0) || (piece.color === "black" && row === 7)) {
            piece.isKing = true
          }

          newBoard[row][col] = piece
          newBoard[fromRow][fromCol] = null

          setBoard(newBoard)

          const nextPlayer = gameState.currentPlayer === "white" ? "black" : "white"

          setGameState((prev) => ({
            ...prev,
            board: newBoard as never,
            currentPlayer: nextPlayer,
            selectedPiece: null,
            validMoves: [],
            moves: [...prev.moves, { from: gameState.selectedPiece!, to: { row, col }, piece: piece as never }],
          }))
        } else if (clickedPiece && (clickedPiece as CheckersPiece).color === gameState.currentPlayer) {
          const validMoves = getCheckersValidMoves(board, { row, col }, clickedPiece as CheckersPiece)
          setGameState((prev) => ({
            ...prev,
            selectedPiece: { row, col },
            validMoves,
          }))
        } else {
          setGameState((prev) => ({
            ...prev,
            selectedPiece: null,
            validMoves: [],
          }))
        }
      } else if (clickedPiece && (clickedPiece as CheckersPiece).color === gameState.currentPlayer) {
        const validMoves = getCheckersValidMoves(board, { row, col }, clickedPiece as CheckersPiece)
        setGameState((prev) => ({
          ...prev,
          selectedPiece: { row, col },
          validMoves,
        }))
      }
    },
    [board, gameState.selectedPiece, gameState.validMoves, gameState.currentPlayer, setGameState],
  )

  return (
    <group>
      <CheckersBoard />

      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <mesh
            key={`click-${row}-${col}`}
            position={[col - 3.5, 0.1, row - 3.5]}
            onClick={() => handleSquareClick(row, col)}
            visible={false}
          >
            <boxGeometry args={[1, 0.1, 1]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )),
      )}

      {gameState.validMoves.map((move, index) => (
        <ValidMoveIndicator key={index} position={move} />
      ))}

      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) =>
          piece ? (
            <CheckerPiece
              key={`${rowIndex}-${colIndex}`}
              piece={piece as CheckersPiece}
              position={{ row: rowIndex, col: colIndex }}
              isSelected={gameState.selectedPiece?.row === rowIndex && gameState.selectedPiece?.col === colIndex}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            />
          ) : null,
        ),
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
