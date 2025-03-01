"use client"

import { motion } from "framer-motion"
import { Rocket } from "lucide-react"

export default function EarlyBirdOffer() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div
        className="relative rounded-2xl border-2 border-[#FF8A00] p-8 md:p-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-4">
          <h2 className="flex items-center justify-center gap-2 text-2xl md:text-4xl font-bold text-[#FF8A00]">
            <Rocket className="h-6 w-6 md:h-8 md:w-8" />
            Early Bird Special Offer
          </h2>

          <div className="space-y-1 text-gray-700">
            <p className="text-base md:text-lg">
              Lock in these special prices now! Limited to first 20 customers only.
            </p>
            <p className="text-base md:text-lg">Regular pricing will be activated after 20 spots are filled.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              { value: "60%", label: "Savings" },
              { value: "120", label: "Days Guarantee" },
              { value: "20", label: "Spots Left" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-[#FFF5EB] rounded-full py-3 px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
              >
                <div className="text-xl md:text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm md:text-base text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button className="bg-[#FF8A00] text-white px-8 py-3 rounded-full text-lg md:text-xl font-semibold hover:bg-[#FF7A00] transition-colors duration-200">
            Limited Time deal Only
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

