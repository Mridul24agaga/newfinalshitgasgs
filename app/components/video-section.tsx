"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Pause, Play, ArrowRight } from "lucide-react"

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="min-h-screen bg-white lg:p-8 sm:p-16">
      {/* Cool Heading Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto mb-8 lg:mb-16 text-center px-4 pt-4 lg:pt-0"
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-[#1D185E] text-lg hidden lg:block"
        >
          Watch how our AI transforms your content creation process
        </motion.h1>
      </motion.div>

      <div className="max-w-5xl mx-auto relative">
        {/* Main Container */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="overflow-hidden bg-white rounded-[1rem] lg:rounded-[2rem] mx-4 lg:mx-0 p-2"
        >
          {/* Double Border Container */}
          <div className="rounded-[0.875rem] lg:rounded-[1.875rem] border-2 border-[#1D185E]/20 p-2">
            {/* Video Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative overflow-hidden rounded-[0.75rem] lg:rounded-[1.75rem] border-2 border-[#1D185E]"
            >
              {/* Mobile Screen Overlay */}
              <div className="absolute inset-0 bg-black/40 z-30 lg:hidden" />

              {/* Decorative arrows - PC only */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute top-1/2 -left-12 transform -translate-y-1/2 hidden lg:block z-30"
              >
                <ArrowRight className="w-8 h-8 text-[#1D185E]" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute top-1/2 -right-12 transform -translate-y-1/2 hidden lg:block z-30"
              >
                <ArrowRight className="w-8 h-8 text-[#1D185E] transform rotate-180" />
              </motion.div>

              {/* Custom Video Controls */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 z-40 lg:bottom-4 lg:right-4 lg:transform-none"
              >
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 lg:w-12 lg:h-12 bg-[#1D185E] rounded-full flex items-center justify-center hover:bg-[#1D185E]/80 transition-colors shadow-lg"
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 lg:w-6 lg:h-6 text-white" />
                  ) : (
                    <Play className="w-8 h-8 lg:w-6 lg:h-6 text-white ml-1" />
                  )}
                </button>
              </motion.div>

              {/* Video Player */}
              <video
                ref={videoRef}
                className="w-full aspect-[4/3] lg:aspect-video object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

