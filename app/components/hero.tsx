"use client"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import Link from "next/link"
import { Play, Pause, Menu } from "lucide-react"
import { Saira } from "next/font/google"

const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    <div className={`${saira.className} relative min-h-screen overflow-hidden`}>
      {/* Background Pattern Layer */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BG%20Image%20%281%29-zn4OAj3qcnywuYray4CPTaX3LdY7Pc.png")',
          backgroundSize: "800px",
          backgroundRepeat: "repeat",
          opacity: 0.03,
          mixBlendMode: "soft-light",
        }}
      />

      {/* Orange Background Layer */}
      <div className="absolute inset-0 z-10 bg-[#fd921c]" style={{ mixBlendMode: "multiply" }} />

      {/* Navbar */}
      <div className="relative z-20">
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="bg-white rounded-full px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
              <Link href="/" className="flex-shrink-0">
                <Image src="/logo.png" alt="Blogosocial Logo" width={160} height={32} className="w-auto h-6 sm:h-8" />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  About
                </Link>
                <Link href="/team" className="text-gray-600 hover:text-gray-900">
                  Team
                </Link>
                <Link href="/vision" className="text-gray-600 hover:text-gray-900">
                  Vision
                </Link>
                <Link href="/mission" className="text-gray-600 hover:text-gray-900">
                  Mission
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-600 focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* CTA Buttons */}
              <div className="hidden sm:flex items-center space-x-2 md:space-x-4">
                <Link
                  href="#pricing"
                  className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-gray-600 bg-white rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <Image src="/google.svg" alt="Google" width={16} height={16} className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Join with Google</span>
                </Link>
                <Link
                  href="#pricing"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[#fd921c] hover:bg-orange-600 text-white rounded-full transition-all duration-300 font-medium"
                >
                  Start for free
                </Link>
              </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 py-2 px-4"
              >
                <div className="flex flex-col space-y-3 py-2">
                  <Link href="/about" className="text-gray-600 hover:text-gray-900 py-1">
                    About
                  </Link>
                  <Link href="/team" className="text-gray-600 hover:text-gray-900 py-1">
                    Team
                  </Link>
                  <Link href="/vision" className="text-gray-600 hover:text-gray-900 py-1">
                    Vision
                  </Link>
                  <Link href="/mission" className="text-gray-600 hover:text-gray-900 py-1">
                    Mission
                  </Link>
                  <div className="pt-2 flex flex-col space-y-2 sm:hidden">
                    <Link
                      href="#pricing"
                      className="flex items-center justify-center gap-2 px-4 py-2 text-gray-600 bg-white rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                    >
                      <Image src="/google.svg" alt="Google" width={20} height={20} />
                      Join with Google
                    </Link>
                    <Link
                      href="#pricing"
                      className="flex items-center justify-center px-4 py-2 bg-[#fd921c] hover:bg-orange-600 text-white rounded-full transition-all duration-300 font-medium"
                    >
                      Start for free
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Warning Banner */}
        <div className="relative z-30 max-w-xl mx-auto mt-4 sm:mt-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 flex items-center justify-center mx-4 sm:mx-0"
          >
            <p className="text-xs sm:text-sm text-gray-800 flex items-center gap-2">
              ⚠️ <span className="hidden xs:inline">Warning:</span> Competitors Saving Time, You&apos;re Losing Reach!
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16">
          <div className="text-center space-y-6 sm:space-y-8">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight"
            >
              <span className="block text-[#2D2D2D]">
                Strategic Blogging <span className="text-white">Loved by</span>
              </span>
              <span className="block text-[#2D2D2D]">
                Readers <span className="text-white">Ranked by</span> Google
              </span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#2D2D2D]"
            >
              Expert Blogs Powered by AI & ICP Strategies | Fast Google Rankings in 120 Days
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
            >
              <Link
                href="#pricing"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 text-sm sm:text-base text-gray-600 bg-white rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <Image src="/google.svg" alt="Google" width={20} height={20} />
                Join with Google
              </Link>
              <Link
                href="#pricing"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white text-[#fd921c] rounded-full transition-colors font-medium hover:bg-gray-100"
              >
                Start for free
              </Link>
            </motion.div>

            {/* Video Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-10 sm:mt-16 max-w-4xl mx-auto"
            >
              <div className="relative bg-white rounded-2xl sm:rounded-3xl aspect-video overflow-hidden shadow-xl">
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
                  className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 cursor-pointer"
                  onClick={handlePlayPause}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 sm:w-6 sm:h-6 text-[#fd921c]" />
                    ) : (
                      <Play className="w-4 h-4 sm:w-6 sm:h-6 text-[#fd921c] ml-0.5 sm:ml-1" />
                    )}
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
        {/* Document Icon */}
        <div className="absolute left-[5%] sm:left-[10%] top-[45%] sm:top-[40%] opacity-20 block">
          <Image
            src="/copy.png"
            alt="Document icon"
            width={80}
            height={80}
            className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
          />
        </div>

        {/* SEO Icon - Moved higher */}
        <div className="absolute right-[5%] sm:right-[10%] top-[30%] sm:top-[25%] opacity-20 block">
          <Image
            src="/web.png"
            alt="SEO icon"
            width={80}
            height={80}
            className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32"
          />
        </div>
      </div>
    </div>
  )
}

