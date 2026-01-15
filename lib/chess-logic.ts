import type { ChessPiece, Position } from "./game-types"

export function initializeChessBoard(): (ChessPiece | null)[][] {
  const board: (ChessPiece | null)[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null))

  // Place pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: "pawn", color: "black" }
    board[6][col] = { type: "pawn", color: "white" }
  }

  // Place other pieces
  const pieceOrder: ChessPiece["type"][] = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]

  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: pieceOrder[col], color: "black" }
    board[7][col] = { type: pieceOrder[col], color: "white" }
  }

  return board
}

export function getValidMoves(board: (ChessPiece | null)[][], position: Position, piece: ChessPiece): Position[] {
  const moves: Position[] = []
  const { row, col } = position

  const addMoveIfValid = (r: number, c: number, canCapture = true): boolean => {
    if (r < 0 || r > 7 || c < 0 || c > 7) return false
    const target = board[r][c]
    if (!target) {
      moves.push({ row: r, col: c })
      return true
    }
    if (canCapture && target.color !== piece.color) {
      moves.push({ row: r, col: c })
    }
    return false
  }

  const addSlidingMoves = (directions: [number, number][]) => {
    for (const [dr, dc] of directions) {
      let r = row + dr
      let c = col + dc
      while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
        const target = board[r][c]
        if (!target) {
          moves.push({ row: r, col: c })
        } else {
          if (target.color !== piece.color) {
            moves.push({ row: r, col: c })
          }
          break
        }
        r += dr
        c += dc
      }
    }
  }

  switch (piece.type) {
    case "pawn": {
      const direction = piece.color === "white" ? -1 : 1
      const startRow = piece.color === "white" ? 6 : 1

      // Forward move
      if (!board[row + direction]?.[col]) {
        moves.push({ row: row + direction, col })
        // Double move from start
        if (row === startRow && !board[row + direction * 2]?.[col]) {
          moves.push({ row: row + direction * 2, col })
        }
      }

      // Captures
      for (const dc of [-1, 1]) {
        const target = board[row + direction]?.[col + dc]
        if (target && target.color !== piece.color) {
          moves.push({ row: row + direction, col: col + dc })
        }
      }
      break
    }

    case "rook":
      addSlidingMoves([
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
      ])
      break

    case "bishop":
      addSlidingMoves([
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ])
      break

    case "queen":
      addSlidingMoves([
        [0, 1],
        [0, -1],
        [1, 0],
        [-1, 0],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ])
      break

    case "knight":
      for (const [dr, dc] of [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1],
      ]) {
        addMoveIfValid(row + dr, col + dc)
      }
      break

    case "king":
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            addMoveIfValid(row + dr, col + dc)
          }
        }
      }
      break
  }

  return moves
}

export function isCheckmate(board: (ChessPiece | null)[][], player: "white" | "black"): boolean {
  // Find the king
  let kingPos: Position | null = null
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece?.type === "king" && piece.color === player) {
        kingPos = { row: r, col: c }
        break
      }
    }
  }

  if (!kingPos) return false

  // Check if any piece can make a valid move
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c]
      if (piece?.color === player) {
        const moves = getValidMoves(board, { row: r, col: c }, piece)
        if (moves.length > 0) return false
      }
    }
  }

  return true
}
