"use client"

import { motion } from "framer-motion"
import {
  FileText,
  Construction,
  Clock,
  Check,
  BarChart,
  Zap,
  Search,
  TrendingUp,
  Sparkles,
  Users,
  AlertTriangle,
  Linkedin,
  UserCircle,
  Briefcase,
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
              <div className="font-bold text-xl flex items-center">
                <span className="mr-1">blog</span>
                <span className="text-[#FF9626] font-bold">O</span>
                <span>social</span>
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
              <div className="flex items-center justify-center h-8 w-8">
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path
                      fill="#4285F4"
                      d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                    />
                  </g>
                </svg>
              </div>

              <Link
                href="/start"
                className="bg-[#FF9626] text-white px-5 py-2 rounded-full font-medium hover:bg-[#e88620] transition-colors"
              >
                Start for free
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

          {/* LinkedIn Profile Summary Generator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-12"
          >
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <div className="bg-orange-50 p-6 rounded-xl flex items-center justify-center">
                  <UserCircle className="h-24 w-24 text-[#FF9626]" />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold mb-2">LinkedIn Profile Summary Generator</h3>

                <div className="flex items-center mb-4 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <Construction className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="font-medium text-amber-700">Tool Coming Soon</span>
                </div>

                <p className="text-gray-600 mb-4">
                  Our LinkedIn Profile Summary Generator is an innovative tool designed to help users create compelling
                  and optimized summaries quickly and efficiently. Crafting an impactful LinkedIn profile summary is
                  crucial for making a strong first impression in the professional world.
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
                        Generate polished profiles in minutes, saving valuable time for networking and skill
                        development.
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
                      <h4 className="font-semibold">SEO Optimization</h4>
                      <p className="text-gray-600 text-sm">
                        Identify and incorporate relevant keywords, increasing your visibility in LinkedIn searches.
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
                      <h4 className="font-semibold">Customization Options</h4>
                      <p className="text-gray-600 text-sm">
                        Tailor summaries with specific details like job titles, skills, achievements, and career goals.
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
                With over 900 million users on LinkedIn, standing out in this competitive environment is essential.
                Research shows that profiles with well-crafted summaries receive significantly more views and engagement
                than those without.
              </p>

              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Digital Networking Growth</h3>
                    <p className="text-gray-600">
                      As businesses increasingly rely on digital networking, the demand for effective personal branding
                      has surged.
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
                    <h3 className="font-semibold text-lg">Professional Presence</h3>
                    <p className="text-gray-600">
                      A strong online presence is becoming increasingly important for career advancement and
                      professional opportunities.
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
                    <h3 className="font-semibold text-lg">Market Expansion</h3>
                    <p className="text-gray-600">
                      The global market for professional networking tools is expected to grow substantially in the
                      coming years.
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
                  alt="LinkedIn Profile Summary Generator"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Key Benefits of Using a LinkedIn Profile Summary Generator
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our LinkedIn Profile Summary Generator offers numerous advantages for professionals looking to enhance
              their online presence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Time Efficiency",
                description:
                  "Automating the summary creation process allows users to generate polished profiles in minutes, saving valuable time that can be spent on networking and skill development.",
                icon: <Clock className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Consistency and Professionalism",
                description:
                  "A summary generator ensures that the tone and style remain consistent throughout your profile, enhancing your professional image.",
                icon: <Briefcase className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "SEO Optimization",
                description:
                  "Many generators include features that help identify and incorporate relevant keywords, increasing your visibility in LinkedIn searches and making it easier for potential employers to find you.",
                icon: <Search className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Customization Options",
                description:
                  "Users can tailor their summaries by inputting specific details such as job titles, skills, achievements, and career goals, ensuring that each summary resonates with their unique professional identity.",
                icon: <FileText className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "User-Friendly Interface",
                description:
                  "Designed for individuals with varying levels of writing expertise, these tools are accessible and easy to navigate.",
                icon: <Users className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Data-Driven Insights",
                description:
                  "Access analytics to understand how your profile performs and refine your strategy based on engagement metrics.",
                icon: <BarChart className="h-10 w-10 text-[#FF9626]" />,
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
              To improve visibility and attract relevant traffic to pages about LinkedIn Profile Summary Generators,
              consider incorporating these keywords.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                keyword: "LinkedIn profile summary generator",
                icon: <UserCircle className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Automated LinkedIn summary creator",
                icon: <Sparkles className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "AI-powered summary writing tool",
                icon: <Zap className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "SEO-friendly LinkedIn profiles",
                icon: <Search className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Professional summary generator",
                icon: <Briefcase className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "LinkedIn profile optimization",
                icon: <Linkedin className="h-5 w-5 text-[#FF9626]" />,
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
            Long-tail keywords like "best LinkedIn profile summary generator for job seekers" can also help target
            specific queries effectively.
          </p>
        </div>
      </section>

      {/* Unique Selling Propositions */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Unique Selling Propositions (USPs)</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              What sets our LinkedIn Profile Summary Generator apart from other personal branding tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Rapid Summary Creation",
                description:
                  "Generate comprehensive summaries in minutes, allowing you to focus on building your professional network.",
                icon: <Clock className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Customizable Content Options",
                description:
                  "Tailor your summaries with features that highlight your unique skills and experiences, ensuring your profile stands out.",
                icon: <FileText className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Real-Time Adaptation",
                description:
                  "The tool can update summaries based on live data inputs, allowing for quick adjustments in response to changing career goals or experiences.",
                icon: <TrendingUp className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Comprehensive Support Resources",
                description:
                  "Access dedicated resources and customer support to maximize the effectiveness of your personal branding efforts.",
                icon: <Zap className="h-8 w-8 text-[#FF9626]" />,
              },
            ].map((usp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-[#FF9626] text-white h-10 w-10 rounded-full flex items-center justify-center mr-3">
                    {usp.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{usp.title}</h3>
                </div>
                <p className="text-gray-600 pl-13">{usp.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <TrustedBySection />


      <UniversalBlogCTA/>

      <Footer />
    </main>
  )
}

