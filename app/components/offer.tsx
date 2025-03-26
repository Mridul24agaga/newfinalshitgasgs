"use client"

import { motion } from "framer-motion"
import { Rocket, Star, Clock, Users, ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export default function EarlyBirdOffer() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 font-['Saira',sans-serif]">
      <motion.div
        className="relative rounded-3xl overflow-hidden border-2 border-[#FF9626] bg-gradient-to-br from-white to-[#FFF8F0]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background decorative elements */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#FF9626]/10 rounded-full blur-xl"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#FF9626]/10 rounded-full blur-xl"></div>

        {/* Corner badge */}
        <div className="absolute top-0 right-0">
          <div className="bg-[#FF9626] text-white py-1 px-8 rotate-45 translate-x-6 translate-y-4 shadow-md font-medium">
            Limited
          </div>
        </div>

        <div className="p-8 md:p-12 relative z-10">
          <div className="text-center space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block bg-[#FF9626]/10 px-6 py-2 rounded-full"
            >
              <h2 className="flex items-center justify-center gap-3 text-3xl md:text-5xl font-bold text-[#FF9626] tracking-tight">
                <Rocket className="h-7 w-7 md:h-9 md:w-9" />
                Early Bird Special Offer
              </h2>
            </motion.div>

            {/* Description */}
            <motion.div
              className="space-y-3 text-gray-700 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p className="text-lg md:text-xl font-medium">
                Lock in these special prices now! Limited to first 20 customers only.
              </p>
              <p className="text-base md:text-lg">Regular pricing will be activated after all spots are filled.</p>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {[
                {
                  value: "60%",
                  label: "Savings",
                  icon: <Star className="h-6 w-6 text-[#FF9626]" />,
                  description: "Off regular price",
                },
                {
                  value: "120",
                  label: "Days Guarantee",
                  icon: <Clock className="h-6 w-6 text-[#FF9626]" />,
                  description: "Risk-free trial",
                },
                {
                  value: "20",
                  label: "Spots Left",
                  icon: <Users className="h-6 w-6 text-[#FF9626]" />,
                  description: "Going fast!",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white rounded-2xl py-6 px-6 shadow-lg border border-gray-100 flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + index * 0.1,
                  }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                >
                  <div className="mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-base md:text-lg font-medium text-[#FF9626]">{stat.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.description}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Benefits */}
            <motion.div
              className="mt-10 bg-white rounded-2xl p-6 shadow-md max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Early Bird Benefits:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "Lifetime discount on subscription",
                  "Priority customer support",
                  "Free strategy consultation",
                  "Exclusive content templates",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-2 mt-1">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* CTA Link - Converted from button to Link */}
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Link
              href="#pricing"
              className="group bg-[#FF9626] text-white px-10 py-4 rounded-full text-xl md:text-2xl font-bold hover:bg-[#FF7A00] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto inline-flex"
            >
              Claim Your Early Bird Offer
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-gray-500 mt-4 text-sm">
              *Offer valid for a limited time only. Terms and conditions apply.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

