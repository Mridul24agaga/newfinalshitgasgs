"use client"

import { motion } from "framer-motion"

export function GuideSection() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-8">
          <motion.h2
            className="text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ultimate Guide
          </motion.h2>

          {/* Video Container */}
          <motion.div
            className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Replace this div with your video component */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">Video Player</div>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-2xl font-semibold text-gray-900">Using AI to Write Blog Posts: The Ultimate Guide</h3>
            <div className="text-lg text-gray-600">Table of Contents</div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

