"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVideoHovered, setIsVideoHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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

  useEffect(() => {
    // Simulate loading time and then hide the loader
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col font-poppins">
      {isLoading && (
        <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-t-4 border-[#294df6] rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-[#7733ee] rounded-full animate-spin-slow"></div>
          </div>
          <div className="mt-8 flex flex-col items-center">
            <Image
              src="/logoblack.png"
              alt="GetMoreSEO Logo"
              width={150}
              height={150}
              className="object-contain animate-pulse"
            />
            <p className="text-gray-600 mt-4 font-medium">Loading amazing content...</p>
          </div>
        </div>
      )}
      {/* Promotion Banner */}
      <div className="bg-[#294df6] text-white py-3 px-4 flex items-center justify-center text-sm md:text-base">
        <span className="font-medium text-xs sm:text-sm md:text-base flex items-center">
          <span className="mr-2">🚀</span>
          Launch Offer: 57% OFF on All Plans 
        </span>
        
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
              <Image
                src="/logoblack.png" // Replace this with the path to your logo image
                alt="GetMoreSEO Logo"
                width={120} // Adjust size as needed
                height={120}
                className="object-contain"
              />
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
              <Link href="/" className="flex items-center text-gray-700 font-medium text-sm">
                Home
              </Link>
            </div>
            <div className="relative group">
              <Link href="#results" className="flex items-center text-gray-700 font-medium text-sm">
                Results
              </Link>
            </div>
            <div className="relative group">
              <Link href="#examples" className="flex items-center text-gray-700 font-medium text-sm">
                Examples
              </Link>
            </div>
            <Link href="#howitworks" className="text-gray-700 font-medium text-sm">
              How It Works
            </Link>
            <div className="relative group">
              <Link href="#faq" className="flex items-center text-gray-700 font-medium text-sm">
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
              <Link href="/" className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Home
              </Link>
              <Link href="#results" className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Results
              </Link>
              <Link href="#features" className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Features
              </Link>
              <Link href="/#examples" className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Examples
              </Link>
              <Link
                href="/#howitworks"
                className="flex items-center justify-between text-gray-700 font-medium px-3 py-2"
              >
                How It Works
              </Link>
              <Link href="#faq" className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
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
          {/* Grid Background */}
          <div
            className="absolute inset-0 bg-[#f8f8f8]"
            style={{
              backgroundImage: `linear-gradient(to right, #c0c0c0 1px, transparent 1px), 
                linear-gradient(to bottom, #c0c0c0 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
              backgroundPosition: "0 0",
            }}
          ></div>

          {/* Background Elements */}
          <div className="absolute top-20 right-0 w-64 h-64 bg-[#294df6]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#f92d6]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-28 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge with #1 */}
            <div className="flex justify-center mb-4">
              <div className="bg-amber-100 text-amber-800 rounded-full px-4 py-1 inline-flex items-center font-bold">
                #1 Ranked Most Affordable Automated Blogging AI Agent
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
              <span className="text-gray-900">SEO Blogging on Autopilot</span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-700 text-lg mb-10 max-w-3xl mx-auto">
              Fully automated blog creation that ranks on Google and grows your business—without lifting a finger.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
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
              <Link
                href="/signup"
                className="bg-[#294fd6] hover:bg-[#7733ee] text-white rounded-full py-3 px-6 font-medium transition-all flex items-center justify-center"
              >
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
              </Link>
            </div>
          </div>

          {/* YouTube Video Section - Perfectly Centered */}
          <div className="flex justify-center items-center w-full mt-24 mb-24">
            <div
              className="w-full max-w-[1000px] aspect-[16/9] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative flex items-center justify-center rounded-xl overflow-hidden shadow-2xl border-8 border-gray-800 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(41,77,246,0.5)] z-20"
              onMouseEnter={() => setIsVideoHovered(true)}
              onMouseLeave={() => setIsVideoHovered(false)}
              ref={videoContainerRef}
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
              <div className="absolute top-4 right-4 bg-[#294df6] text-white px-4 py-2 rounded-full font-bold z-30 video-badge pointer-events-none">
                WATCH NOW
              </div>

              {/* YouTube Embed */}
              <iframe
                src="https://www.youtube.com/embed/eqn0Uv0xm_o?autoplay=0&rel=0&showinfo=1&modestbranding=1&controls=1"
                title="100% Autopilot SEO Blogging AI agent | GetMoreSEO | Markupx Brands"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full object-cover z-20"
              ></iframe>

              {/* Animated Glow Effect - Only on the border, not covering the video */}
              <div
                className={`absolute inset-0 pointer-events-none border-4 border-[#294df6]/0 ${
                  isVideoHovered ? "border-[#294df6]/30" : ""
                } transition-all duration-500 z-10`}
              ></div>
            </div>
          </div>

         
        </div>
      </main>
    </div>
  )
}
