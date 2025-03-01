"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

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
    <section className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Have Questions?</h2>
        <p className="text-gray-600">If you can't find what you're looking for, feel free to reach out!</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden bg-white"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <span className="font-medium text-gray-900">
                <span className="text-[#FF8A00] mr-2">{index + 1}.</span>
                {faq.question}
              </span>
              <span className="ml-4 flex-shrink-0">
                {openIndex === index ? (
                  <Minus className="h-5 w-5 text-[#FF8A00]" />
                ) : (
                  <Plus className="h-5 w-5 text-[#FF8A00]" />
                )}
              </span>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-4 text-gray-600">{faq.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

