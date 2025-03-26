"use client"

import { motion } from "framer-motion"
import { ArrowRight, Zap, Star, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function UniversalBlogCTA() {
  const [isMobile, setIsMobile] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkSize()
    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  if (dismissed) return null

  return (
    <section id="contact" className="py-8 md:py-12 bg-[#FF9626] relative overflow-hidden">
      {/* Close button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 z-20 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-white opacity-5"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-white opacity-5"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center px-3 py-1 bg-white/20 text-white text-xs sm:text-sm font-medium rounded-full mb-3 sm:mb-4">
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            SUPERCHARGE YOUR BLOG
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-white leading-tight">
            Publish Quality Content{" "}
            <span className="relative">
              <span className="relative z-10">Consistently</span>
              <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-2 sm:h-3 bg-white/20 rounded-full -z-0"></span>
            </span>
          </h2>

          <p className="text-base sm:text-lg text-white opacity-95 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Let our expert writers create engaging blog content while you focus on growing your business.
          </p>

          {/* Testimonial - Hidden on mobile */}
          {!isMobile && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-5 border border-white/20 text-left max-w-md mx-auto">
              <div className="flex items-center mb-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-3 w-3 text-yellow-300 fill-yellow-300" />
                  ))}
                </div>
                <span className="ml-2 text-white text-xs">5.0 rating</span>
              </div>
              <p className="text-white italic text-xs">
                "Blogosocial transformed our content strategy with consistent, high-quality posts that drive real
                results!"
              </p>
              <div className="flex items-center mt-1">
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
                  JD
                </div>
                <div className="ml-2">
                  <p className="text-white text-xs font-medium">Jessica Davis</p>
                  <p className="text-white/70 text-xs">Marketing Director</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Link
              href="/pricing"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-gray-50 transition-all duration-300 text-sm sm:text-base group"
            >
              Start Publishing
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 sm:mt-6 flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-2 text-white text-xs sm:text-sm"
          >
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 bg-white rounded-full mr-1.5"></div>
              <span>Weekly Delivery</span>
            </div>
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 bg-white rounded-full mr-1.5"></div>
              <span>SEO Optimized</span>
            </div>
            <div className="flex items-center">
              <div className="h-1.5 w-1.5 bg-white rounded-full mr-1.5"></div>
              <span>Expert Writers</span>
            </div>
            {!isMobile && (
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 bg-white rounded-full mr-1.5"></div>
                <span>100% Satisfaction</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

