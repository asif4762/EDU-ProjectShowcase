# game.AI - AI-Powered Board Game Coach

A fully animated 3D gaming platform with an AI coach powered by Google Gemini. Play classic board games with real-time AI suggestions, move predictions, and strategic advice.

![game.AI Banner](/placeholder.svg?height=400&width=800&query=gaming%20platform%20banner%20dark%20neon)

## Features

### 10 Playable 3D Games

| Game | Description | AI Coaching |
|------|-------------|-------------|
| **Chess** | Egyptian Pharaoh-themed 3D chess with detailed pieces (Anubis knights, Isis queen, Thoth bishops) | Opening theory, tactical analysis, endgame strategies |
| **Checkers** | Classic draughts with king promotion mechanics | Positioning, sacrifice tactics, king coordination |
| **Tic-Tac-Toe** | 3D neon-styled classic game | Winning patterns, blocking strategies |
| **Connect Four** | Vertical strategy game with glowing discs | Column control, trap setups, diagonal threats |
| **Memory Match** | Card matching game with flip animations | Memory techniques, pattern recognition |
| **Snake & Ladders** | 3D board with dice rolling mechanics | Probability analysis, risk assessment |
| **Ludo** | Multiplayer race game with safe zones | Token management, blocking strategies |
| **Reversi/Othello** | Disc-flipping territory control | Corner strategies, edge play, mobility |
| **Minesweeper** | Classic puzzle with flag mechanics | Probability calculations, pattern recognition |
| **2048** | Sliding tile puzzle game | Corner strategies, tile management |

### AI Coach Panel

- **Real-time move suggestions** with confidence percentages
- **Strategic advice** tailored to each game
- **Chat interface** for asking questions about rules, strategies, or specific positions
- **Quick actions** for common queries
- **Game state awareness** - AI understands current board position

### Visual Features

- **Cinematic 3D graphics** with React Three Fiber
- **Post-processing effects** - Bloom, vignette, chromatic aberration
- **Egyptian Pharaoh theme** for chess with golden accents
- **Neon gaming aesthetic** throughout the UI
- **Particle effects** - Sparkles, floating elements, ambient animations
- **Responsive design** - Works on desktop and mobile

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **3D Graphics:** React Three Fiber, Three.js, @react-three/drei
- **AI Integration:** Vercel AI SDK with Google Gemini
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **UI Components:** shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/game-ai.git
cd game-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create a .env.local file
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── api/
│   │   └── coach/
│   │       └── route.ts          # AI coach API endpoint
│   ├── globals.css               # Global styles & Tailwind config
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main entry point
├── components/
│   ├── games/
│   │   ├── chess-game.tsx        # Egyptian-themed 3D chess
│   │   ├── checkers-game.tsx     # 3D checkers
│   │   ├── tic-tac-toe-game.tsx  # 3D tic-tac-toe
│   │   ├── connect-four-game.tsx # Connect Four
│   │   ├── memory-game.tsx       # Memory match
│   │   ├── snake-ladders-game.tsx# Snake & Ladders
│   │   ├── ludo-game.tsx         # Ludo
│   │   ├── reversi-game.tsx      # Reversi/Othello
│   │   ├── minesweeper-game.tsx  # Minesweeper
│   │   └── game-2048.tsx         # 2048 puzzle
│   ├── ai-coach-panel.tsx        # AI coaching interface
│   ├── game-arena.tsx            # Game container with 3D scene
│   └── landing-page.tsx          # Home page with game selection
└── lib/
    └── game-types.ts             # TypeScript type definitions
```

## How to Play

### Chess (Egyptian Theme)

1. Click on a piece to select it (valid moves highlight in gold)
2. Click on a highlighted square to move
3. Use mouse to orbit around the board (drag to rotate, scroll to zoom)
4. Ask the AI coach for move suggestions or strategic advice

### Using the AI Coach

1. Click "Ask AI Coach" button or type in the chat
2. Quick actions available:
   - "Best Move" - Get the optimal move suggestion
   - "Analyze Position" - Get strategic analysis
   - "Tips" - Get game-specific tips
3. The AI considers your current game state when responding

## Game Controls

| Action | Control |
|--------|---------|
| Select piece | Left click |
| Move piece | Click valid square |
| Rotate camera | Click + drag |
| Zoom | Scroll wheel |
| Pan | Right click + drag |
| Reset view | Double click |

## API Reference

### POST /api/coach

Get AI coaching advice for any game.

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "content": "What's the best opening move?" }
  ],
  "gameType": "chess",
  "gameState": { ... }
}
```

**Response:** Server-sent events stream with AI response.

## Customization

### Themes

The app uses CSS custom properties for theming. Modify `app/globals.css`:

```css
:root {
  --primary: 45 100% 50%;      /* Gold */
  --secondary: 180 100% 50%;   /* Cyan */
  --accent: 330 100% 70%;      /* Pink */
  --background: 240 20% 6%;    /* Dark blue */
}
```

### Adding New Games

1. Create a new game component in `components/games/`
2. Add the game type to `lib/game-types.ts`
3. Register it in `game-arena.tsx`
4. Add game card in `landing-page.tsx`
5. Add AI strategy in `api/coach/route.ts`

## Performance

- Optimized 3D rendering with instanced meshes
- Lazy loading for game components
- Suspense boundaries for smooth loading
- Debounced AI requests

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

WebGL 2.0 support required for 3D graphics.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Chess piece designs inspired by Egyptian mythology
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for 3D rendering
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [shadcn/ui](https://ui.shadcn.com/) for UI components

---

Built with by game.AI Team
