import { OpenAI } from "openai"; // Import OpenAI SDK

// Create OpenAI client instance
const openai = new OpenAI({
  apiKey: process.env.GPTAPI, // Make sure to set your OpenAI API key in an environment variable
});
console.log(process.env.GPTAPI)
export const maxDuration = 30;

const gameStrategies: Record<string, string> = {
  chess: `Chess Strategy Guide:
- Opening: Control center (e4, d4), develop knights before bishops, castle early
- Middlegame: Create pawn structures, coordinate pieces, look for tactics
- Endgame: Activate king, push passed pawns, use piece activity
- Key principles: Piece development, king safety, pawn structure, piece activity`,

  checkers: `Checkers Strategy Guide:
- Control the center squares for maximum mobility
- Advance pieces toward kinged position
- Maintain back row pieces to prevent opponent kings
- Force exchanges when ahead, avoid when behind
- Create multiple jump opportunities`,

  "tic-tac-toe": `Tic-Tac-Toe Strategy Guide:
- Always take center if available (best opening)
- If opponent takes center, take a corner
- Block opponent's winning moves immediately
- Create "forks" (two ways to win)
- Perfect play always results in a draw`,

  "connect-four": `Connect Four Strategy Guide:
- Control the center column - most flexible position
- Build vertical and diagonal threats
- Force opponent to block, then create secondary threats
- Watch for diagonal winning opportunities
- Plan 2-3 moves ahead`,

  memory: `Memory Match Strategy Guide:
- Start from corners and edges (easier to remember)
- Create mental grid sections
- Focus on revealing new cards rather than random guessing
- When you find a card, remember its pair location
- Take your time - accuracy beats speed`,

  "snake-ladders": `Snake & Ladders Strategy Guide:
- This is primarily a luck-based game
- Memorize ladder and snake positions
- Key ladders: 2→38, 28→84, 80→100
- Dangerous snakes: 99→54, 87→24
- Stay patient and hope for good rolls`,

  ludo: `Ludo Strategy Guide:
- Get all tokens out early (need 6 to start)
- Spread tokens across the board
- Use safe squares strategically
- Block opponent paths when possible
- Balance offense (advancing) and defense (staying safe)`,

  reversi: `Reversi/Othello Strategy Guide:
- PRIORITY: Secure corners - they cannot be flipped
- Avoid edges early - they give opponent corner access
- Control mobility - limit opponent's valid moves
- In endgame, maximize disc count
- Sometimes fewer discs early = more options later`,

  minesweeper: `Minesweeper Strategy Guide:
- Start with corners - they reveal more information
- Use number logic: if a 1 has one unrevealed adjacent, that's the mine
- Flag certain mines, but don't over-flag
- Look for patterns: 1-2-1, 1-2-2-1
- When stuck, guess near edges (fewer adjacent cells)`,

  "2048": `2048 Strategy Guide:
- CRITICAL: Keep highest tile in a corner
- Only move in 2-3 directions (avoid scattering)
- Build in descending order toward corner
- Never move away from your corner
- Chain merges for big combos`,
};

export async function POST(req: Request) {
  try {
    const { message, game, gameState } = await req.json();

    const strategy = gameStrategies[game] || "Focus on strategic play and think ahead.";

    const systemPrompt = `You are an expert ${game.replace("-", " ")} coach AI assistant powered by OpenAI. You provide strategic advice, move suggestions, and analysis to help players improve their game.

${strategy}

Current game state:
- Current player/turn: ${gameState.currentPlayer || "N/A"}
- Game status: ${gameState.status || "playing"}
- Score: ${gameState.score || 0}

Instructions:
1. Be concise but helpful (under 150 words unless detailed analysis requested)
2. Provide specific, actionable advice
3. Reference the strategy guide above when relevant
4. Be encouraging and supportive
5. If asked for best move, give a clear recommendation with reasoning`;

    // Use OpenAI to generate the response
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // You can also use other models like gpt-3.5-turbo
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }],
      max_tokens: 500,
      temperature: 0.7,
    });

    // Extract the generated text from the response
    const { content } = response.choices[0];

    return Response.json({ response: content });
  } catch (error) {
    console.error("Coach API error:", error);

    const { game } = await req.json().catch(() => ({ game: "chess" }));
    const fallbackTips: Record<string, string> = {
      chess: "Focus on controlling the center and developing your pieces. Castle early for king safety!",
      checkers: "Try to advance toward the king row while keeping some pieces back for defense.",
      "tic-tac-toe": "Always take the center if available, or a corner for the best strategic position.",
      "connect-four": "Control the center column and look for diagonal winning opportunities!",
      memory: "Create a mental grid and remember card positions systematically.",
      "snake-ladders": "Good luck! Remember the key ladders at 2, 28, and 80.",
      ludo: "Spread your tokens and use safe squares strategically!",
      reversi: "Focus on securing corners - they can't be flipped!",
      minesweeper: "Use number logic carefully. If a 1 has one unrevealed neighbor, that's the mine!",
      "2048": "Keep your highest tile in a corner and only move in 2-3 directions!",
    };

    return Response.json(
      { response: fallbackTips[game] || "Think strategically and plan your moves ahead!" },
      { status: 200 }
    );
  }
}
