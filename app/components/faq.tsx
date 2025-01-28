"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

export default function FAQ() {
  const [activeQuestion, setActiveQuestion] = useState(0)

  const questions = [
    {
      question: "Do I need technical SEO knowledge to use SeoRocket?",
      answer:
        "Not at all! SeoRocket.ai is designed to be user-friendly, even for those without a technical SEO background. Our intuitive interface and AI-powered tools guide you through the optimization process, making it easy to create content that ranks.",
    },
    {
      question: "How quickly can I expect to see results?",
      answer:
        "Results vary by industry and competition level, but most users see improvements in their content quality and search rankings within 4-6 weeks of consistent use.",
    },
    {
      question: "Will using SeoRocket guarantee a #1 ranking on Google?",
      answer:
        "While we provide powerful tools and best practices for SEO optimization, no tool can guarantee #1 rankings. We help you create high-quality, optimized content that has the best possible chance of ranking well.",
    },
    {
      question: "Can I try SeoRocket before committing to a subscription?",
      answer:
        "Yes! We offer a free trial period so you can explore all our features and see the value SeoRocket brings to your content strategy.",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-16 items-start">
        <div className="space-y-6">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <div className="w-6 h-[1px] bg-gray-600"></div>
              <div>Frequently Asked Questions</div>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 max-w-2xl">
              Everything You Need To Know About Boosting Your Search Rankings
            </h2>
          </div>

          <div className="space-y-3">
            {questions.map((item, index) => (
              <div
                key={index}
                className={`rounded-lg p-4 cursor-pointer transition-all duration-300 ease-in-out ${
                  activeQuestion === index ? "bg-[#4F46E5] text-white" : "bg-white border text-gray-900"
                } animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setActiveQuestion(activeQuestion === index ? -1 : index)}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[15px] font-medium">{item.question}</span>
                  <div
                    className={`transform transition-transform duration-300 ${activeQuestion === index ? "rotate-180" : ""}`}
                  >
                    {activeQuestion === index ? (
                      <Minus className="h-5 w-5 flex-shrink-0" />
                    ) : (
                      <Plus
                        className={`h-5 w-5 flex-shrink-0 ${
                          activeQuestion === index ? "text-white" : "text-[#4F46E5]"
                        }`}
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`mt-2 text-[15px] text-white/90 overflow-hidden transition-all duration-300 ease-in-out ${
                    activeQuestion === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#FFF9E6] rounded-3xl p-8 animate-fade-in-right">
          {/* Add your score interface image here */}
          <div className="text-gray-400">Score Interface Placeholder</div>
        </div>
      </div>
    </div>
  )
}

