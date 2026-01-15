"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mic, MicOff, Lightbulb, TrendingUp, AlertTriangle, Loader2, Bot, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { GameState, GameType } from "@/lib/game-types"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Suggestion {
  move: string
  reason: string
  confidence: number
}

const gameTips: Record<GameType, { name: string; tips: Suggestion[] }> = {
  chess: {
    name: "Chess",
    tips: [
      { move: "Control center", reason: "Occupy e4, d4, e5, d5 for board control", confidence: 90 },
      { move: "Develop pieces", reason: "Knights and bishops before queen", confidence: 85 },
      { move: "Castle early", reason: "Protect your king and activate rook", confidence: 80 },
    ],
  },
  checkers: {
    name: "Checkers",
    tips: [
      { move: "Control center", reason: "Central pieces have more mobility", confidence: 85 },
      { move: "Advance to king", reason: "Kings are twice as powerful", confidence: 90 },
      { move: "Keep back row", reason: "Protect against enemy kings", confidence: 75 },
    ],
  },
  "tic-tac-toe": {
    name: "Tic-Tac-Toe",
    tips: [
      { move: "Take center", reason: "Most strategic position on board", confidence: 95 },
      { move: "Take corners", reason: "Creates multiple winning paths", confidence: 85 },
      { move: "Block opponent", reason: "Prevent their winning moves", confidence: 90 },
    ],
  },
  "connect-four": {
    name: "Connect Four",
    tips: [
      { move: "Control center column", reason: "Most flexible for connections", confidence: 90 },
      { move: "Build multiple threats", reason: "Force opponent into defense", confidence: 85 },
      { move: "Watch diagonals", reason: "Often overlooked winning paths", confidence: 80 },
    ],
  },
  memory: {
    name: "Memory Match",
    tips: [
      { move: "Start from corners", reason: "Easier to remember positions", confidence: 85 },
      { move: "Mental grid", reason: "Create a mental map of the board", confidence: 90 },
      { move: "Reveal new cards", reason: "Prioritize finding new pairs", confidence: 80 },
    ],
  },
  "snake-ladders": {
    name: "Snake & Ladders",
    tips: [
      { move: "Know ladder positions", reason: "Memorize where ladders start", confidence: 75 },
      { move: "Avoid snake heads", reason: "Be aware of snake positions", confidence: 80 },
      { move: "Stay patient", reason: "Luck-based game, stay calm", confidence: 70 },
    ],
  },
  ludo: {
    name: "Ludo",
    tips: [
      { move: "Spread tokens", reason: "Don't keep all tokens together", confidence: 85 },
      { move: "Safe squares", reason: "Use safe squares strategically", confidence: 80 },
      { move: "Block opponents", reason: "Position to capture enemy tokens", confidence: 75 },
    ],
  },
  reversi: {
    name: "Reversi",
    tips: [
      { move: "Grab corners", reason: "Corners cannot be flipped", confidence: 95 },
      { move: "Avoid edges early", reason: "Edges give access to corners", confidence: 85 },
      { move: "Maximize flips", reason: "Control more territory", confidence: 80 },
    ],
  },
  minesweeper: {
    name: "Minesweeper",
    tips: [
      { move: "Start with corners", reason: "Corners reveal more information", confidence: 85 },
      { move: "Count carefully", reason: "Use numbers to deduce mines", confidence: 90 },
      { move: "Flag strategically", reason: "Mark certain mines first", confidence: 80 },
    ],
  },
  "2048": {
    name: "2048",
    tips: [
      { move: "Keep big tile in corner", reason: "Anchor your highest value", confidence: 95 },
      { move: "Move in 2 directions", reason: "Avoid scattering tiles", confidence: 90 },
      { move: "Build chains", reason: "Arrange tiles in descending order", confidence: 85 },
    ],
  },
}

export function AICoachPanel({
  gameState,
  game,
}: {
  gameState: GameState
  game: GameType
}) {
  const gameInfo = gameTips[game]
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Welcome to ${gameInfo.name}! I'm your AI coach powered by Google Gemini. Ask me for suggestions, strategy tips, or analysis of your current position. Let's play!`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>(gameInfo.tips)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    setSuggestions(gameTips[game].tips)
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: `Welcome to ${gameTips[game].name}! I'm your AI coach powered by Google Gemini. Ask me for suggestions, strategy tips, or analysis of your current position. Let's play!`,
        timestamp: new Date(),
      },
    ])
  }, [game])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          game,
          gameState: {
            currentPlayer: gameState.currentPlayer,
            status: gameState.status,
            score: gameState.score,
          },
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          data.response || `Great question! For ${gameInfo.name}, focus on ${gameInfo.tips[0].reason.toLowerCase()}.`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I'm having trouble connecting right now. Here's a tip for ${gameInfo.name}: ${gameInfo.tips[0].reason}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleVoice = () => {
    setIsListening(!isListening)
  }

  const quickActions = [
    { label: "Best move?", icon: Lightbulb },
    { label: "Analyze position", icon: TrendingUp },
    { label: "Strategy tips", icon: AlertTriangle },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">AI Coach</h3>
            <p className="text-xs text-muted-foreground">Playing {gameInfo.name}</p>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Strategy Tips
        </h4>
        <div className="space-y-2">
          <AnimatePresence>
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.move}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-primary">{suggestion.move}</span>
                  <span className="text-xs text-muted-foreground">{suggestion.confidence}%</span>
                </div>
                <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                <div className="mt-2 h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${suggestion.confidence}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-primary to-accent"
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "assistant" ? "bg-gradient-to-r from-primary to-accent" : "bg-secondary"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === "assistant" ? "bg-secondary" : "bg-primary text-primary-foreground"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-[10px] opacity-50 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
              </div>
              <div className="bg-secondary rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              size="sm"
              className="flex-shrink-0 text-xs bg-transparent"
              onClick={() => {
                setInput(action.label)
                setTimeout(() => handleSend(), 100)
              }}
            >
              <action.icon className="w-3 h-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={toggleVoice}
            className={isListening ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your AI coach..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
