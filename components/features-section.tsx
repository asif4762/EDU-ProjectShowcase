"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { FileText, Video, Mic2, Eye, Brain, ClipboardList } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "PDF Rule Parsing",
    description:
      "Upload a game's rulebook (PDF), and game.AI extracts rules, mechanics, and constraints. It understands legal moves, game flow, and identifies pieces, cards, and board elements.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    icon: Video,
    title: "Live Game Assistance",
    description:
      "A dedicated game page includes live webcam feed of the game board, real-time AI interaction log, and visual context for every question you ask.",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    icon: Mic2,
    title: "Voice-Activated Queries",
    description:
      "Hold the backtick (`) key to activate the microphone. Ask natural questions like 'Is this a legal move?' or 'What should I play next?'",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    icon: Eye,
    title: "Visual Game Analysis",
    description:
      "Captures a screenshot of the current board, analyzes positions, pieces, and visible elements. Combines visual context with rules and player intent.",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    icon: Brain,
    title: "Intelligent Advice",
    description:
      "Using Google Gemini, game.AI provides rule explanations, move suggestions, strategic guidance, and context-aware coaching for any situation.",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    icon: ClipboardList,
    title: "Action Logging",
    description:
      "Keeps a timeline of player actions, questions asked, and AI responses and recommendations for full game tracking and review.",
    gradient: "from-indigo-500 to-blue-400",
  },
]

function FeatureCard({
  feature,
  index,
  isInView,
}: { feature: (typeof features)[0]; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative h-full p-6 md:p-8 rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 hover:border-primary/50">
        {/* Gradient Background on Hover */}
        <div
          className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />

        {/* Icon */}
        <div
          className={`relative z-10 w-14 h-14 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          <feature.icon className="w-7 h-7 text-background" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
        </div>

        {/* Corner Decoration */}
        <div
          className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-linear-to-br ${feature.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-300`}
        />
      </div>
    </motion.div>
  )
}

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="features" ref={ref} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-background via-secondary/10 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium mb-4">
            ✨ Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
            Everything You Need to <span className="text-primary">Play Better</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful AI features designed to enhance your gaming experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
