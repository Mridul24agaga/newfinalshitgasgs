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
    question: "What are SEO blog posts?",
    answer:
      "SEO blog posts are articles written with the primary goal of improving a website's visibility on search engines like Google. They are optimized using targeted keywords, internal and external links, meta descriptions, and other SEO techniques to attract organic traffic while providing valuable content for readers.",
  },
  {
    question: "Are blog posts good for SEO?",
    answer:
      "Yes, blog posts are excellent for SEO. They help improve your website's visibility by targeting relevant keywords, increasing domain authority through backlinks, and keeping your site updated with fresh content. Blogs also provide opportunities for internal linking, which enhances site structure and user experience.",
  },
  {
    question: "Why is blogging important for SEO?",
    answer:
      "Blogging is crucial for SEO because: It allows you to target long-tail keywords that attract niche audiences. Regular updates signal to search engines that your site is active and relevant. High-quality blogs build authority and trust, improving rankings over time. Blogs encourage backlinks from other websites, boosting domain authority.",
  },
  {
    question: "How do I make my blog SEO-friendly?",
    answer:
      "To make your blog SEO-friendly: Conduct keyword research to identify relevant terms. Use headings (H1, H2, H3) strategically. Optimize meta descriptions and title tags with target keywords. Include internal links to related pages on your site. Add alt text to images for better accessibility and SEO. Ensure fast page loading speeds and mobile responsiveness.",
  },
  {
    question: "How can I increase my blog's SEO performance?",
    answer:
      "Improving your blog's SEO involves: Publishing high-quality, unique content regularly. Incorporating both internal and external links in your blogs. Optimizing for featured snippets by using bullet points or numbered lists for direct answers. Updating old blog posts with fresh information and links. Building backlinks from authoritative websites.",
  },
  {
    question: "What is SEO blog writing?",
    answer:
      "SEO blog writing is the process of creating content that ranks well on search engines while providing value to readers. It involves balancing keyword optimization with engaging storytelling to satisfy both algorithms and human audiences.",
  },
  {
    question: "How does Blogosocial optimize blogs for SEO?",
    answer:
      "Blogosocial uses a unique 5-layer system: 1. Expert Writers: Craft precise, engaging content tailored to your audience's needs. 2. SaaS Founders' Insights: Infuse real-world business expertise into blogs. 3. ICP Research Technology: Analyze Ideal Customer Profiles for hyper-relevant content creation. 4. AI Deep Research Layer: Leverage advanced AI tools like GPT-4 Turbo and Perplexity AI for comprehensive research. 5. Review Team: Ensure every blog meets Google's E-E-A-T (Expertise, Experience, Authoritativeness, Trustworthiness) standards.",
  },
  {
    question: "Does Blogosocial support multi-language blogs?",
    answer:
      "Yes! Blogosocial supports over 50 languages with native linguist validation to ensure cultural relevance and accuracy in global markets.",
  },
  {
    question: "Can Blogosocial help with outdated blogs?",
    answer:
      "Updating old blog posts with fresh information, new links, and optimized keywords is a key part of our service to improve rankings and maintain relevancy.",
  },
  {
    question: "Are blog comments good for SEO?",
    answer:
      "Blog comments can be beneficial if they are genuine and relevant because they: Encourage user engagement, signaling activity to search engines. Provide opportunities for additional keyword usage in discussions. However, spammy or irrelevant comments can harm your website's credibility and should be avoided.",
  },
  {
    question: "Are blog tags important for SEO?",
    answer:
      "Blog tags can help organize content within your site but have minimal direct impact on SEO rankings today. Instead of focusing solely on tags, prioritize creating well-structured categories and optimizing individual posts.",
  },
  {
    question: "What is an example of an effective SEO blog post?",
    answer:
      'An effective SEO blog post includes: A compelling headline with a primary keyword (e.g., "10 Proven Tips to Boost Your Startup\'s Organic Traffic"). Subheadings (H2s) that break down the topic into digestible sections (e.g., "Why Blogging Matters," "How to Optimize Content"). Internal links guiding readers to related articles on your site (e.g., "Learn more about keyword research here").',
  },
  {
    question: "Does Blogosocial use AI tools like ChatGPT?",
    answer:
      "Yes! Blogosocial integrates cutting-edge AI tools like ChatGPT, Perplexity AI, Claude AI, and proprietary ICP research technologies to enhance content quality while maintaining human oversight at every stage.",
  },
  {
    question: "What is a ChatGPT AI blog optimizer?",
    answer:
      "A ChatGPT AI blog optimizer uses advanced language models like GPT-4 Turbo to: Suggest keywords based on trending topics in your industry. Generate draft outlines or full-length articles quickly. Provide recommendations for improving readability and engagement metrics. At Blogosocial, we combine these AI capabilities with human expertise to ensure every piece of content meets the highest standards of quality.",
  },
  {
    question: "How do I know if my business needs SEO blogging?",
    answer:
      "If you want to: Increase organic traffic without relying heavily on paid ads. Build authority in your niche through thought leadership. Improve customer engagement through valuable content... Then investing in high-quality blogs optimized for SEO is essential.",
  },
  {
    question: "Can blogging help rank my homepage higher on Google?",
    answer:
      'Yes! Blogs contribute indirectly by: 1. Attracting backlinks that boost domain authority. 2. Driving traffic that improves overall website performance. 3. Creating internal link structures that pass "link juice" back to important pages like the homepage.',
  },
  {
    question: "What makes Blogosocial different from other platforms?",
    answer:
      "Unlike purely automated platforms or generic writing services, Blogosocial combines: 1. Human expertise from seasoned writers and SaaS founders. 2. Advanced AI tools trained on millions of data points. 3. A rigorous editorial process ensuring accuracy and trustworthiness. This hybrid approach guarantees blogs that rank well and resonate deeply with readers.",
  },
]

