"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X } from "lucide-react"
import { Saira } from "next/font/google"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

const faqs = [
  {
    question: "What is the 5-layer system, and how does it improve content quality?",
    answer:
      "Our 5-layer system combines expert writers, AI technology, and rigorous quality control to create exceptional content. Each piece goes through expert SEO writers, experienced SaaS founders' review, ICP research technology analysis, deep AI research layer, and final quality review team. This comprehensive approach ensures content that's not only engaging but also strategically aligned with your business goals.",
  },
  {
    question: "Do you use AI to generate blogs, or is it human-written?",
    answer:
      "We utilize a hybrid approach that we call 'Human-Led, AI-Powered.' Our content is primarily written by expert human writers who leverage AI tools for research, optimization, and enhancement. This combination ensures the content maintains a natural, engaging tone while benefiting from AI-driven insights and data-backed recommendations.",
  },
  {
    question: "How is this different from other blog-writing tools or services?",
    answer:
      "Unlike traditional content services or pure AI tools, we offer a unique blend of human expertise and advanced technology. Our platform integrates deep industry knowledge, proprietary ICP research technology, and a multi-stage quality control process. This results in content that's not just well-written, but strategically crafted to engage your target audience and drive business results.",
  },
  {
    question: "Will my blogs be SEO-optimized and rank on Google?",
    answer:
      "Yes, SEO optimization is built into every step of our content creation process. Our writers are SEO experts who understand search intent, keyword optimization, and content structure. Combined with our AI-powered research tools and industry best practices, we create content specifically designed to perform well in search rankings while maintaining readability and engagement.",
  },
  {
    question: "Can I customize the tone and style of my content?",
    answer:
      "We understand that brand voice is crucial. Before starting any project, we work with you to understand your brand's tone, style, and communication preferences. Our writers can adapt to various styles - from professional and technical to casual and conversational. We also maintain a style guide for your brand to ensure consistency across all content pieces.",
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className={`${saira.className} max-w-4xl mx-auto px-4 py-16`}>
      <div className="text-center mb-12">
        {/* Pill Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block mb-6"
        >
          <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">Common Questions</span>
        </motion.div>

        {/* Heading with Highlight */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
        >
          <span className="bg-[#FF9626] px-3 py-1 text-white">Frequently</span> asked questions!
        </motion.h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
      >
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * index + 0.3 }}
              className="border-b border-gray-100 last:border-0"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-4 flex items-center justify-between text-left group"
              >
                <span className="font-medium text-gray-900 text-lg">{faq.question}</span>
                <span className="ml-4 flex-shrink-0">
                  {openIndex === index ? (
                    <X className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Plus className="h-5 w-5 text-gray-500" />
                  )}
                </span>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="pb-4 text-gray-600 leading-relaxed">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

