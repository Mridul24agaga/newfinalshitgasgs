"use client"

import { motion } from "framer-motion"
import { useRef, useEffect } from "react"

const languages = [
  "English",
  "Mandarin Chinese",
  "Hindi",
  "Spanish",
  "French",
  "Standard Arabic",
  "Bengali",
  "Portuguese",
  "Russian",
  "Urdu",
  "Indonesian",
  "German",
  "Japanese",
  "Swahili",
  "Marathi",
  "Telugu",
  "Turkish",
  "Tamil",
  "Yue Chinese (Cantonese)",
  "Wu Chinese (Shanghainese)",
  "Vietnamese",
  "Tagalog (Filipino)",
  "Italian",
  "Hausa",
  "Thai",
  "Gujarati",
  "Polish",
  "Persian (Farsi)",
  "Burmese",
  "Ukrainian",
  "Malayalam",
  "Kannada",
  "Odia (Oriya)",
  "Romanian",
  "Dutch",
  "Pashto",
  "Sindhi",
  "Malay",
  "Serbo-Croatian",
  "Amharic",
  "Fula (Fulani)",
  "Hebrew",
  "Sinhala",
  "Cebuano",
  "Madurese",
  "Haitian Creole",
  "Quechua",
  "Shona",
  "Belarusian",
  "Zulu",
]

const Row = ({ languages, direction, speed }: { languages: string[]; direction: 1 | -1; speed: number }) => (
  <motion.div
    className="flex gap-3 py-2"
    initial={{ x: direction === 1 ? "0%" : "-100%" }}
    animate={{ x: direction === 1 ? "-100%" : "0%" }}
    transition={{
      x: {
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "loop",
        duration: speed,
        ease: "linear",
      },
    }}
  >
    {[...languages, ...languages].map((language, index) => (
      <motion.button
        key={`${language}-${index}`}
        className="px-4 py-2 rounded-full border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:text-gray-900 transition-all duration-200 whitespace-nowrap font-medium text-sm"
      >
        {language}
      </motion.button>
    ))}
  </motion.div>
)

export default function LanguageScroll() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseEnter = () => {
      container.style.animationPlayState = "paused"
    }

    const handleMouseLeave = () => {
      container.style.animationPlayState = "running"
    }

    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const rowLanguages = [languages.slice(0, 12), languages.slice(12, 24), languages.slice(24, 36), languages.slice(36)]

  return (
    <div className="relative max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-center text-2xl font-bold mb-6">Supported Languages</h2>

      <div ref={containerRef} className="overflow-hidden">
        <Row languages={rowLanguages[0]} direction={1} speed={50} />
        <Row languages={rowLanguages[1]} direction={-1} speed={40} />
        <Row languages={rowLanguages[2]} direction={1} speed={60} />
        <Row languages={rowLanguages[3]} direction={-1} speed={45} />
      </div>
    </div>
  )
}

