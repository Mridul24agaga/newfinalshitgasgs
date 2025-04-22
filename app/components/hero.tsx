"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, CreditCard, Clock, ShieldCheck, ChevronDown, Play, Volume2, Maximize2 } from "lucide-react"


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
          <span className="mr-2">🎯</span>
          Spring Sale: 40% OFF on Yearly Plans – code "SUN"
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
              <div className="text-xl font-bold text-gray-800">Arvow</div>
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
              <button className="flex items-center text-gray-700 font-medium text-sm">
                Features <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-700 font-medium text-sm">
                Integrations <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-700 font-medium text-sm">
                Solutions <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
              </button>
            </div>
            <Link href="/pricing" className="text-gray-700 font-medium text-sm">
              Pricing
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-700 font-medium text-sm">
                Resources <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
              </button>
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
              Get 3 Free Articles
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4 z-50 animate-fadeIn">
            <nav className="flex flex-col space-y-3">
              <button className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Features <ChevronDown className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Integrations <ChevronDown className="h-4 w-4" />
              </button>
              <button className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Solutions <ChevronDown className="h-4 w-4" />
              </button>
              <Link href="/pricing" className="text-gray-700 font-medium px-3 py-2">
                Pricing
              </Link>
              <button className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Resources <ChevronDown className="h-4 w-4" />
              </button>
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
                  Get 3 Free Articles
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
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                  <span className="text-gray-800">SEO</span> <span className="text-[#294df6]">Blogging</span>{" "}
                  <span className="text-gray-800">On</span>
                  <br />
                  <span className="text-[#294df6]">Auto-Pilot</span>
                 
                </h1>

                <p className="text-gray-600 text-lg mb-8">
                100% automated blog creation that ranks on Google, delivers real results, and requires zero effort from you.
                </p>

                {/* Email Input */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#294df6] focus:border-transparent text-base"
                      />
                    </div>
                    <button className="bg-[#294df6] hover:bg-[#1e3ed0] text-white px-6 py-3 rounded-md font-medium text-base whitespace-nowrap transition-all duration-200 flex items-center justify-center">
                      Start For Free Today
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-300"
                        >
                          <Image
                            src={`/confident-professional.png?key=gcgxo&height=40&width=40&query=professional headshot person ${i}`}
                            alt={`User ${i}`}
                            width={40}
                            height={40}
                          />
                        </div>
                      ))}
                    </div>
                    <span className="ml-3 text-gray-700 font-medium text-sm">
                      Join <span className="font-bold">25,260+</span> business owners
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 text-sm">
                  {[
                    { icon: <CreditCard className="h-5 w-5" />, text: "Start For Free" },
                    { icon: <Clock className="h-5 w-5" />, text: "Articles in 30 secs" },
                    { icon: <ShieldCheck className="h-5 w-5" />, text: "Plagiarism Free" },
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-2 text-[#294df6]">{feature.icon}</div>
                      <span className="text-gray-700 font-medium">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Enhanced Video */}
              <div className="relative hidden lg:block">
                <div
                  ref={videoContainerRef}
                  className="rounded-xl shadow-2xl overflow-hidden max-w-md mx-auto transform transition-transform duration-300 hover:scale-[1.02] video-container"
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(false)}
                >
                  {/* Video Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-[#294df6] text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
                    <span className="mr-1">●</span> DEMO
                  </div>

                  {/* Video Element */}
                  <div className="relative aspect-video bg-gray-900 overflow-hidden">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      poster="/video-thumbnail.jpg"
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
                          <Play className="h-8 w-8 text-[#294df6] ml-1" fill="#294df6" />
                        </div>
                        <div className="absolute bottom-10 left-6 right-6 text-white font-medium">
                          <p className="text-xl">See Arvow in action</p>
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
                        <div className="h-full bg-[#294df6]" style={{ width: `${progress}%` }}></div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <button
                            onClick={togglePlay}
                            className="text-white mr-4 hover:text-[#294df6] transition-colors"
                          >
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
                              <Play className="h-6 w-6" />
                            )}
                          </button>

                          <div className="flex items-center mr-4">
                            <Volume2 className="h-5 w-5 text-white opacity-80" />
                          </div>

                          <span className="text-white text-xs">
                            {currentTime} / {duration}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <button className="text-white opacity-80 hover:opacity-100 transition-opacity">
                            <Maximize2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Caption */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">See how Arvow can transform your content strategy</p>
                </div>

                {/* Video Features */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[
                    { label: "AI-Powered", value: "Content Generation" },
                    { label: "Publish", value: "Directly to Your Blog" },
                    { label: "SEO", value: "Optimized Articles" },
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xs font-semibold text-[#294df6]">{item.label}</p>
                      <p className="text-sm text-gray-700">{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#294df6]/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#f92d6]/10 rounded-full blur-xl"></div>

                {/* Video Reflection */}
                <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-3/4 h-10 bg-black/10 blur-md rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        
      </main>
    </div>
  )
}
