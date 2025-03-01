"use client"

import { motion } from "framer-motion"
import { Users, Crown, FileSearch, Sparkles, UserCheck, ArrowRight } from "lucide-react"
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
    icon: Sparkles,
    title: "Deep research AI layer",
    description:
      "Advanced AI algorithms that enhance human creativity with data-driven insights and content optimization.",
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

      {/* Quote Bubble */}
      <div className="absolute left-4 top-8 md:left-12 md:top-12 max-w-[250px] z-10 hidden md:block">
        <div className="relative">
          <div className="absolute -left-2 -top-2 h-4 w-4 rotate-45 bg-white border border-gray-300" />
          <div className="rounded-xl bg-white p-5 text-sm border border-gray-300 shadow-sm">
            <blockquote className="italic text-gray-700">
              <p>
                "AI isn't enough. Creativity needs a human-powered system-brain built for blogs that engage and
                convert!"
              </p>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl relative z-10 pb-16">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 id="flow-section-title" className="mb-4 text-3xl md:text-4xl lg:text-5xl font-bold">
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              "Human-Led,{" "}
            </span>
            <span className="text-orange-500">AI-Powered</span>
            <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">"</span>
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 max-w-3xl mx-auto">
            Our 5-Layer System Gets Results!
          </p>
          <div className="mt-6 w-24 h-1 bg-gradient-to-r from-gray-400 to-gray-300 mx-auto rounded-full"></div>
        </motion.div>

        {/* Flow Diagram */}
        <div className="relative">
          {/* SVG Connectors - Desktop Only */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none" aria-hidden="true">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
            >
              <path
                d="M200 120 C 300 120, 350 250, 400 250"
                stroke="url(#gradient1)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <path
                d="M600 250 C 650 250, 700 120, 800 120"
                stroke="url(#gradient2)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <path
                d="M200 380 C 300 380, 350 250, 400 250"
                stroke="url(#gradient3)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <path
                d="M600 250 C 650 250, 700 380, 800 380"
                stroke="url(#gradient4)"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d1d5db" />
                  <stop offset="100%" stopColor="#9ca3af" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9ca3af" />
                  <stop offset="100%" stopColor="#d1d5db" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d1d5db" />
                  <stop offset="100%" stopColor="#9ca3af" />
                </linearGradient>
                <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9ca3af" />
                  <stop offset="100%" stopColor="#d1d5db" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Mobile Connectors */}
          <div
            className="lg:hidden absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-300 pointer-events-none"
            aria-hidden="true"
          />

          {/* Flow Items */}
          <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3 mb-16">
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
                  className="rounded-xl bg-white p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md group"
                  tabIndex={0}
                >
                  <div className="mb-5 flex items-center gap-4">
                    <span className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-xl font-bold text-gray-700 group-hover:bg-gray-200 transition-colors">
                      {item.number}
                    </span>
                    <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                      <item.icon className="h-5 w-5 text-gray-700" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-xl mb-3 group-hover:text-gray-900 transition-colors">
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
            className="mt-16 flex justify-center lg:justify-end"
          >
            <Button
              variant="secondary"
              className="group bg-white text-gray-800 hover:bg-gray-50 border-2 border-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105 px-8 py-4 rounded-full shadow-lg hover:shadow-xl"
            >
              <span className="text-lg font-semibold">Want to Explore more?</span>
              <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-2" aria-hidden="true" />
              <span className="sr-only">Learn more about our 5-layer system</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

