"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Construction,
  FileText,
  Clock,
  Check,
  Globe,
  Zap,
  Search,
  Sparkles,
  AlertTriangle,
} from "lucide-react"
import { Saira } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/footer"
import TrustedBySection from "../components/trusted"
import UniversalBlogCTA from "../components/ctacontent"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

export default function ToolsPage() {
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
              <div className="inline-block mb-6">
                <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                  Blogosocial Tools
                </span>
              </div>

              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Powerful Content Creation <span className="bg-[#FF9626] text-white px-3 py-1">Tools</span>
                </h1>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">For Every Content Need</h1>
              </div>

              <p className="text-xl text-gray-700 mb-8 mt-10">
                Discover our suite of specialized content creation tools designed to streamline your workflow, enhance
                productivity, and deliver exceptional results for various content needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#tools"
                  className="px-6 py-3 bg-[#FF9626] text-white rounded-lg font-medium flex items-center justify-center hover:bg-[#e88620] transition-colors"
                >
                  Explore Tools
                </Link>
                <Link
                  href="#contact"
                  className="px-6 py-3 bg-transparent border-2 border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Content Creation Tools</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our specialized tools designed to enhance your content creation process and deliver exceptional
              results.
            </p>
          </motion.div>

          {/* Academic Article Generator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-12"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="bg-orange-50 p-6 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-24 w-24 text-[#FF9626]" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-2">Academic Article Generator</h3>

                <div className="flex items-center mb-4 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <Construction className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="font-medium text-amber-700">Tool Coming Soon</span>
                </div>

                <p className="text-gray-600 mb-4">
                  Our Academic Article Generator is designed to streamline the creation of high-quality academic
                  content, helping students, researchers, and educators save time while maintaining academic standards.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="flex">
                    <div className="mr-3 mt-1">
                      <div className="h-5 w-5 rounded-full bg-[#FF9626] flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">Time Efficiency</h4>
                      <p className="text-gray-600 text-sm">
                        Automates the writing process, saving hours spent on brainstorming, researching, and drafting.
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
                      <h4 className="font-semibold">Plagiarism-Free Content</h4>
                      <p className="text-gray-600 text-sm">
                        Generates unique articles that pass plagiarism checks on tools like Zero-GPT detectors.
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
                      <h4 className="font-semibold">Citation Integration</h4>
                      <p className="text-gray-600 text-sm">
                        Includes accurate references and bibliographies to meet academic standards.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  <p className="text-sm text-gray-600">
                    Join our waitlist to be notified when this tool becomes available.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* More tools coming soon section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <div className="bg-gray-50 p-10 rounded-2xl border border-gray-100">
              <Construction className="h-16 w-16 text-[#FF9626] mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">More Tools Coming Soon</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We're constantly developing new tools to help you create better content more efficiently. Stay tuned for
                more exciting additions to our toolkit!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industry Analysis */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Industry Analysis</h2>
              <p className="text-lg text-gray-600 mb-8">
                Generative AI is transforming academia by streamlining writing processes, improving reading efficiency,
                and personalizing learning experiences. The global AI writing tools market is projected to grow
                significantly due to advancements in natural language processing and machine learning.
              </p>

              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Growing Demand</h3>
                    <p className="text-gray-600">
                      AI writing tools are increasingly popular among students, researchers, educators, and
                      professionals.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Time Savings</h3>
                    <p className="text-gray-600">
                      Users seek to save time while maintaining quality in their academic writing.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Language Support</h3>
                    <p className="text-gray-600">
                      For non-native English speakers, AI generators offer critical support in overcoming language
                      barriers.
                    </p>
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
                  src="/blog.webp"
                  alt="Academic Article Generator"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of Using Academic Article Generators</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our academic article generator offers numerous advantages for students, researchers, and educators.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Streamlined Content Creation",
                description: "Generate well-written articles in minutes based on user inputs.",
                icon: <Zap className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Enhanced Learning",
                description: "Helps users understand effective structuring of arguments and paragraphs.",
                icon: <BookOpen className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Accessibility for Non-Native Writers",
                description: "Assists in refining language skills and expressing ideas coherently.",
                icon: <Globe className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Rapid Research Assistance",
                description: "Summarizes lengthy texts and extracts key information efficiently.",
                icon: <Search className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Improved Productivity",
                description: "Allows users to focus on critical thinking while automating repetitive tasks.",
                icon: <Clock className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Structured Output",
                description: "Provides pre-defined templates and outlines for essays, research papers, and theses.",
                icon: <FileText className="h-10 w-10 text-[#FF9626]" />,
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Keywords Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Best SEO Keywords for Ranking</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To attract relevant traffic and improve visibility for academic article generator pages, use these
              high-volume keywords.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                keyword: "Academic article generator",
                icon: <BookOpen className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "AI research paper generator",
                icon: <FileText className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Essay writing automation",
                icon: <Zap className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Plagiarism-free content generator",
                icon: <Check className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Citation integration tools",
                icon: <FileText className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "AI-powered academic writing",
                icon: <Sparkles className="h-5 w-5 text-[#FF9626]" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-orange-50 rounded-lg p-4 flex items-center"
              >
                <div className="mr-3">{item.icon}</div>
                <span className="text-gray-800 font-medium">{item.keyword}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-gray-700 text-center">
            Long-tail keywords like "best free academic article generator for students" can also help target specific
            queries effectively.
          </p>
        </div>
      </section>
      <TrustedBySection />


      <UniversalBlogCTA/>

      <Footer />
    </main>
  )
}

