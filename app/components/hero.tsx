"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { spaceGrotesk } from "./fonts"

const SearchBar = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-row items-center gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-full max-w-xl mx-auto lg:mx-0"
    >
      <div className="flex-1 px-4 py-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-500"
        />
      </div>
      <button className="px-6 py-3 bg-mint hover:bg-opacity-90 text-gray-900 rounded-full transition-colors font-medium whitespace-nowrap">
        Search
      </button>
    </motion.div>
  )
}

export function Hero() {
  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-br from-[#1A1257] via-[#2B3582] to-[#0066FF] ${spaceGrotesk.variable}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[url('/stars.png')]"
      />

      {/* Sparkle Spotlights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-96 h-96 bg-gradient-radial from-white/20 to-transparent rounded-full blur-2xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-12 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="space-y-2 sm:space-y-2">
                <motion.span
                  className="text-mint leading-none block text-4xl sm:text-5xl lg:text-4xl font-bold tracking-[-0.02em] font-space-grotesk"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  AI Blog Writer
                </motion.span>
                <motion.span
                  className="text-white leading-none block text-5xl sm:text-5xl lg:text-[64px] font-bold tracking-[-0.02em] font-space-grotesk"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Skyrocket Your Traffic
                </motion.span>
              </h1>
              <motion.p
                className="text-lg sm:text-xl text-white/80 font-light leading-relaxed max-w-xl mx-auto lg:mx-0 hidden sm:block"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Hands-Free Blogging to Boost Traffic: AI Generates High-Quality Articles That Convert Visitors to
                Customers
              </motion.p>
            </motion.div>

            {/* Mobile CTA Button */}
            <motion.button
              className="px-8 py-4 bg-white text-gray-900 rounded-lg text-xl font-medium block w-full sm:hidden mx-auto mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Get Started - it's free
            </motion.button>

            <motion.div className="hidden sm:block space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-full max-w-xl mx-auto lg:mx-0"
              >
                <div className="flex items-center flex-1 px-4 py-2">
                  <span className="text-white/60 mr-2 whitespace-nowrap text-sm">Write about</span>
                  <input
                    type="text"
                    placeholder="How to buy a house"
                    className="w-full bg-transparent border-0 text-white placeholder:text-white/40 focus:outline-none focus:ring-0 text-sm"
                  />
                </div>
                <button className="px-6 py-3 bg-mint hover:bg-opacity-90 text-gray-900 rounded-full transition-colors font-medium whitespace-nowrap">
                  Generate
                </button>
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.svg
                        key={i}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 1 + i * 0.1 }}
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </motion.svg>
                    ))}
                  </div>
                  <span className="text-white text-sm sm:text-base">4.8/5 based on 1000+ reviews</span>
                </div>

                <motion.div
                  className="hidden sm:flex flex-wrap justify-center lg:justify-start gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  {["7-day Free Trial", "No credit card required", "Full Access"].map((text, index) => (
                    <motion.div
                      key={text}
                      className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-mint/20 flex items-center justify-center">
                        <span className="text-mint text-sm">✓</span>
                      </div>
                      <span className="text-white font-light">{text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  className="sm:hidden flex items-center justify-center gap-2 text-sm text-white/80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <span>7-day Free Trial</span>
                  <span>•</span>
                  <span>No credit card required</span>
                  <span>•</span>
                  <span>Full Access</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Image src="/dashboard.png" alt="Blog Writer Dashboard" width={800} height={600} className="rounded-lg" />

            <motion.div
              className="absolute top-1/2 -right-4 bg-white rounded-lg p-4 shadow-xl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">97</div>
                <div className="text-sm text-gray-600">Blog Post Score</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 lg:hidden hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Image
            src="/dashboard.png"
            alt="Blog Writer Dashboard"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl mx-auto"
          />
        </motion.div>
      </div>
    </div>
  )
}

export default SearchBar

