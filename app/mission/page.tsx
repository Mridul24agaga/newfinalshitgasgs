"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight, Award, Users, Zap, Brain, FileText, BarChart3, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/footer"
import IntegrationsSection from "../components/integrations"
import LanguageScroll from "../components/language"
import UniversalBlogCTA from "../components/ctacontent"

export default function MissionPage() {
  return (
    <main className="min-h-screen bg-white font-['Saira',sans-serif]">
       {/* Header */}
       <header className="bg-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-full py-3 px-6 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <div className="flex items-center">
                <Image src="/logo.png" alt="Logo" width={160} height={32} className="w-auto h-6 sm:h-8" />
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/team" className="text-gray-600 hover:text-gray-900 transition-colors">
                Team
              </Link>
              <Link
                href="/vision"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-gray-900"
              >
                Vision
              </Link>
              <Link href="/mission" className="text-gray-600 hover:text-gray-900 transition-colors">
                Mission
              </Link>
            </nav>

            <div className="flex items-center space-x-4">


              <Link
                href="/start"
                className="bg-[#FF9626] text-white px-5 py-2 rounded-full font-medium hover:bg-[#e88620] transition-colors"
              >
                Try Now
              </Link>
            </div>
          </div>
        </div>
      </header>


      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-90 z-0"></div>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.2]">
                Elevating Content <span className="bg-[#FF9626] px-3 py-1 text-white">Beyond</span>{" "}
                <span className="relative top-5">Ordinary</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-[1.6]">
                Where innovation meets expertise, and human creativity empowers startups to thrive
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Blogs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">
              Why Blogs? The Cornerstone of Digital Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              In a digital world saturated with fleeting content, blogs stand out as enduring assets
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Evergreen Value",
                description: [
                  "Sustained Engagement: Blogs continuously attract visitors over months or even years.",
                  "Authority Building: Consistent high-quality content positions your brand as an industry leader.",
                ],
                icon: <Award className="h-8 w-8 text-white" />,
              },
              {
                title: "SEO Powerhouse",
                description: [
                  "Visibility Boost: Keyword-rich blogs significantly improve your website's ranking on search engines.",
                  "Targeted Traffic: High-quality blogs attract niche audiences specifically interested in your offerings.",
                  "Long-term ROI: Blogs generate organic traffic without the recurring costs of paid advertising.",
                ],
                icon: <BarChart3 className="h-8 w-8 text-white" />,
              },
              {
                title: "Trust & Credibility",
                description: [
                  "Expert Insights: Thoughtfully crafted blogs demonstrate your startup's expertise and build credibility.",
                  "Community Building: Engaging content fosters meaningful discussions and creates loyal brand advocates.",
                ],
                icon: <Shield className="h-8 w-8 text-white" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-6">
                  <div className="h-16 w-16 rounded-full bg-[#FF9626] flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4 leading-[1.3]">{item.title}</h3>
                <div className="space-y-3">
                  {item.description.map((point, i) => (
                    <div key={i} className="flex items-start">
                      <div className="mr-3 mt-1.5 flex-shrink-0">
                        <div className="h-4 w-4 rounded-full bg-[#FF9626] flex items-center justify-center"></div>
                      </div>
                      <p className="text-gray-700 leading-[1.7]">{point}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Human-Centric Blogging Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-[1.2]">
                Human-Centric Blogging: Why AI Alone Isn't Enough
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-[1.8]">
                While AI-driven content platforms have proliferated, purely automated solutions often fall short in
                delivering the depth, nuance, and emotional resonance readers seek. At Blogosocial, we blend human
                insight with advanced AI technology to craft blogs that resonate deeply with real people.
              </p>

              <h3 className="text-xl font-semibold mb-4 leading-[1.3]">The Human Advantage</h3>
              <div className="space-y-4 mb-6">
                {[
                  "Creativity & Empathy: Humans bring creativity, empathy, and contextual understanding that AI alone cannot replicate.",
                  "Expertise & Experience: Our seasoned SEO writers and SaaS founders infuse practical insights into every piece of content.",
                  "Editorial Excellence: A dedicated editorial team meticulously fact-checks and refines each blog for accuracy and readability.",
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 mt-1 flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-700 leading-[1.8]">{item}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-lg italic text-gray-700 leading-[1.8]">"We are not AI—but we use AI."</p>
                <p className="text-gray-600 mt-2">— Blogosocial Philosophy</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/human.jpg"
                  alt="Human-centric blogging approach"
                  width={800}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <p className="font-medium text-gray-800">Human + AI Excellence</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5-Layer System Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Our Unique 5-Layer System</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              At the heart of Blogosocial lies our revolutionary five-layer blogging engine
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            {[
              {
                layer: "Layer 1",
                title: "Expert SEO Writers",
                description:
                  "Industry veterans crafting precise, engaging content tailored specifically to your niche audience.",
                icon: <Users className="h-8 w-8 text-white" />,
              },
              {
                layer: "Layer 2",
                title: "Experienced SaaS Founders",
                description:
                  "Real-world insights from seasoned founders ensure every blog addresses genuine business challenges.",
                icon: <Zap className="h-8 w-8 text-white" />,
              },
              {
                layer: "Layer 3",
                title: "ICP Research Technology",
                description:
                  "Proprietary Ideal Customer Profile analysis guarantees content aligns precisely with audience interests.",
                icon: <Brain className="h-8 w-8 text-white" />,
              },
              {
                layer: "Layer 4",
                title: "AI Deep Research Layer",
                description:
                  "Advanced AI (GPT-4 Turbo) analyzes millions of peer-reviewed articles and live SEO experiments to provide robust data-driven foundations.",
                icon: <BarChart3 className="h-8 w-8 text-white" />,
              },
              {
                layer: "Layer 5",
                title: "Dedicated Review Team",
                description:
                  "Rigorous editorial oversight by domain-specific professionals ensures every blog meets high journalistic standards.",
                icon: <FileText className="h-8 w-8 text-white" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-full bg-[#FF9626] flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#FF9626] mb-1">{item.layer}</div>
                    <h3 className="text-2xl font-semibold mb-3 leading-[1.3]">{item.title}</h3>
                    <p className="text-gray-700 leading-[1.8]">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <p className="text-lg text-gray-700 leading-[1.8]">
              This hybrid model ensures every blog we produce is optimized for search engines while genuinely resonating
              with readers—delivering measurable results for your startup.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Empowering Startups Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">
              Empowering Startups & Forward-Thinking Brands
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              For startups navigating fierce competition, quality blogging isn't optional—it's essential
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Drive Investor Confidence",
                description:
                  "Expertly articulated blogs demonstrate thought leadership and align with investor messaging.",
                icon: <Award className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Reduce Customer Churn",
                description:
                  "Addressing real customer pain points through actionable insights fosters lasting relationships.",
                icon: <Users className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Boost Organic Reach",
                description:
                  "Expert-led SEO strategies ensure rapid visibility on Google, translating directly into increased traffic and conversions.",
                icon: <BarChart3 className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Build Community & Loyalty",
                description:
                  "Engaging storytelling creates interactive spaces for discussion, nurturing loyal communities around your brand.",
                icon: <Users className="h-8 w-8 text-[#FF9626]" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 leading-[1.3]">{item.title}</h3>
                <p className="text-gray-700 leading-[1.8]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Over Quantity Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Our Commitment: Quality Over Quantity</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              We don't just write blogs—we create strategic assets designed to deliver tangible outcomes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              {
                title: "120-Day Ranking Guarantee",
                description: "Achieve top-tier search engine rankings within just four months.",
                icon: <Award className="h-6 w-6 text-[#FF9626]" />,
              },
              {
                title: "Unlimited SEO Support",
                description:
                  "Continuous optimization aligned with Google's evolving algorithms ensures sustained visibility.",
                icon: <BarChart3 className="h-6 w-6 text-[#FF9626]" />,
              },
              {
                title: "Global Reach (50+ Languages)",
                description:
                  "Expertly localized content validated by native linguists ensures accurate messaging worldwide.",
                icon: <Users className="h-6 w-6 text-[#FF9626]" />,
              },
              {
                title: "Complete Transparency & Control",
                description:
                  "Approve or refine every piece of content before publication—ensuring alignment with your vision.",
                icon: <Shield className="h-6 w-6 text-[#FF9626]" />,
              },
              {
                title: "Seamless Integrations",
                description:
                  "Effortlessly integrate our platform into your existing workflow (WordPress, Shopify, Webflow, Notion).",
                icon: <Zap className="h-6 w-6 text-[#FF9626]" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 flex items-center">
                  {item.icon}
                  <h3 className="text-lg font-semibold ml-2 leading-[1.3]">{item.title}</h3>
                </div>
                <p className="text-gray-700 text-sm leading-[1.7]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">
              Why Choose Blogosocial Over Competitors?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              Unlike purely automated competitors, our expert-in-the-loop framework guarantees unmatched quality
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow-sm border border-gray-100">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left text-lg font-semibold">Feature</th>
                  <th className="py-4 px-6 text-center text-lg font-semibold">Blogosocial</th>
                  <th className="py-4 px-6 text-center text-lg font-semibold">Pure AI Platforms</th>
                  <th className="py-4 px-6 text-center text-lg font-semibold">Hybrid Platforms</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Human Expert Validation",
                    blogosocial: true,
                    pureAI: false,
                    hybrid: "Limited",
                  },
                  {
                    feature: "Founder-Level Insights",
                    blogosocial: true,
                    pureAI: false,
                    hybrid: "Limited",
                  },
                  {
                    feature: "ICP Research Technology",
                    blogosocial: true,
                    pureAI: false,
                    hybrid: "Limited",
                  },
                  {
                    feature: "Comprehensive Editorial Review",
                    blogosocial: true,
                    pureAI: false,
                    hybrid: "Limited",
                  },
                  {
                    feature: "Multi-Language Native Validation",
                    blogosocial: "50+ languages",
                    pureAI: "Limited",
                    hybrid: "Limited",
                  },
                  {
                    feature: "Guaranteed Google Ranking",
                    blogosocial: "120 days",
                    pureAI: false,
                    hybrid: "Varies",
                  },
                  {
                    feature: "Unlimited SEO Support",
                    blogosocial: true,
                    pureAI: false,
                    hybrid: "Varies",
                  },
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-4 px-6 text-gray-800 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.blogosocial === "boolean" ? (
                        row.blogosocial ? (
                          <div className="flex justify-center">
                            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M18 6L6 18M6 6L18 18"
                                  stroke="white"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        )
                      ) : (
                        <span className="text-[#FF9626] font-medium">{row.blogosocial}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.pureAI === "boolean" ? (
                        row.pureAI ? (
                          <div className="flex justify-center">
                            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M18 6L6 18M6 6L18 18"
                                  stroke="white"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        )
                      ) : (
                        <span className="text-gray-600">{row.pureAI}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.hybrid === "boolean" ? (
                        row.hybrid ? (
                          <div className="flex justify-center">
                            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M18 6L6 18M6 6L18 18"
                                  stroke="white"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          </div>
                        )
                      ) : (
                        <span className="text-gray-600">{row.hybrid}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <div className="space-y-2">
              <p className="text-xl font-semibold text-gray-800">"We don't just write blogs; we build trust."</p>
              <p className="text-xl font-semibold text-gray-800">
                "Quality over Quantity—Blogs Your Website Visitors & Google Love."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Join the Revolution Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-[1.2]">Join the Content Revolution</h2>
              <p className="text-lg text-gray-700 mb-6 leading-[1.8]">
                At Blogosocial, we're committed to transforming how startups approach blogging—from mere SEO checkboxes
                into strategic growth engines. Our mission is clear: deliver exceptional human-driven content optimized
                by advanced AI to elevate your brand's digital presence significantly.
              </p>
              <p className="text-lg text-gray-700 mb-8 leading-[1.8]">
                We invite you to join us in redefining the future of blogging—where innovation meets expertise to create
                impactful content that truly matters.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/start"
                  className="px-6 py-3 bg-[#FF9626] text-white rounded-lg font-medium flex items-center justify-center hover:bg-[#e88620] transition-colors"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className="px-6 py-3 bg-transparent border-2 border-[#FF9626] text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-[#FF9626]/10 transition-colors"
                >
                  View Pricing Plans
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/content.jpg"
                  alt="Content revolution visualization"
                  width={800}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <p className="font-medium text-gray-800">Welcome to the future of blogging</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      

      <IntegrationsSection />
      <UniversalBlogCTA />
      <Footer />
    </main>
  )
}

