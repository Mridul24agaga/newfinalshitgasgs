"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight, Lightbulb, Target, Users, Zap, Shield } from "lucide-react"
import { Saira } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/footer"
import UniversalBlogCTA from "../components/ctacontent"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

export default function VisionPage() {
  return (
    <main className={`${saira.className} min-h-screen bg-white`}>
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
                href="/services"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-gray-900"
              >
                Services
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
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {/* Pill Label */}
              <div className="inline-block mb-8">
                <span className="px-6 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">Our Vision</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-relaxed text-center">
                <div className="inline-block">
                  <span className="bg-[#FF9626] text-white px-3 py-1">Blogosocial</span> Vision:
                </div>
                <div className="mt-6 leading-tight">
                  Crafting a Future Where Content Inspires,
                  <br />
                  Connects, and Transforms
                </div>
              </h1>

              <p className="text-xl text-gray-700 mb-8">
                At Blogosocial, we envision a digital future where blogs transcend mere content—they become powerful,
                strategic assets that inspire audiences, drive genuine engagement, and transform businesses. Our vision
                is ambitious yet clear: to set the gold standard for authentic, human-driven blogging excellence that
                resonates deeply with readers and delivers measurable results for startups, entrepreneurs, and
                innovative brands worldwide.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Vision Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Vision: A World Where Every Blog Matters</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-lg text-gray-700 mb-6">
                In a digital landscape overwhelmed by fleeting social media posts and generic AI-generated content, we
                believe blogs hold the key to meaningful human connections. We see a future where every blog is
                meticulously crafted to solve real-world problems, deliver authentic value, and foster genuine
                relationships between brands and their audiences.
              </p>
              <p className="text-lg text-gray-700">
                Our goal is not simply to rank on Google—it's to resonate deeply with every reader who clicks through.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <Image
                  src="/vision.jpg"
                  alt="Our Vision"
                  width={600}
                  height={400}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Future We Are Creating */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Future We Are Creating</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our vision extends beyond today's digital landscape to create a future where content truly matters.
            </p>
          </motion.div>

          {/* Authenticity Section */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-start mb-6">
                <div className="bg-[#FF9626] text-white h-8 w-8 rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Authenticity as the New Digital Currency</h3>
                  <p className="text-gray-700 mb-6">
                    We envision an internet transformed by authenticity—where readers trust brands because every piece
                    of content is transparent, accurate, and genuinely helpful. At Blogosocial, authenticity isn't
                    optional; it's foundational.
                  </p>

                  <div className="space-y-4 pl-2">
                    <div className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-5 w-5 rounded-full bg-[#FF9626] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Trust-First Content</h4>
                        <p className="text-gray-600">
                          Every blog we produce meets Google's stringent E-E-A-T (Expertise, Experience,
                          Authoritativeness, Trustworthiness) guidelines.
                        </p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-5 w-5 rounded-full bg-[#FF9626] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Human-Driven Excellence</h4>
                        <p className="text-gray-600">
                          Our hybrid model ensures content is crafted by seasoned SEO writers and enriched by insights
                          from experienced SaaS founders.
                        </p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-5 w-5 rounded-full bg-[#FF9626] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">Transparency & Control</h4>
                        <p className="text-gray-600">
                          Clients maintain complete editorial control—approving or refining each blog to ensure
                          alignment with their unique voice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Hybrid Revolution Section */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-start mb-6">
                <div className="bg-[#FF9626] text-white h-8 w-8 rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">A Hybrid Revolution: Human Expertise Amplified by AI</h3>
                  <p className="text-gray-700 mb-6">
                    We see AI not as a replacement for human creativity—but as a powerful tool that amplifies human
                    potential. Our revolutionary five-layer expert blogging engine seamlessly blends human ingenuity
                    with cutting-edge AI technology:
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 mb-6">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Layer
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Purpose & Impact
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Expert SEO Writers
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Craft precise, engaging content tailored specifically to your audience's needs.
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Experienced SaaS Founders
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Infuse real-world business insights into every piece of content.
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ICP Research Technology
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Proprietary analysis ensures deep resonance with your ideal customers.
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            AI Deep Research Layer
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Advanced AI cross-references millions of peer-reviewed articles & live SEO data.
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Dedicated Review Team
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            Rigorous editorial oversight ensures accuracy, credibility, and readability.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Global Reach Section */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <div className="flex items-start mb-6">
                <div className="bg-[#FF9626] text-white h-8 w-8 rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4">Global Reach with Local Precision</h3>
                  <p className="text-gray-700 mb-6">
                    We envision a world without borders—a digital landscape where language no longer limits your ability
                    to connect authentically with global audiences:
                  </p>

                  <div className="space-y-4 pl-2">
                    <div className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-5 w-5 rounded-full bg-[#FF9626] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Support for over 50 languages.</p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-5 w-5 rounded-full bg-[#FF9626] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Expert localization ensuring cultural relevance.</p>
                      </div>
                    </div>

                    <div className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-5 w-5 rounded-full bg-[#FF9626] flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Native linguists validating each piece for accuracy.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Guiding Principles */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Guiding Principles Behind Our Vision</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our vision is anchored in core principles that guide every decision we make.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#FF9626] text-white h-10 w-10 rounded-full flex items-center justify-center mr-4">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">Quality Over Quantity</h3>
              </div>
              <p className="text-gray-600 pl-14">
                Exceptional blogs require care, expertise, and meticulous attention to detail—delivering lasting value
                rather than fleeting clicks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#FF9626] text-white h-10 w-10 rounded-full flex items-center justify-center mr-4">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">Human Creativity at the Core</h3>
              </div>
              <p className="text-gray-600 pl-14">
                We believe human insight remains irreplaceable. Our seasoned SEO writers and experienced SaaS founders
                infuse practical insights into every blog—ensuring real-world relevance and emotional resonance.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#FF9626] text-white h-10 w-10 rounded-full flex items-center justify-center mr-4">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">Innovation Through Integration</h3>
              </div>
              <p className="text-gray-600 pl-14">
                We seamlessly blend advanced AI technology (trained on OpenAI's GPT-4 Turbo, Perplexity, Deepseek, and
                Claude models) with human creativity—empowering our experts to deliver thoroughly researched blogs that
                resonate deeply with readers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="bg-[#FF9626] text-white h-10 w-10 rounded-full flex items-center justify-center mr-4">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold">Trust as the Ultimate Goal</h3>
              </div>
              <p className="text-gray-600 pl-14">
                Every blog aims not just for high rankings but also for deep reader trust through accuracy,
                transparency, and genuine value.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How Blogosocial Stands Apart */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Blogosocial Stands Apart</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Unlike purely automated platforms (SEObotai.com or autoblogging.io) or hybrid competitors (Jasper.ai or
              Hypotenuse.ai), Blogosocial emphasizes depth over superficiality.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-12"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Feature
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Blogosocial
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Pure AI Platforms
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Hybrid Platforms
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Human Expert Validation
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-green-600 font-medium">✅</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-red-600 font-medium">❌</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Founder-Level Insights
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-green-600 font-medium">✅</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-red-600 font-medium">❌</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ICP Research Technology
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-green-600 font-medium">✅</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-red-600 font-medium">❌</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Advanced AI Research Layer
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-green-600 font-medium">✅</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Dedicated Editorial Review Board
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-green-600 font-medium">✅</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-red-600 font-medium">❌</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Guaranteed Google Rankings
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-green-600 font-medium">✅</span> (120 days)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-red-600 font-medium">❌</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Varies</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Unlimited SEO Support
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-green-600 font-medium">✅</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-red-600 font-medium">❌</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Varies</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Multi-Language Native Validation
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="text-green-600 font-medium">✅</span> (50+ languages)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Limited</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Commitment to Startups */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Commitment to Startups & Entrepreneurs</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our vision specifically empowers startups—those who urgently need premium-quality blogging—to leverage
                blogging as their strategic advantage:
              </p>

              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Investor Confidence</h3>
                    <p className="text-gray-600">Clearly articulate complex ideas through expertly crafted blogs.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Reduced Customer Churn</h3>
                    <p className="text-gray-600">Address customer pain points directly through actionable insights.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Organic Visibility & Growth</h3>
                    <p className="text-gray-600">Expert-led SEO strategies ensure sustained organic traffic growth.</p>
                  </div>
                </div>

                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Community & Brand Advocacy</h3>
                    <p className="text-gray-600">Engaging storytelling nurtures loyal communities around your brand.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square max-w-md mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
                <Image
                  src="/startup.webp"
                  alt="Startups & Entrepreneurs"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roadmap to the Future */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Roadmap to the Future: Always Innovating</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our ambitious roadmap ensures Blogosocial remains at the forefront of blogging innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Advanced Collaborative Text Editor",
              "Automated Email Newsletter Integration",
              "Expanded Affiliate Program",
              "Enhanced Multimedia Integration (Videos & Graphics)",
              "Real-Time Data Embedding (BigQuery/Tableau)",
              "Podcast Auto-Chaptering & Audio-to-Blog Conversion",
              "Collaborative AI-powered Virtual Workspaces",
              "Enhanced Analytics Dashboards & Performance Tracking Tools",
              "Interactive Visual Content Modules (Graphs & Infographics)",
              "Comprehensive Free Tools Suite for Startups",
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className="bg-[#FF9626] text-white h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <p className="text-gray-700 font-medium">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Us in Shaping This Vision</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center"
            >
              <div className="bg-[#FF9626] text-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-6 w-6" />
              </div>
              <p className="text-lg font-medium">"We are not AI—but we use AI."</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center"
            >
              <div className="bg-[#FF9626] text-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <p className="text-lg font-medium">"We don't just write blogs; we build trust."</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center"
            >
              <div className="bg-[#FF9626] text-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6" />
              </div>
              <p className="text-lg font-medium">"Quality over Quantity—Blogs Your Website Visitors & Google Love."</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto">
              Our vision isn't just an aspiration—it's a call to action. We invite startups, entrepreneurs, marketers,
              personal brand builders, agency owners—and anyone passionate about exceptional content—to join us in
              redefining blogging excellence.
            </p>
            <p className="text-lg text-gray-700 mb-8 max-w-4xl mx-auto">
              Together we'll set new standards for authenticity in digital communication. Let's build a world where
              every word counts—where every blog inspires action and drives measurable success.
            </p>
          </motion.div>
        </div>
      </section>

<UniversalBlogCTA/>
      

     

      <Footer />
    </main>
  )
}

