"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
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
                src="/logoblack.png"
                alt="GetMoreSEO Logo"
                width={120}
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
              <Link href="/#examples" className="flex items-center text-gray-700 font-medium text-sm">
                Examples
              </Link>
            </div>
            <Link href="/#howitworks" className="text-gray-700 font-medium text-sm">
              How It Works
            </Link>
            <div className="relative group">
              <Link href="/#faq" className="flex items-center text-gray-700 font-medium text-sm">
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
              
              <Link href="/#features" className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
                Features
              </Link>
              <Link href="/#examples" className="text-gray-700 font-medium px-3 py-2">
                Examples
              </Link>
              <Link
                href="/#howitworks"
                className="flex items-center justify-between text-gray-700 font-medium px-3 py-2"
              >
                How It Works
              </Link>
              <Link href="/#faq" className="flex items-center justify-between text-gray-700 font-medium px-3 py-2">
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
    </>
  )
}