"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown, Star } from "lucide-react"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState("0:00")
  const [duration, setDuration] = useState("2:15")
  const [showControls, setShowControls] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 49,
    seconds: 32,
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newSeconds = prev.seconds - 1
        if (newSeconds >= 0) return { ...prev, seconds: newSeconds }

        const newMinutes = prev.minutes - 1
        if (newMinutes >= 0) return { ...prev, minutes: newMinutes, seconds: 59 }

        const newHours = prev.hours - 1
        if (newHours >= 0) return { hours: newHours, minutes: 59, seconds: 59 }

        clearInterval(timer)
        return { hours: 0, minutes: 0, seconds: 0 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(currentProgress)
      setCurrentTime(formatTime(videoRef.current.currentTime))
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const progressBar = e.currentTarget
      const rect = progressBar.getBoundingClientRect()
      const pos = (e.clientX - rect.left) / rect.width
      videoRef.current.currentTime = pos * videoRef.current.duration
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-poppins">
      {/* Promotion Banner */}
      <div className="bg-[#294df6] text-white py-3 px-4 flex items-center justify-center text-sm md:text-base">
        <span className="font-medium text-xs sm:text-sm md:text-base flex items-center">
          <span className="mr-2">🚀</span>
          Launch Offer: 40% OFF on Yearly Plans – code "LAUNCH"
        </span>
        <div className="flex items-center ml-4">
          <div className="flex items-center space-x-1 mx-2">
            <div className="bg-white/20 rounded px-2 py-1 text-center min-w-[32px]">
              <span className="font-bold">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="text-xs block">HRS</span>
            </div>
            <div className="bg-white/20 rounded px-2 py-1 text-center min-w-[32px]">
              <span className="font-bold">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="text-xs block">MIN</span>
            </div>
            <div className="bg-white/20 rounded px-2 py-1 text-center min-w-[32px]">
              <span className="font-bold">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="text-xs block">SEC</span>
            </div>
          </div>
          <button className="ml-4 bg-white text-[#294df6] px-3 py-1 rounded-md text-sm font-medium">Get Deal</button>
        </div>
      </div>

      {/* Navigation */}
      <header
        className={`bg-white py-4 md:py-5 px-4 md:px-6 sticky top-0 z-50 transition-all duration-200 ${
          isScrolled ? "shadow-md" : "border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="text-xl font-bold text-gray-800">GetMoreSEO</div>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <Link href='/' className="flex items-center text-gray-700 font-medium text-sm">
                Home
              </Link>
            </div>
            <div className="relative group">
              <Link href='#results' className="flex items-center text-gray-700 font-medium text-sm">
                Results
              </Link>
            </div>
            <div className="relative group">
              <Link href='#examples' className="flex items-center text-gray-700 font-medium text-sm">
                Examples 
              </Link>
            </div>
            <Link href="#howitworks" className="text-gray-700 font-medium text-sm">
              How It Works
            </Link>
            <div className="relative group">
              <Link href='#faq' className="flex items-center text-gray-700 font-medium text-sm">
                FAQ
              </Link>
            </div>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-[#294df6] hover:text-[#1e3ed0] font-medium text-sm">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-[#294df6] hover:bg-[#1e3ed0] text-white px-5 py-2.5 rounded-md font-medium text-sm whitespace-nowrap transition-colors duration-200"
            >
              Get Started Today
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4 z-50 animate-fadeIn">
            <nav className="flex flex-col space-y-3">
              <Link href='/' className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Home 
              </Link>
              <Link href='#results' className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Results 
              </Link>
              <Link href='#features' className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Features
              </Link>
              <Link href="/#examples" className="text-gray-700 font-medium px-3 py-2">
                Examples
              </Link>
              <Link href='/#howitworks' className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                How It Works 
              </Link>
              <Link href='#faq' className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                FAQ
              </Link>
              <div className="border-t pt-3 mt-2 flex flex-col space-y-3">
                <Link
                  href="/login"
                  className="px-3 py-2 text-[#294df6] font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-[#294df6] text-white px-4 py-2 rounded-md font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started Today
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative overflow-hidden bg-white">
          {/* Background Elements */}
          <div className="absolute top-20 right-0 w-64 h-64 bg-[#294df6]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#f92d6]/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-20 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                <span className="text-gray-800">Grow Organic Traffic</span>
                <br />
                <span className="text-gray-800">on </span>
                <span className="text-[#294fd6]">Auto-Pilot</span>
              </h1>

              {/* Subtitle */}
              <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto">
                Get traffic and outrank competitors with automatic SEO-optimized content generation while you sleep.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <button className="flex items-center justify-center bg-white border border-gray-300 rounded-full py-3 px-6 text-gray-800 font-medium hover:shadow-md transition-all">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Join with Google
                </button>
                <button className="bg-[#294fd6] hover:bg-[#7733ee] text-white rounded-full py-3 px-6 font-medium transition-all flex items-center justify-center">
                  Get Started for Free
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
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex flex-col items-center mb-12">
                <div className="flex -space-x-2 mb-2">
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="/profile1.jpeg"
                    alt="User"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="/profile2.jpeg"
                    alt="User"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="/profile3.jpeg"
                    alt="User"
                  />
                  <img
                    className="w-10 h-10 rounded-full border-2 border-white"
                    src="/profile4.jpeg"
                    alt="User"
                  />
                </div>
                <div className="flex items-center mb-1">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">50k+ Articles Created</p>
              </div>
            </div>

            {/* Video Section */}
            <div className="max-w-4xl mx-auto mt-8">
              <div
                ref={videoContainerRef}
                className="rounded-xl shadow-2xl overflow-hidden mx-auto transform transition-transform duration-300 hover:scale-[1.02] video-container"
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
              >
                {/* Video Badge */}
                <div className="absolute top-4 left-4 z-10 bg-[#8844ff] text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                  <span className="mr-1">●</span> DEMO
                </div>

                {/* Video Element */}
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    poster="/video-thumbnail.png"
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={() => {
                      if (videoRef.current) {
                        setDuration(formatTime(videoRef.current.duration))
                      }
                    }}
                  >
                    <source src="/demo-video.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Play Button Overlay */}
                  {!isPlaying && (
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-black/30 to-black/10 cursor-pointer"
                      onClick={togglePlay}
                    >
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform transition-transform hover:scale-105">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-[#8844ff] ml-1"
                          viewBox="0 0 24 24"
                          fill="#8844ff"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                      </div>
                      <div className="absolute bottom-10 left-6 right-6 text-white font-medium">
                        <p className="text-xl">See GetMoreSEO in action</p>
                        <p className="text-sm opacity-90 mt-1">Watch our 2-minute product demo</p>
                      </div>
                    </div>
                  )}

                  {/* Video Controls */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex flex-col transition-opacity duration-300 ${
                      showControls || isPlaying ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {/* Progress Bar */}
                    <div
                      className="h-1.5 bg-white/30 rounded-full overflow-hidden mb-3 cursor-pointer"
                      onClick={handleProgressClick}
                    >
                      <div className="h-full bg-[#8844ff]" style={{ width: `${progress}%` }}></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <button onClick={togglePlay} className="text-white mr-4 hover:text-[#8844ff] transition-colors">
                          {isPlaying ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="6" y="4" width="4" height="16"></rect>
                              <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          )}
                        </button>

                        <div className="flex items-center mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-white opacity-80"
                          >
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                          </svg>
                        </div>

                        <span className="text-white text-xs">
                          {currentTime} / {duration}
                        </span>
                      </div>

                      <div className="flex items-center">
                        <button className="text-white opacity-80 hover:opacity-100 transition-opacity">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <polyline points="9 21 3 21 3 15"></polyline>
                            <line x1="21" y1="3" x2="14" y2="10"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Centered Text and Button */}
            <div className="mt-16 text-center max-w-3xl mx-auto">
              <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
                Get traffic and outrank competitors with automatic SEO-optimized content generation while you sleep.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-[#294fd6] hover:bg-[#1e3ed0] text-white rounded-full py-3 px-6 font-medium transition-all"
              >
                Get Started Today
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
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
