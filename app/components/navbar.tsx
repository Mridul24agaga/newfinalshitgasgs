"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation } from "framer-motion"

export function Navbar() {
  const [lastScrollY, setLastScrollY] = useState(0)
  const controls = useAnimation()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY) {
        controls.start({ y: "-100%" })
      } else {
        controls.start({ y: 0 })
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, controls])

  return (
    <motion.header
      className="fixed top-8 left-0 right-0 z-40" // Changed top-0 to top-8 to account for announcement banner
      initial={{ y: 0 }}
      animate={controls}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="bg-white rounded-full border border-gray-200 px-6 py-2 flex items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="Blogosocial Logo" width={200} height={40} className="w-auto h-8" />
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="#pricing"
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors font-medium"
            >
              Start Now
            </Link>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-600 hover:text-gray-900 transition-colors">
      {children}
    </Link>
  )
}

