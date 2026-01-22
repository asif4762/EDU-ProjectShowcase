import { StaticImport } from "next/dist/shared/lib/get-img-props"

export interface Position {
  row: number
  col: number
}

export interface ChessPiece {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
  color: "white" | "black"
}

export interface Move {
  from: Position
  to: Position
  piece: ChessPiece
}

export type GameType =
  | "chess"
  | "checkers"
  | "tic-tac-toe"
  | "connect-four"
  | "memory"
  | "snake-ladders"
  | "ludo"
  | "reversi"
  | "minesweeper"
  | "2048"

export interface GameState {
  board: (ChessPiece | null)[][] | number[][] | string[][]
  currentPlayer: "white" | "black" | "red" | "blue" | "green" | "yellow" | "player1" | "player2"
  moves: Move[]
  status: "playing" | "check" | "checkmate" | "draw" | "win" | "lose"
  selectedPiece: Position | null
  validMoves: Position[]
  score?: number
  level?: number
  diceValue?: number
  flippedCards?: number[]
  matchedPairs?: number[]
  playerPositions?: { [key: string]: number }
}

export interface GameConfig {
  image: string | StaticImport
  id: GameType
  name: string
  description: string
  category: "strategy" | "board" | "puzzle" | "party"
  players: string
  difficulty: "easy" | "medium" | "hard"
  color: string
}
