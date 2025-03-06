"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { Play, Pause } from "lucide-react"

export function Hero() {
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Autoplay was prevented:", error)
        setIsPlaying(false)
      })
    }
  }, [])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-5">
        {[...Array(48)].map((_, i) => (
          <div key={i} className="border border-gray-200" />
        ))}
      </div>

      {/* Decorative Icons - Hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Target icon - top left */}
        <div className="absolute top-32 left-8 hidden lg:block">
          <div className="w-16 h-16">
            <Image
              src="/marketing.svg"
              alt="Target icon"
              width={64}
              height={64}
              className="w-full h-full"
            />
            {/* Replace with: src="/icons/target-icon.svg" */}
          </div>
        </div>

        {/* Support icon - top right */}
        <div className="absolute top-40 right-8 hidden lg:block">
          <div className="w-16 h-16">
            <Image
              src="/group.svg"
              alt="Support icon"
              width={64}
              height={64}
              className="w-full h-full"
            />
            {/* Replace with: src="/icons/support-icon.svg" */}
          </div>
        </div>

        {/* Idea icon - bottom left */}
        <div className="absolute bottom-32 left-16 hidden lg:block">
          <div className="w-14 h-14">
            <Image
              src="/charts-pc.svg"
              alt="Idea icon"
              width={56}
              height={56}
              className="w-full h-full"
            />
            {/* Replace with: src="/icons/idea-icon.svg" */}
          </div>
        </div>

        {/* Analytics icon - bottom right */}
        <div className="absolute bottom-40 right-16 hidden lg:block">
          <div className="w-14 h-14">
            <Image
              src="/idea.svg"
              alt="Analytics icon"
              width={56}
              height={56}
              className="w-full h-full"
            />
            {/* Replace with: src="/icons/analytics-icon.svg" */}
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Warning Banner */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-orange-50 rounded-full px-4 py-2 mb-12 max-w-fit mx-auto"
        >
          <p className="text-sm text-orange-800 flex items-center gap-2">
            <span className="font-medium">⚠️ Warning:</span>
            Competitors Saving Time, You&apos;re Losing Reach!
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="text-center space-y-8 sm:space-y-10">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 leading-tight"
          >
            <span className="block">
              Strategic Blogging <span className="text-orange-500">Loved</span>
            </span>
            <span className="block">
              by Readers <span className="text-orange-500">Ranked</span> by Google
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg text-gray-600"
          >
            Expert Blogs Powered by AI & ICP Strategies | Fast Google Rankings in 120 Days
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="#pricing"
              className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-white rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              Join with google
            </Link>
            <Link
              href="#pricing"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors font-medium"
            >
              Start for free
            </Link>
          </motion.div>

          {/* Video Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="relative rounded-3xl border-4 border-orange-500 aspect-video overflow-hidden">
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                poster="/videoo.mp4"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/videooo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 right-4 cursor-pointer"
                onClick={handlePlayPause}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-full"
                >
                  {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-1" />}
                </motion.div>
              </motion.div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Watch how our strategic blogging platform helps businesses rank higher on Google
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

