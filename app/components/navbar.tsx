"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useAnimation } from "framer-motion"

export function Navbar() {
  const [lastScrollY, setLastScrollY] = useState(0)
  const controls = useAnimation()
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollThreshold = 10 // Minimum scroll amount to trigger animation

      // Only trigger animation if we've scrolled a meaningful amount
      if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        if (currentScrollY > lastScrollY) {
          setVisible(false)
          controls.start({
            y: "-100%",
            opacity: 0,
            scale: 0.98,
            transition: {
              duration: 0.5,
              ease: [0.1, 0.9, 0.2, 1], // Custom easing for smoother motion
            },
          })
        } else {
          setVisible(true)
          controls.start({
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.4,
              ease: [0.1, 0.9, 0.2, 1], // Custom easing for smoother motion
            },
          })
        }
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, controls])

  return (
    <motion.header
      className="fixed top-8 left-0 right-0 z-40" // Top-8 to account for announcement banner
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={controls}
      style={{
        transformOrigin: "top",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.nav
          className="bg-white rounded-full border border-gray-200 px-6 py-2 flex items-center justify-between"
          layout // This helps with smoother layout transitions
        >
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="Blogosocial Logo" width={200} height={40} className="w-auto h-8" />
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              href="#pricing"
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-all duration-300 font-medium hover:scale-105"
            >
              Start Now
            </Link>
          </div>
        </motion.nav>
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

