"use client"

import type React from "react"

import { useRef, useState, useEffect, useCallback } from "react"
import { useFrame, type ThreeEvent } from "@react-three/fiber"
import { Text, Float, Sparkles } from "@react-three/drei"
import * as THREE from "three"
import type { GameState, ChessPiece, Position } from "@/lib/game-types"
import { initializeChessBoard, getValidMoves, isCheckmate } from "@/lib/chess-logic"

interface ChessGameProps {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

function ChessBoard() {
  const boardRef = useRef<THREE.Group>(null)
  const squares = []

  // Create ornate squares with different materials
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0
      squares.push(
        <mesh key={`${row}-${col}`} position={[col - 3.5, 0, row - 3.5]} receiveShadow>
          <boxGeometry args={[0.95, 0.15, 0.95]} />
          <meshStandardMaterial
            color={isLight ? "#f5e6c8" : "#1a1a2e"}
            metalness={isLight ? 0.1 : 0.4}
            roughness={isLight ? 0.3 : 0.2}
          />
        </mesh>,
      )
    }
  }

  return (
    <group ref={boardRef}>
      {/* Main board base with reflective material */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[9.5, 0.3, 9.5]} />
        <meshStandardMaterial color="#0d0d1a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Golden frame - outer */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[10, 0.15, 10]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.9}
          roughness={0.1}
          emissive="#d4af37"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Golden corner ornaments */}
      {[
        [-4.5, -4.5],
        [-4.5, 4.5],
        [4.5, -4.5],
        [4.5, 4.5],
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.1, z]}>
          <mesh castShadow>
            <octahedronGeometry args={[0.3]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={0.95}
              roughness={0.05}
              emissive="#ffd700"
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* Inner decorative border */}
      <mesh position={[0, 0.02, 4.25]} receiveShadow>
        <boxGeometry args={[8.5, 0.08, 0.15]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.02, -4.25]} receiveShadow>
        <boxGeometry args={[8.5, 0.08, 0.15]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[4.25, 0.02, 0]} receiveShadow>
        <boxGeometry args={[0.15, 0.08, 8.5]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-4.25, 0.02, 0]} receiveShadow>
        <boxGeometry args={[0.15, 0.08, 8.5]} />
        <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.1} />
      </mesh>

      {squares}

      {/* Coordinate labels with golden text */}
      {["a", "b", "c", "d", "e", "f", "g", "h"].map((letter, i) => (
        <Text
          key={letter}
          position={[i - 3.5, 0.1, 4.7]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color="#d4af37"
          font="/fonts/Inter-Bold.ttf"
        >
          {letter}
        </Text>
      ))}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((num, i) => (
        <Text
          key={num}
          position={[-4.7, 0.1, i - 3.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.25}
          color="#d4af37"
          font="/fonts/Inter-Bold.ttf"
        >
          {num.toString()}
        </Text>
      ))}

      {/* Ambient particles */}
      <Sparkles count={50} scale={12} size={2} speed={0.3} color="#d4af37" opacity={0.4} />
    </group>
  )
}

