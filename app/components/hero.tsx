"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <div className="relative min-h-screen bg-white">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-5">
        {[...Array(48)].map((_, i) => (
          <div key={i} className="border border-gray-200" />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Warning Banner */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-orange-50 rounded-full px-4 py-2 mb-12 max-w-fit mx-auto"
        >
          <p className="text-sm text-orange-800 flex items-center gap-2">
            <span className="font-medium">⚠️ Warning:</span>
            Competitors Saving Time, You&apos;re Losing Reach!
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="text-center space-y-8">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900"
          >
            Strategic Blogging <span className="text-orange-500">Loved by</span>
            <br />
            Readers Ranked by <span className="text-orange-500">Google</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg text-gray-600"
          >
            Expert Blogs Powered by AI & ICP Strategies | Fast Google Rankings in 120 Days
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="flex items-center gap-2 px-6 py-3 text-gray-600 bg-white rounded-full border border-gray-200 hover:border-gray-300 transition-colors">
              <Image src="/google.svg" alt="Google" width={20} height={20} />
              Join with Google
            </button>
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full transition-colors font-medium">
              Start for free
            </button>
          </motion.div>

          {/* Video Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="relative rounded-3xl border-4 border-orange-500 aspect-video overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-2xl font-bold text-gray-400">VIDEO</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

