"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

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
              <Link href="/login" className="px-3 py-2 text-[#294df6] font-medium" onClick={() => setIsMenuOpen(false)}>
                Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
