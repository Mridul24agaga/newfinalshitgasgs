"use client"

import { motion } from "framer-motion"
import { Trash2, TrendingDown, Clock, XCircle } from "lucide-react"
import { spaceGrotesk } from "./fonts"

export default function ContentProblems() {
  const cards = [
    {
      icon: Trash2,
      title: "Low quality, generic content, poor ideas",
      bgColor: "#1C155B",
      iconColor: "white",
      textColor: "white",
      delay: 0.2,
    },
    {
      icon: TrendingDown,
      title: "No return on investment",
      bgColor: "#3DFEA0",
      iconColor: "#1C155B",
      textColor: "#1C155B",
      delay: 0.4,
    },
    {
      icon: Clock,
      title: "Countless hours of wasted time",
      bgColor: "#1C155B",
      iconColor: "white",
      textColor: "white",
      delay: 0.6,
    },
  ]

  return (
    <section className={`py-20 px-4 bg-white ${spaceGrotesk.variable}`}>
      <div className="max-w-7xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 bg-red-50">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-500 font-medium">Content Isn't Easy</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-[56px] font-bold mb-6 font-space-grotesk tracking-[-0.02em] leading-[1.1]">
            Writing content can be frustrating
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Let's be honest, creating content can be time-consuming and, when done wrong, can backfire. Do you really
            need that extra burden?
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: card.delay }}
              className="relative group"
            >
              <div
                className="rounded-3xl aspect-square flex flex-col items-center justify-center p-8 text-center"
                style={{ backgroundColor: card.bgColor }}
              >
                {/* Icon Container */}
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: card.bgColor === "#3DFEA0" ? "rgba(28, 21, 91, 0.1)" : "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <card.icon className="w-12 h-12" style={{ color: card.iconColor }} />
                </div>
                {/* Title */}
                <h3
                  className="text-lg font-medium leading-tight max-w-[200px] font-space-grotesk"
                  style={{ color: card.textColor }}
                >
                  {card.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

