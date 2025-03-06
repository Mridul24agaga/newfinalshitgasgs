"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

export default function AICTA() {
  const containerRef = useRef(null)
  const headingRef = useRef(null)
  const highlightRef = useRef(null)
  const subtitleRef = useRef(null)
  const buttonRef = useRef(null)
  const star1Ref = useRef(null)
  const star2Ref = useRef(null)

  const containerInView = useInView(containerRef, { once: true, amount: 0.3 })
  const headingInView = useInView(headingRef, { once: true, amount: 0.5 })
  const highlightInView = useInView(highlightRef, { once: true, amount: 0.5 })
  const subtitleInView = useInView(subtitleRef, { once: true, amount: 0.5 })
  const buttonInView = useInView(buttonRef, { once: true, amount: 0.5 })
  const star1InView = useInView(star1Ref, { once: true, amount: 0.5 })
  const star2InView = useInView(star2Ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={containerRef}
      className="w-full max-w-[1020px] mx-auto bg-[#ff7a2d] text-white p-6 sm:p-8 md:p-12 rounded-2xl shadow-lg relative overflow-hidden mb-8 sm:mb-12 md:mb-16"
      initial={{ opacity: 0, y: 100 }}
      animate={containerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8 }}
    >
      {/* Star decorations */}
      <motion.div
        ref={star1Ref}
        className="absolute left-[10%] bottom-[20%] text-[#e3ff40] text-xl sm:text-2xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={star1InView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        whileHover={{ rotate: 180, scale: 1.2 }}
      >
        ✦
      </motion.div>
      <motion.div
        ref={star2Ref}
        className="absolute right-[10%] top-[30%] text-[#e3ff40] text-xl sm:text-2xl"
        initial={{ opacity: 0, scale: 0 }}
        animate={star2InView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        whileHover={{ rotate: 180, scale: 1.2 }}
      >
        ✦
      </motion.div>

      <div className="flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 py-4 md:py-6 px-4 sm:px-6 md:px-8">
        {/* Heading with highlighted text */}
        <motion.div
          ref={headingRef}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight px-2 mb-4 md:mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="inline">Want to </h2>
          <motion.span
            ref={highlightRef}
            className="bg-[#e3ff40] text-[#2a2a2a] px-3 py-1 rounded-lg inline-block my-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={highlightInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            Rank Your Website
          </motion.span>
          <h2 className="inline-block mt-2"> in 120 Days?</h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          ref={subtitleRef}
          className="text-base sm:text-lg opacity-90 max-w-2xl px-4 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={subtitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          One click is all it takes to rank your website in 120 days. Get optimized content, boost traffic, and stay
          ahead of competitors effortlessly. Smart blogging made simple
        </motion.p>

        {/* CTA Button */}
        <motion.div
          ref={buttonRef}
          className="flex flex-col items-center space-y-3 mt-2 md:mt-4 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={buttonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.button
            className="bg-[#e3ff40] text-[#2a2a2a] font-medium px-8 py-3 rounded-full text-lg hover:bg-opacity-90 transition-all min-w-[200px] w-[90%] max-w-[320px] shadow-md whitespace-nowrap"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            Start for free
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}

