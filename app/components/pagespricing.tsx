"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingSection() {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Pricing Plans</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Choose a plan that fits your content creation needs</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Trial Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border-2 border-gray-100 hover:border-[#FF9626]/30 transition-all duration-300 overflow-hidden flex flex-col group"
          >
            <div className="p-8 border-b border-gray-100 group-hover:border-[#FF9626]/20 transition-colors">
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-4">
                TRIAL
              </div>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold text-[#FF9626]">$17</span>
                <span className="text-gray-500 ml-2 mb-1">one-time</span>
              </div>
              <p className="text-gray-600 text-lg">7 blogs in 24 hours</p>
            </div>
            <div className="p-8 flex-grow">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#FF9626]/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-[#FF9626]/20 transition-colors">
                    <Check className="h-3.5 w-3.5 text-[#FF9626]" />
                  </div>
                  <span className="text-gray-700">7 expert-crafted blog posts</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#FF9626]/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-[#FF9626]/20 transition-colors">
                    <Check className="h-3.5 w-3.5 text-[#FF9626]" />
                  </div>
                  <span className="text-gray-700">24-hour delivery</span>
                </li>
                <li className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-[#FF9626]/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-[#FF9626]/20 transition-colors">
                    <Check className="h-3.5 w-3.5 text-[#FF9626]" />
                  </div>
                  <span className="text-gray-700">SEO-optimized content</span>
                </li>
              </ul>
            </div>
            <div className="p-8 mt-auto">
              <Link
                href="#contact"
                className="w-full py-4 bg-white border-2 border-[#FF9626] text-[#FF9626] rounded-xl font-medium flex items-center justify-center hover:bg-[#FF9626] hover:text-white transition-all duration-300 text-lg"
              >
                Get Started
              </Link>
            </div>
          </motion.div>

          {/* 30 Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl border-2 border-gray-100 hover:border-[#FF9626]/30 transition-all duration-300 overflow-hidden flex flex-col group relative lg:scale-105 z-10"
          >
            <div className="absolute top-0 right-0 bg-[#FF9626] text-white px-4 py-1 text-sm font-medium rounded-bl-xl rounded-tr-xl">
              POPULAR
            </div>
            <div className="p-8 border-b border-gray-100 group-hover:border-[#FF9626]/20 transition-colors">
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-4">
                MONTHLY
              </div>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold text-[#FF9626]">$149</span>
                <span className="text-gray-500 ml-2 mb-1">/month</span>
              </div>
              <p className="text-gray-600 text-lg">30 Blog posts a month</p>
            </div>
            <div className="p-8 flex-grow">
              <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#FF9626]/20 scrollbar-track-transparent">
                {[
                  "30 Blog posts a month",
                  "Up to 8 images per blog",
                  "Branded blogs",
                  "Company and idea database",
                  "Performance analytics",
                  "Blog settings",
                  "Dedicated SEO expert",
                  "Account manager",
                  "Engagement centric blog",
                  "ICP research updated monthly",
                  "Latest News and trends tracker",
                  "30-Day content planner",
                  "Internal and external linking",
                  "Upto 3000 words",
                  "Human & AI Fact checking",
                  "Low KD keywords targeting",
                  "Tables, Youtube videos and source additions",
                  "Priority support",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626]/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-[#FF9626]/20 transition-colors">
                      <Check className="h-3.5 w-3.5 text-[#FF9626]" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 mt-auto">
              <Link
                href="#contact"
                className="w-full py-4 bg-[#FF9626] text-white rounded-xl font-medium flex items-center justify-center hover:bg-[#e88620] transition-all duration-300 text-lg"
              >
                Get Started
              </Link>
            </div>
          </motion.div>

          {/* 60 Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl border-2 border-gray-100 hover:border-[#FF9626]/30 transition-all duration-300 overflow-hidden flex flex-col group"
          >
            <div className="p-8 border-b border-gray-100 group-hover:border-[#FF9626]/20 transition-colors">
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full mb-4">
                PREMIUM
              </div>
              <div className="flex items-end mb-4">
                <span className="text-4xl font-bold text-[#FF9626]">$249</span>
                <span className="text-gray-500 ml-2 mb-1">/month</span>
              </div>
              <p className="text-gray-600 text-lg">60 Blog posts a month</p>
            </div>
            <div className="p-8 flex-grow">
              <ul className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#FF9626]/20 scrollbar-track-transparent">
                {[
                  "60 Blog posts a month",
                  "Up to 8 images per blog",
                  "Branded blogs",
                  "Company and idea database",
                  "Performance analytics",
                  "Blog settings",
                  "Dedicated SEO expert",
                  "Account manager",
                  "Engagement centric blog",
                  "ICP research updated monthly",
                  "Latest News and trends tracker",
                  "30-Day content planner",
                  "Internal and external linking",
                  "Upto 4000 words",
                  "Human & AI Fact checking",
                  "Low KD keywords targeting",
                  "Central keyword strategy",
                  "Tables, Youtube videos and source additions",
                  "Priority support",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626]/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-[#FF9626]/20 transition-colors">
                      <Check className="h-3.5 w-3.5 text-[#FF9626]" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 mt-auto">
              <Link
                href="#contact"
                className="w-full py-4 bg-white border-2 border-[#FF9626] text-[#FF9626] rounded-xl font-medium flex items-center justify-center hover:bg-[#FF9626] hover:text-white transition-all duration-300 text-lg"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Solo-Founder Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-[#FF9626]/5 to-transparent rounded-3xl border-2 border-[#FF9626]/20 hover:border-[#FF9626]/40 transition-all duration-300 overflow-hidden p-8 group"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="inline-block px-4 py-1.5 bg-[#FF9626] text-white text-sm font-medium rounded-full mb-4">
                BEST VALUE
              </div>
              <h3 className="text-3xl font-bold mb-3">Solo-Founder Plan</h3>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-4xl font-bold text-[#FF9626]">$1499</span>
                <span className="text-gray-500 line-through text-xl">$3996</span>
                <span className="bg-[#FF9626]/10 text-[#FF9626] px-3 py-1.5 rounded-full text-sm font-medium">
                  Save $2497
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="#contact"
                className="px-8 py-4 bg-[#FF9626] text-white rounded-xl font-medium flex items-center justify-center hover:bg-[#e88620] transition-all duration-300 whitespace-nowrap text-lg"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "200+ only high DA directory submissions",
              "X engagement from founders",
              "30+ Paid directory list",
              "SEO and landing page basic audit",
              "60 blogs every month",
              "Dedicated manager support",
            ].map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="h-6 w-6 rounded-full bg-[#FF9626]/10 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 group-hover:bg-[#FF9626]/20 transition-colors">
                  <Check className="h-3.5 w-3.5 text-[#FF9626]" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