function Piece({
  piece,
  position,
  isSelected,
  onClick,
}: {
  piece: ChessPiece
  position: Position
  isSelected: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 4) * 0.15
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      } else if (hovered) {
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.3, 0.1)
      } else {
        meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0.1, 0.1)
      }
    }
  })

  // Premium color scheme - ivory vs obsidian
  const baseColor = piece.color === "white" ? "#f5e6c8" : "#1a1a2e"
  const accentColor = piece.color === "white" ? "#d4af37" : "#8b4513"
  const glowColor = piece.color === "white" ? "#00ff88" : "#ff4488"
  const emissiveColor = isSelected ? glowColor : hovered ? accentColor : "#000000"
  const emissiveIntensity = isSelected ? 0.5 : hovered ? 0.2 : 0

  const renderPiece = () => {
    const material = (
      <meshStandardMaterial
        color={baseColor}
        metalness={0.5}
        roughness={0.3}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
      />
    )

    const accentMaterial = (
      <meshStandardMaterial
        color={accentColor}
        metalness={0.9}
        roughness={0.1}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity * 0.5}
      />
    )

    switch (piece.type) {
      case "pawn":
        // Scarab beetle inspired pawn
        return (
          <>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.3, 0.3, 16]} />
              {material}
            </mesh>
            {/* Body */}
            <mesh position={[0, 0.45, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.22, 0.4, 16]} />
              {material}
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.75, 0]} castShadow>
              <sphereGeometry args={[0.15, 16, 16]} />
              {material}
            </mesh>
            {/* Golden ring */}
            <mesh position={[0, 0.35, 0]} castShadow>
              <torusGeometry args={[0.2, 0.03, 8, 24]} />
              {accentMaterial}
            </mesh>
          </>
        )
      case "rook":
        // Obelisk-style rook
        return (
          <>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <boxGeometry args={[0.5, 0.3, 0.5]} />
              {material}
            </mesh>
            {/* Shaft */}
            <mesh position={[0, 0.6, 0]} castShadow>
              <boxGeometry args={[0.35, 0.8, 0.35]} />
              {material}
            </mesh>
            {/* Top pyramid */}
            <mesh position={[0, 1.15, 0]} castShadow>
              <coneGeometry args={[0.25, 0.3, 4]} />
              {accentMaterial}
            </mesh>
            {/* Decorative bands */}
            {[0.4, 0.7, 1.0].map((y, i) => (
              <mesh key={i} position={[0, y, 0]} castShadow>
                <boxGeometry args={[0.38, 0.05, 0.38]} />
                {accentMaterial}
              </mesh>
            ))}
          </>
        )
      case "knight":
        // Anubis-inspired knight
        return (
          <>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.3, 0.3, 16]} />
              {material}
            </mesh>
            {/* Body */}
            <mesh position={[0, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.22, 0.6, 16]} />
              {material}
            </mesh>
            {/* Head (elongated like Anubis) */}
            <mesh position={[0.05, 0.95, 0]} rotation={[0.3, 0, 0.2]} castShadow>
              <boxGeometry args={[0.15, 0.35, 0.2]} />
              {material}
            </mesh>
            {/* Snout */}
            <mesh position={[0.15, 0.9, 0]} rotation={[0, 0, -0.5]} castShadow>
              <coneGeometry args={[0.08, 0.25, 8]} />
              {material}
            </mesh>
            {/* Ears */}
            <mesh position={[-0.05, 1.15, 0.08]} rotation={[0.2, 0, -0.2]} castShadow>
              <coneGeometry args={[0.05, 0.2, 4]} />
              {material}
            </mesh>
            <mesh position={[-0.05, 1.15, -0.08]} rotation={[-0.2, 0, -0.2]} castShadow>
              <coneGeometry args={[0.05, 0.2, 4]} />
              {material}
            </mesh>
            {/* Collar */}
            <mesh position={[0, 0.75, 0]} castShadow>
              <torusGeometry args={[0.18, 0.04, 8, 24]} />
              {accentMaterial}
            </mesh>
          </>
        )
      case "bishop":
        // Thoth-inspired bishop (ibis head god of wisdom)
        return (
          <>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.25, 0.3, 0.3, 16]} />
              {material}
            </mesh>
            {/* Body */}
            <mesh position={[0, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.2, 0.6, 16]} />
              {material}
            </mesh>
            {/* Head */}
            <mesh position={[0, 0.95, 0]} castShadow>
              <sphereGeometry args={[0.15, 16, 16]} />
              {material}
            </mesh>
            {/* Curved beak */}
            <mesh position={[0.15, 0.9, 0]} rotation={[0, 0, -0.8]} castShadow>
              <coneGeometry args={[0.04, 0.25, 8]} />
              {material}
            </mesh>
            {/* Headdress feather */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <coneGeometry args={[0.06, 0.3, 6]} />
              {accentMaterial}
            </mesh>
            {/* Golden bands */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <torusGeometry args={[0.15, 0.03, 8, 24]} />
              {accentMaterial}
            </mesh>
          </>
        )
      case "queen":
        // Isis-inspired queen
        return (
          <>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.35, 0.3, 16]} />
              {material}
            </mesh>
            {/* Body - elegant curved */}
            <mesh position={[0, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.25, 0.8, 16]} />
              {material}
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.1, 0]} castShadow>
              <sphereGeometry args={[0.18, 16, 16]} />
              {material}
            </mesh>
            {/* Isis crown - throne symbol */}
            <mesh position={[0, 1.35, 0]} castShadow>
              <boxGeometry args={[0.25, 0.15, 0.08]} />
              {accentMaterial}
            </mesh>
            <mesh position={[0, 1.45, 0]} castShadow>
              <boxGeometry args={[0.1, 0.2, 0.08]} />
              {accentMaterial}
            </mesh>
            {/* Wing shoulders */}
            <mesh position={[0.2, 0.9, 0]} rotation={[0, 0, 0.5]} castShadow>
              <boxGeometry args={[0.2, 0.05, 0.15]} />
              {accentMaterial}
            </mesh>
            <mesh position={[-0.2, 0.9, 0]} rotation={[0, 0, -0.5]} castShadow>
              <boxGeometry args={[0.2, 0.05, 0.15]} />
              {accentMaterial}
            </mesh>
            {/* Necklace */}
            <mesh position={[0, 0.95, 0.12]} castShadow>
              <sphereGeometry args={[0.04, 8, 8]} />
              {accentMaterial}
            </mesh>
            {/* Golden rings */}
            {[0.35, 0.55, 0.75].map((y, i) => (
              <mesh key={i} position={[0, y, 0]} castShadow>
                <torusGeometry args={[0.2 - i * 0.02, 0.025, 8, 24]} />
                {accentMaterial}
              </mesh>
            ))}
          </>
        )
      case "king":
        // Pharaoh-inspired king
        return (
          <>
            {/* Base */}
            <mesh position={[0, 0.15, 0]} castShadow>
              <cylinderGeometry args={[0.3, 0.38, 0.3, 16]} />
              {material}
            </mesh>
            {/* Body */}
            <mesh position={[0, 0.65, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.28, 0.9, 16]} />
              {material}
            </mesh>
            {/* Shoulders */}
            <mesh position={[0, 1.0, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.18, 0.2, 16]} />
              {material}
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.2, 0]} castShadow>
              <sphereGeometry args={[0.18, 16, 16]} />
              {material}
            </mesh>
            {/* Nemes headdress (pharaoh's striped cloth) */}
            <mesh position={[0, 1.25, -0.05]} castShadow>
              <boxGeometry args={[0.35, 0.25, 0.25]} />
              {material}
            </mesh>
            {/* Double crown (Pschent) */}
            <mesh position={[0, 1.5, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.15, 0.25, 16]} />
              {accentMaterial}
            </mesh>
            <mesh position={[0, 1.7, 0]} castShadow>
              <coneGeometry args={[0.1, 0.2, 16]} />
              {accentMaterial}
            </mesh>
            {/* Uraeus (cobra) */}
            <mesh position={[0, 1.4, 0.18]} rotation={[-0.3, 0, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.02, 0.15, 8]} />
              {accentMaterial}
            </mesh>
            <mesh position={[0, 1.48, 0.22]} castShadow>
              <sphereGeometry args={[0.04, 8, 8]} />
              {accentMaterial}
            </mesh>
            {/* Royal beard */}
            <mesh position={[0, 1.0, 0.15]} rotation={[-0.2, 0, 0]} castShadow>
              <boxGeometry args={[0.06, 0.2, 0.04]} />
              {accentMaterial}
            </mesh>
            {/* Crook & flail represented by golden bands */}
            {[0.35, 0.55, 0.75, 0.95].map((y, i) => (
              <mesh key={i} position={[0, y, 0]} castShadow>
                <torusGeometry args={[0.22 - i * 0.015, 0.02, 8, 24]} />
                {accentMaterial}
              </mesh>
            ))}
          </>
        )
      default:
        return null
    }
  }

  return (
    <Float
      speed={isSelected ? 4 : 0}
      rotationIntensity={isSelected ? 0.5 : 0}
      floatIntensity={isSelected ? 0.5 : 0}
      enabled={isSelected}
    >
      <group
        ref={meshRef}
        position={[position.col - 3.5, 0.1, position.row - 3.5]}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {renderPiece()}

        {/* Selection glow ring */}
        {isSelected && (
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.35, 0.45, 32]} />
            <meshBasicMaterial color={glowColor} transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    </Float>
  )
}

