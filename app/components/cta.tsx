"use client"

import { motion } from "framer-motion"

export default function CTASection() {
  return (
    <section className="w-full bg-[#FF8A00] py-16 md:py-24 relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                               linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: "20px 20px",
            maskImage: "linear-gradient(to bottom, white, transparent)",
          }}
        />
      </div>

      <motion.div
        className="max-w-4xl mx-auto px-4 text-center relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          <span className="text-white">Want to Rank Your Website in </span>
          <span className="text-gray-900">120 Days?</span>
        </h2>

        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          One click is all it takes to rank your website in 120 days. Get optimized content, boost traffic, and stay
          ahead of competitors effortlessly. Smart blogging made simple
        </p>

        <motion.button
          className="inline-flex items-center justify-center px-8 py-3 text-lg font-semibold text-[#FF8A00] bg-gray-900 rounded-full hover:bg-gray-800 transition-colors duration-200 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start for free
        </motion.button>
      </motion.div>
    </section>
  )
}

