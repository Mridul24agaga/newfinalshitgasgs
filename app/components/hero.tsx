"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Header } from "./header"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVideoHovered, setIsVideoHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 7,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Set end date to 7 days from now
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 7)

    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Simulate loading time and then hide the loader
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const navVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  const videoContainerVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        delay: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <Header/>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative overflow-hidden bg-white">
          {/* Grid Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-[#f8f8f8]"
            style={{
              backgroundImage: `linear-gradient(to right, #c0c0c0 1px, transparent 1px), 
                linear-gradient(to bottom, #c0c0c0 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              backgroundPosition: "0 0",
            }}
          ></motion.div>

          {/* Background Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="absolute top-20 right-0 w-64 h-64 bg-[#294df6]/5 rounded-full blur-3xl"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="absolute bottom-20 left-0 w-96 h-96 bg-[#f92d6]/5 rounded-full blur-3xl"
          ></motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Badge with #1 */}
            <motion.div className="flex justify-center mb-4" variants={fadeInUp}>
              <motion.div
                className="bg-amber-100 text-amber-800 rounded-full px-4 py-1 inline-flex items-center font-bold"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                #1 Ranked Most Affordable Automated Blogging AI Agent
              </motion.div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6" variants={fadeInUp}>
              <span className="text-gray-900">SEO Blogging on Autopilot</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto" variants={fadeInUp}>
              Fully automated blog creation that ranks on Google and grows your business—without lifting a finger.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center mb-12" variants={fadeInUp}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href="#examples"
                  className="flex items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6 text-gray-800 font-medium hover:shadow-md transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  Check Demo Articles
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href="/signup"
                  className="bg-[#294fd6] hover:bg-[#7733ee] text-white rounded-full py-3 px-6 font-medium transition-all flex items-center justify-center"
                >
                 Get one Article For free
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* YouTube Video Section - Perfectly Centered */}
          <motion.div
            className="flex justify-center items-center w-full mt-24 mb-24"
            initial="hidden"
            animate="visible"
            variants={videoContainerVariants}
          >
            <motion.div
              className="w-full max-w-[1000px] aspect-[16/9] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border-8 border-gray-800 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(41,77,246,0.5)] z-20"
              onMouseEnter={() => setIsVideoHovered(true)}
              onMouseLeave={() => setIsVideoHovered(false)}
              ref={videoContainerRef}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <style jsx>{`
                @keyframes float {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-10px); }
                  100% { transform: translateY(0px); }
                }
                @keyframes pulse-once {
                  0% { transform: scale(1); }
                  50% { transform: scale(1.1); }
                  100% { transform: scale(1); }
                }
                .animate-pulse-once {
                  animation: pulse-once 1s ease-in-out;
                }
                .video-label {
                  background: linear-gradient(90deg, #294df6, #7733ee);
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                  animation: gradient 3s ease infinite;
                  background-size: 200% auto;
                }
                @keyframes gradient {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .video-badge {
                  animation: bounce 2s infinite;
                }
                @keyframes bounce {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-10px); }
                  100% { transform: translateY(0); }
                }
                @keyframes spin-slow {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(-360deg); }
                }
                .animate-spin-slow {
                  animation: spin-slow 3s linear infinite;
                }
              `}</style>

              {/* Animated "WATCH NOW" Badge - Positioned to not interfere with video controls */}
              <motion.div
                className="absolute top-4 right-4 bg-[#294df6] text-white px-4 py-2 rounded-full font-bold z-30 video-badge pointer-events-none"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                WATCH NOW
              </motion.div>

              {/* YouTube Embed */}
              <iframe
                src="https://www.youtube.com/embed/eqn0Uv0xm_o?autoplay=0&rel=0&showinfo=1&modestbranding=1&controls=1"
                title="100% Autopilot SEO Blogging AI agent | GetMoreSEO | Markupx Brands"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full object-cover z-20"
              ></iframe>

              {/* Animated Glow Effect - Only on the border, not covering the video */}
              <motion.div
                className={`absolute inset-0 pointer-events-none border-4 border-[#294df6]/0 ${
                  isVideoHovered ? "border-[#294df6]/30" : ""
                } transition-all duration-500 z-10`}
                animate={isVideoHovered ? { borderColor: "rgba(41,77,246,0.3)" } : { borderColor: "rgba(41,77,246,0)" }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
