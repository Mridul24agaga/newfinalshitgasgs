"use client"

import { motion } from "framer-motion"
import { Search, Calendar, TrendingUp, Sparkles } from "lucide-react"

const steps = [
  {
    title: "Step 1: Share Your Website",
    description:
      "Input your website URL and our AI will analyze your content gaps and identify high-potential keywords to target.",
    icon: Search,
    input: "yourdomain.com",
    tags: ["keyword research", "content gap", "SEO analysis", "ranking opportunities"],
  },
  {
    title: "Step 2: AI-Powered Content Creation",
    description:
      "Our advanced AI creates SEO-optimized content that ranks, scheduled and published automatically to your blog.",
    icon: Calendar,
    preview: true,
  },
  {
    title: "Step 3: Watch Your Traffic Grow",
    description: "See your organic traffic increase as your content starts ranking for targeted keywords on Google.",
    icon: TrendingUp,
    graph: true,
  },
]

function StepCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-white rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-[#3DFEA0] transition-colors"
    >
      <div className="absolute top-0 right-0 bg-[#1C155A] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-tr-2xl rounded-bl-2xl text-sm sm:text-base">
        Step {index + 1}
      </div>

      <div className="mb-6">
        <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#3DFEA0]" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 pr-16">{step.title}</h3>
      <p className="text-gray-600 text-sm sm:text-base mb-6">{step.description}</p>

      {step.input && (
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <input
              type="text"
              placeholder={step.input}
              className="w-full bg-transparent border-none outline-none text-gray-800 placeholder-gray-400 text-sm sm:text-base"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {step.tags?.map((tag) => (
              <span key={tag} className="bg-[#1C155A]/5 text-[#1C155A] px-2.5 py-1 rounded-full text-xs sm:text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {step.preview && (
        <div className="space-y-4">
          <svg className="w-full h-auto" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="120" rx="8" fill="#F3F4F6" />
            <rect x="16" y="16" width="168" height="12" rx="2" fill="#E5E7EB" />
            <rect x="16" y="36" width="140" height="8" rx="2" fill="#E5E7EB" />
            <rect x="16" y="52" width="168" height="8" rx="2" fill="#E5E7EB" />
            <rect x="16" y="68" width="100" height="8" rx="2" fill="#E5E7EB" />
            <rect x="16" y="92" width="60" height="12" rx="2" fill="#3DFEA0" />
            <path d="M184 92H176L180 88L184 92ZM180 100V88.5H180V100Z" fill="#1C155A" />
          </svg>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#3DFEA0]" />
            <span className="text-xs sm:text-sm text-gray-500">Auto-scheduled</span>
          </div>
        </div>
      )}

      {step.graph && (
        <div className="space-y-4">
          <svg className="w-full h-auto" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="120" rx="8" fill="#F3F4F6" />
            <path d="M16 104L68 72L116 88L164 40" stroke="#3DFEA0" strokeWidth="3" strokeLinecap="round" />
            <circle cx="68" cy="72" r="4" fill="#1C155A" />
            <circle cx="116" cy="88" r="4" fill="#1C155A" />
            <circle cx="164" cy="40" r="4" fill="#1C155A" />
          </svg>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#3DFEA0]" />
            <span className="text-xs sm:text-sm text-gray-500">Increasing organic traffic</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function IntroducingSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-gray-200 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#3DFEA0]" />
            <span className="text-[#1C155A] font-medium text-sm sm:text-base">Introducing GetMoreSEO</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
          >
            Your AI-Powered SEO Growth Engine
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4"
          >
            Transform your website's traffic with automated, SEO-optimized content creation. Let our AI handle your
            content strategy while you focus on growing your business.
          </motion.p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 sm:mt-16"
        >
          <button className="bg-[#1C155A] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl text-base sm:text-lg font-medium hover:bg-[#1C155A]/90 transition-colors">
            Start Growing Your Traffic
          </button>
        </motion.div>
      </div>
    </section>
  )
}

