"use client"

import Image from "next/image"
import Link from "next/link"
import { Inter } from "next/font/google"
import { useState, useEffect } from "react"
import { Menu, X, CreditCard, Clock, ShieldCheck, ChevronRight } from "lucide-react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className={`min-h-screen flex flex-col ${inter.variable} font-sans`}>
      {/* Promotion Banner */}
      <div className="bg-gradient-to-r from-[#294df6] to-[#3b5af8] text-white py-3 px-4 flex items-center justify-between text-sm md:text-base">
        <div className="flex-1 hidden sm:block"></div>
        <div className="flex items-center justify-center flex-1">
          <div className="bg-white/20 rounded-full p-1 mr-2">
            <span className="text-xs">🔥</span>
          </div>
          <span className="font-medium text-xs sm:text-sm md:text-base">
            Limited time offer: <span className="font-bold">68% off</span> on the annual plan
          </span>
        </div>
        <div className="flex items-center justify-end flex-1">
          <Link href="/pricing" className="hidden sm:flex items-center text-xs font-medium hover:underline">
            View plans <ChevronRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <header
        className={`bg-white py-3 md:py-4 px-4 md:px-6 sticky top-0 z-50 transition-all duration-200 ${
          isScrolled ? "shadow-md" : "border-b"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/getmoreseo.png" alt="GetMoreSEO Logo" width={132} height={132} className="mr-2" />
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
          <nav className="hidden md:flex items-center space-x-1">
            {["How It Works", "Features", "Content", "Comparison", "Pricing", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                className="px-3 py-2 text-gray-700 hover:text-[#294df6] transition-colors duration-200 text-sm font-medium"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-[#294df6] hover:text-[#1e3fd0] font-medium text-sm">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-[#294df6] hover:bg-[#1e3fd0] text-white px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Start For Free Today
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg p-4 z-50">
            <nav className="flex flex-col space-y-3">
              {["How It Works", "Features", "Content", "Comparison", "Pricing", "FAQ"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "")}`}
                  className="px-3 py-2 text-gray-700 hover:text-[#294df6] font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
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
                  Start For Free Today
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative overflow-hidden bg-gradient-to-br from-[#f0f3ff] via-white to-[#e6ebff]">
          {/* Background Elements */}
          <div className="absolute top-20 right-0 w-64 h-64 bg-[#294df6]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#294df6]/5 rounded-full blur-3xl"></div>

          <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32 relative z-10">
            {/* Text Content */}
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center bg-[#294df6]/10 rounded-full px-3 py-1 mb-6 text-sm text-[#294df6] font-medium">
                <span className="mr-2">✨</span>
                <span>AI-Powered SEO Content</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 md:mb-8">
                <span className="text-gray-800">SEO</span> <span className="text-[#294df6]">Blogging on Autopilot</span>
              </h1>

              <p className="text-gray-600 text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto">
                100% automated blog creation that ranks on Google, delivers real results, and requires zero effort from
                you.
              </p>

              <div className="flex flex-col sm:flex-row mb-8 md:mb-10 w-full max-w-md mx-auto">
                <div className="relative flex-grow mb-3 sm:mb-0 sm:mr-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#294df6] focus:border-transparent text-base shadow-sm"
                  />
                </div>
                <Link
                  href="/signup"
                  className="bg-[#294df6] hover:bg-[#1e3fd0] text-white px-6 py-3 rounded-md font-medium text-base whitespace-nowrap transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Start For Free
                </Link>
              </div>

              <div className="mb-10">
                <div className="flex items-center justify-center">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden bg-gray-300 shadow-sm"
                      >
                        <Image src={`/abc3.jpg`} alt={`User ${i}`} width={40} height={40} />
                      </div>
                    ))}
                  </div>
                  <span className="ml-3 md:ml-4 text-gray-700 font-medium text-sm sm:text-base">
                    Join <span className="font-bold">25,260+</span> business owners
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 md:gap-6 text-sm justify-center">
                {[
                  { icon: <CreditCard className="h-5 w-5" />, text: "Start For Free" },
                  { icon: <Clock className="h-5 w-5" />, text: "Articles in 30 secs" },
                  { icon: <ShieldCheck className="h-5 w-5" />, text: "Plagiarism Free" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm">
                    <div className="mr-2 text-[#294df6]">{feature.icon}</div>
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        </main>

     

          
    </div>
  )
}