export default function FAQSection() {
  // Change the state to track which FAQ is open
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Function to toggle FAQ open/close state
  const toggleFaq = (index: number) => {
    if (openIndex === index) {
      // If clicking on the currently open FAQ, close it
      setOpenIndex(null)
    } else {
      // Otherwise, open the clicked FAQ
      setOpenIndex(index)
    }
  }

  return (
    <section className={`${saira.className} max-w-6xl mx-auto px-4 py-16`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* First Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100"
        >
          <div className="space-y-6">
            {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * Math.min(index, 5) + 0.3 }}
                className="border-b border-gray-100 last:border-0"
              >
                <button
                  onClick={() => toggleFaq(index)}
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
                      <div className="pb-4 text-gray-600 leading-relaxed">
                        {faq.answer.split(". ").map((sentence, i) => {
                          // Check if the sentence is a list item
                          if (
                            sentence.trim().startsWith("It allows") ||
                            sentence.trim().startsWith("Regular updates") ||
                            sentence.trim().startsWith("High-quality blogs") ||
                            sentence.trim().startsWith("Blogs encourage") ||
                            sentence.trim().startsWith("Conduct keyword") ||
                            sentence.trim().startsWith("Use headings") ||
                            sentence.trim().startsWith("Optimize meta") ||
                            sentence.trim().startsWith("Include internal") ||
                            sentence.trim().startsWith("Add alt text") ||
                            sentence.trim().startsWith("Ensure fast") ||
                            sentence.trim().startsWith("Publishing high-quality") ||
                            sentence.trim().startsWith("Incorporating both") ||
                            sentence.trim().startsWith("Optimizing for") ||
                            sentence.trim().startsWith("Updating old") ||
                            sentence.trim().startsWith("Building backlinks") ||
                            sentence.trim().startsWith("Encourage user") ||
                            sentence.trim().startsWith("Provide opportunities") ||
                            sentence.trim().startsWith("A compelling") ||
                            sentence.trim().startsWith("Subheadings") ||
                            sentence.trim().startsWith("Internal links") ||
                            sentence.trim().startsWith("Suggest keywords") ||
                            sentence.trim().startsWith("Generate draft") ||
                            sentence.trim().startsWith("Provide recommendations") ||
                            sentence.trim().startsWith("Increase organic") ||
                            sentence.trim().startsWith("Build authority") ||
                            sentence.trim().startsWith("Improve customer") ||
                            sentence.trim().startsWith("1. Attracting") ||
                            sentence.trim().startsWith("2. Driving") ||
                            sentence.trim().startsWith("3. Creating") ||
                            sentence.trim().startsWith("1. Human") ||
                            sentence.trim().startsWith("2. Advanced") ||
                            sentence.trim().startsWith("3. A rigorous") ||
                            sentence.trim().startsWith("1. Expert") ||
                            sentence.trim().startsWith("2. SaaS") ||
                            sentence.trim().startsWith("3. ICP") ||
                            sentence.trim().startsWith("4. AI") ||
                            sentence.trim().startsWith("5. Review")
                          ) {
                            return (
                              <div key={i} className="flex items-start mb-2">
                                <span className="mr-2 mt-1">•</span>
                                <span>
                                  {sentence.trim()}
                                  {i < faq.answer.split(". ").length - 1 && !sentence.endsWith(".") ? "." : ""}
                                </span>
                              </div>
                            )
                          }

                          // Regular sentence
                          return sentence.trim() ? (
                            <p key={i} className="mb-2">
                              {sentence.trim()}
                              {i < faq.answer.split(". ").length - 1 && !sentence.endsWith(".") ? "." : ""}
                            </p>
                          ) : null
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Second Column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100"
        >
          <div className="space-y-6">
            {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, index) => {
              const actualIndex = index + Math.ceil(faqs.length / 2)
              return (
                <motion.div
                  key={actualIndex}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * Math.min(index, 5) + 0.3 }}
                  className="border-b border-gray-100 last:border-0"
                >
                  <button
                    onClick={() => toggleFaq(actualIndex)}
                    className="w-full py-4 flex items-center justify-between text-left group"
                  >
                    <span className="font-medium text-gray-900 text-lg">{faq.question}</span>
                    <span className="ml-4 flex-shrink-0">
                      {openIndex === actualIndex ? (
                        <X className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-500" />
                      )}
                    </span>
                  </button>

                  <AnimatePresence>
                    {openIndex === actualIndex && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="pb-4 text-gray-600 leading-relaxed">
                          {faq.answer.split(". ").map((sentence, i) => {
                            // Check if the sentence is a list item
                            if (
                              sentence.trim().startsWith("It allows") ||
                              sentence.trim().startsWith("Regular updates") ||
                              sentence.trim().startsWith("High-quality blogs") ||
                              sentence.trim().startsWith("Blogs encourage") ||
                              sentence.trim().startsWith("Conduct keyword") ||
                              sentence.trim().startsWith("Use headings") ||
                              sentence.trim().startsWith("Optimize meta") ||
                              sentence.trim().startsWith("Include internal") ||
                              sentence.trim().startsWith("Add alt text") ||
                              sentence.trim().startsWith("Ensure fast") ||
                              sentence.trim().startsWith("Publishing high-quality") ||
                              sentence.trim().startsWith("Incorporating both") ||
                              sentence.trim().startsWith("Optimizing for") ||
                              sentence.trim().startsWith("Updating old") ||
                              sentence.trim().startsWith("Building backlinks") ||
                              sentence.trim().startsWith("Encourage user") ||
                              sentence.trim().startsWith("Provide opportunities") ||
                              sentence.trim().startsWith("A compelling") ||
                              sentence.trim().startsWith("Subheadings") ||
                              sentence.trim().startsWith("Internal links") ||
                              sentence.trim().startsWith("Suggest keywords") ||
                              sentence.trim().startsWith("Generate draft") ||
                              sentence.trim().startsWith("Provide recommendations") ||
                              sentence.trim().startsWith("Increase organic") ||
                              sentence.trim().startsWith("Build authority") ||
                              sentence.trim().startsWith("Improve customer") ||
                              sentence.trim().startsWith("1. Attracting") ||
                              sentence.trim().startsWith("2. Driving") ||
                              sentence.trim().startsWith("3. Creating") ||
                              sentence.trim().startsWith("1. Human") ||
                              sentence.trim().startsWith("2. Advanced") ||
                              sentence.trim().startsWith("3. A rigorous") ||
                              sentence.trim().startsWith("1. Expert") ||
                              sentence.trim().startsWith("2. SaaS") ||
                              sentence.trim().startsWith("3. ICP") ||
                              sentence.trim().startsWith("4. AI") ||
                              sentence.trim().startsWith("5. Review")
                            ) {
                              return (
                                <div key={i} className="flex items-start mb-2">
                                  <span className="mr-2 mt-1">•</span>
                                  <span>
                                    {sentence.trim()}
                                    {i < faq.answer.split(". ").length - 1 && !sentence.endsWith(".") ? "." : ""}
                                  </span>
                                </div>
                              )
                            }

                            // Regular sentence
                            return sentence.trim() ? (
                              <p key={i} className="mb-2">
                                {sentence.trim()}
                                {i < faq.answer.split(". ").length - 1 && !sentence.endsWith(".") ? "." : ""}
                              </p>
                            ) : null
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

