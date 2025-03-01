"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"

interface Card {
  title: string
  description: string
  image: string
}

const cards: Card[] = [
  {
    title: "AI Writing Assistant",
    description: "Get real-time suggestions and improvements as you write.",
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    title: "Content Optimization",
    description: "Optimize your content for better engagement and reach.",
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    title: "SEO Enhancement",
    description: "Improve your content's search engine visibility.",
    image: "/placeholder.svg?height=600&width=800",
  },
  {
    title: "Grammar & Style Check",
    description: "Perfect your writing with advanced grammar and style suggestions.",
    image: "/placeholder.svg?height=600&width=800",
  },
]

export default function ScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeCardIndex, setActiveCardIndex] = useState(0)
  const [showNextSection, setShowNextSection] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.8])

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const index = Math.min(Math.floor(latest * cards.length), cards.length - 1)
      setActiveCardIndex(index)
      if (latest >= 0.75) {
        setShowNextSection(true)
      } else {
        setShowNextSection(false)
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <div ref={containerRef} className="relative min-h-[400vh] bg-gradient-to-b from-white to-gray-100 sm:min-h-[600vh]">
      <motion.div className="sticky top-0 h-screen overflow-hidden" style={{ opacity, scale }}>
        <div className="container mx-auto h-full max-w-[1400px] px-4 py-8 sm:py-20">
          {/* Header Section */}
          <div className="mb-8 sm:mb-16 lg:grid lg:gap-16 lg:grid-cols-2">
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight text-gray-900 lg:text-6xl mb-4 sm:mb-0">
              Unlock the Power of Perfect Writing
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 lg:text-right">
              Unlock the power of compelling writing that engages, inspires, and drives results.
            </p>
          </div>

          {/* Cards Section */}
          <div className="grid gap-8 lg:grid-cols-2 lg:h-[600px]">
            {/* Left side - Image Frame */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF8A3D] to-[#FF6B3D] p-1 shadow-lg">
              <div className="relative h-full overflow-hidden rounded-2xl bg-white p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeCardIndex}
                    className="relative h-full"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{cards[activeCardIndex].title}</h2>
                    <p className="mt-2 sm:mt-4 text-base sm:text-xl text-gray-600">
                      {cards[activeCardIndex].description}
                    </p>
                    <img
                      src={cards[activeCardIndex].image || "/placeholder.svg"}
                      alt={cards[activeCardIndex].title}
                      className="mt-4 sm:mt-8 h-48 sm:h-64 w-full rounded-lg object-cover shadow-md"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right side - Stacked Cards */}
            <div className="relative h-[400px] sm:h-full">
              {cards.map((card, index) => (
                <motion.div
                  key={index}
                  className="absolute left-0 right-0 h-full overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF8A3D] to-[#FF6B3D] p-1 shadow-lg"
                  style={{
                    top: `${index * 16}px`,
                    zIndex: cards.length - index,
                  }}
                  animate={{
                    y:
                      index === activeCardIndex
                        ? 0
                        : index < activeCardIndex
                          ? "-100%"
                          : `${(index - activeCardIndex) * 16}px`,
                    opacity: index === activeCardIndex ? 1 : 0.7,
                    scale: index === activeCardIndex ? 1 : 0.98,
                  }}
                  transition={{
                    duration: 2.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <div className="flex h-full flex-col justify-between rounded-xl bg-white p-6 sm:p-8">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{card.title}</h3>
                      <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">{card.description}</p>
                    </div>
                    <div className="mt-4 sm:mt-8 flex justify-end">
                      <motion.button
                        className="rounded-full bg-gradient-to-r from-[#FF8A3D] to-[#FF6B3D] px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold text-white shadow-md transition-all hover:shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Learn More
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Next Section */}
      <motion.div
        className="min-h-screen bg-gray-100 p-8 sm:p-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: showNextSection ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Next Section</h2>
        <p className="mt-4 text-lg sm:text-xl text-gray-600">
          This is the next section that appears after scrolling through all cards.
        </p>
      </motion.div>
    </div>
  )
}