function ValidMoveIndicator({ position, isCapture }: { position: Position; isCapture?: boolean }) {
  const meshRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 2
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.1)
    }
  })

  const color = isCapture ? "#ff4444" : "#00ff88"

  return (
    <group ref={meshRef} position={[position.col - 3.5, 0.15, position.row - 3.5]}>
      {/* Ankh-inspired move indicator */}
      <mesh>
        <torusGeometry args={[0.15, 0.03, 8, 24]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.04, 0.2, 0.04]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[0.15, 0.04, 0.04]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} emissive={color} emissiveIntensity={0.5} />
      </mesh>

      {/* Glow effect */}
      <pointLight color={color} intensity={0.5} distance={1} />
    </group>
  )
}

export function ChessGame({ gameState, setGameState }: ChessGameProps) {
  const [board, setBoard] = useState<(ChessPiece | null)[][]>([])

  useEffect(() => {
    const initialBoard = initializeChessBoard()
    setBoard(initialBoard)
    setGameState((prev) => ({ ...prev, board: initialBoard }))
  }, [setGameState])

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      const clickedPiece = board[row]?.[col]

      if (gameState.selectedPiece) {
        const isValidMove = gameState.validMoves.some((move) => move.row === row && move.col === col)

        if (isValidMove) {
          const newBoard = board.map((r) => [...r])
          const { row: fromRow, col: fromCol } = gameState.selectedPiece
          const piece = newBoard[fromRow][fromCol]

          newBoard[row][col] = piece
          newBoard[fromRow][fromCol] = null

          setBoard(newBoard)

          const nextPlayer = gameState.currentPlayer === "white" ? "black" : "white"
          const checkmate = isCheckmate(newBoard, nextPlayer)

          setGameState((prev) => ({
            ...prev,
            board: newBoard,
            currentPlayer: nextPlayer,
            selectedPiece: null,
            validMoves: [],
            moves: [...prev.moves, { from: gameState.selectedPiece!, to: { row, col }, piece: piece! }],
            status: checkmate ? "checkmate" : "playing",
          }))
        } else {
          if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
            const validMoves = getValidMoves(board, { row, col }, clickedPiece)
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
        }
      } else {
        if (clickedPiece && clickedPiece.color === gameState.currentPlayer) {
          const validMoves = getValidMoves(board, { row, col }, clickedPiece)
          setGameState((prev) => ({
            ...prev,
            selectedPiece: { row, col },
            validMoves,
          }))
        }
      }
    },
    [board, gameState.selectedPiece, gameState.validMoves, gameState.currentPlayer, setGameState],
  )

  const handlePieceClick = useCallback(
    (row: number, col: number) => {
      handleSquareClick(row, col)
    },
    [handleSquareClick],
  )

  return (
    <group>
      <ChessBoard />

      {/* Clickable squares layer */}
      {Array.from({ length: 8 }).map((_, row) =>
        Array.from({ length: 8 }).map((_, col) => (
          <mesh
            key={`click-${row}-${col}`}
            position={[col - 3.5, 0.2, row - 3.5]}
            onClick={() => handleSquareClick(row, col)}
            visible={false}
          >
            <boxGeometry args={[1, 0.1, 1]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
        )),
      )}

      {/* Valid move indicators */}
      {gameState.validMoves.map((move, index) => {
        const isCapture = board[move.row]?.[move.col] !== null
        return <ValidMoveIndicator key={index} position={move} isCapture={isCapture} />
      })}

      {/* Chess pieces */}
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) =>
          piece ? (
            <Piece
              key={`${rowIndex}-${colIndex}`}
              piece={piece}
              position={{ row: rowIndex, col: colIndex }}
              isSelected={gameState.selectedPiece?.row === rowIndex && gameState.selectedPiece?.col === colIndex}
              onClick={() => handlePieceClick(rowIndex, colIndex)}
            />
          ) : null,
        ),
      )}
    </group>
  )
}
