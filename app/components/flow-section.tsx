"use client"

import { motion } from "framer-motion"
import { Users, Crown, FileSearch, BarChart2, UserCheck, ArrowRight } from "lucide-react"
import { Button } from "@/app/components/ui/button"

const flowItems = [
  {
    number: 1,
    icon: Users,
    title: "Expert SEO writers",
    description:
      "Our team of specialized writers combines SEO knowledge with compelling storytelling to create content that ranks and engages.",
  },
  {
    number: 2,
    icon: Crown,
    title: "Experienced SaaS Founders",
    description:
      "Led by industry veterans who understand the unique challenges of SaaS marketing and content strategy.",
  },
  {
    number: 3,
    icon: FileSearch,
    title: "ICP research technology",
    description:
      "Proprietary tools that analyze your ideal customer profile to create highly targeted content that resonates with your audience.",
  },
  {
    number: 4,
    icon: BarChart2,
    title: "Performance Analytics",
    description:
      "Comprehensive tracking and analysis of content performance metrics to continuously optimize your strategy and maximize ROI.",
  },
  {
    number: 5,
    icon: UserCheck,
    title: "Expert review team",
    description:
      "Dedicated quality assurance specialists who ensure every piece of content meets our rigorous standards before delivery.",
  },
]

export default function FlowSection() {
  return (
    <section className="relative bg-white px-4 py-20 md:py-32 overflow-hidden" aria-labelledby="flow-section-title">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#666 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Pill Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block mb-6"
          >
            <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">Our Process</span>
          </motion.div>

          {/* Heading with Highlight */}
          <h2 id="flow-section-title" className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="bg-[#e3ff40] px-3 py-1">5-Layer System</span> for Content Excellence
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive approach ensures your content stands out and delivers results.
          </p>
        </motion.div>

        <div className="relative">
          {/* Flow Items */}
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {flowItems.map((item, index) => (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative ${index === 2 ? "md:col-span-2 lg:col-span-1" : ""} ${
                  index === 1 || index === 3 ? "lg:translate-y-16" : ""
                }`}
              >
                <div
                  className="rounded-xl bg-white p-6 sm:p-8 border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md group h-full"
                  style={{
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                    background: "linear-gradient(to bottom right, rgba(255, 255, 255, 1), rgba(249, 250, 251, 0.8))",
                  }}
                  tabIndex={0}
                >
                  <div className="mb-4 flex items-center gap-4">
                    <span className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-xl font-bold text-gray-700 group-hover:bg-gray-200 transition-colors">
                      {item.number}
                    </span>
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <item.icon className="h-5 w-5 text-gray-700" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-xl mb-2 group-hover:text-gray-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex justify-end mt-4"
          >
            <Button
              variant="secondary"
              className="group bg-white text-gray-800 hover:bg-gray-50 border-2 border-gray-200 transition-all duration-300 ease-in-out transform hover:scale-105 px-6 py-3 rounded-full shadow-sm hover:shadow-md"
            >
              <span className="text-base font-medium">Want to Explore more?</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              <span className="sr-only">Learn more about our 5-layer system</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

