import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GAME.AI | AI-Powered Chess Arena",
  description:
    "Play chess with an AI coach that provides real-time suggestions, move predictions, and strategic analysis. Powered by Google Gemini.",
  generator: "Asif : https://github.com/asif4762, Robiul :https://github.com/RoBiul-Hasan-Jisan",
}

export const viewport: Viewport = {
  themeColor: "#0a0614",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
