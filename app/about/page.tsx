"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight, Award, Users, Zap, Brain, FileText, BarChart3, Shield, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/foot"
import IntegrationsSection from "../components/integrations"
import LanguageScroll from "../components/language"

export default function AboutClient() {
  return (
    <main className="min-h-screen bg-white font-['Saira',sans-serif]">
      {/* Header */}
      <header className="bg-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-full py-3 px-6 flex items-center justify-between shadow-sm border border-gray-100">
            <Link href="/" className="flex items-center">
              <div className="font-bold text-xl flex items-center">
                <span className="mr-1">blog</span>
                <span className="text-[#FF9626] font-bold">O</span>
                <span>social</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-900 font-medium hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/team" className="text-gray-600 hover:text-gray-900 transition-colors">
                Team
              </Link>
              <Link href="/vision" className="text-gray-600 hover:text-gray-900 transition-colors">
                Vision
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
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-90 z-0"></div>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-[1.2]">
                Where <span className="bg-[#FF9626] px-3 py-1 text-white">Human Expertise</span> Meets AI Innovation
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-[1.6]">
                Redefining Content Excellence to Build Trust, Drive Traffic, and Dominate Search
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Wake-Up Call Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-[1.2]">
                The Wake-Up Call That Started It All
              </h2>
              <p className="text-lg text-gray-700 mb-6 leading-[1.8]">
                In 2024, three SaaS founders—Krissmann Gupta (Serial entrepreneur), Mridul Thareja (2x SaaS builder),
                and Anjali Singh (Google quality researcher)—sat staring at a sobering statistic:{" "}
                <span className="font-semibold">92% of AI-generated blogs failed Google's E-E-A-T standards</span>,
                eroding customer trust and wasting $14B annually on hollow content.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-[1.8]">
                Having scaled ventures to millions of users through organic SEO, they knew generic AI tools couldn't
                solve the crisis. The answer? A radical hybrid model combining Silicon Valley's technical brilliance
                with Ivy League editorial rigor.
              </p>
              <p className="text-lg text-gray-700 font-medium leading-[1.8]">
                Thus, Blogosocial was born—not as another AI tool, but as the world's first 5-layer expert-led blogging
                engine.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/placeholder.svg?height=500&width=800"
                  alt="Blogosocial founders"
                  width={800}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <p className="font-medium text-gray-800">Founded in 2024</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why AI-Only Tools Fail Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Why AI-Only Tools Fail Your Business</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">The Problem We Eliminate</p>
          </motion.div>

          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <p className="text-xl mb-8 leading-[1.8]">AI writing tools flood the web with content that:</p>

            <div className="space-y-6">
              {[
                "Lacks real-world expertise (e.g., medical blogs missing peer-reviewed citations)",
                "Fails EEAT standards, tanking rankings post-Google's 2025 Helpful Content Update",
                "Wastes budgets—68% of SaaS companies saw declining traffic within 6 months of AI-only content (2024 Kalungi Report)",
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <div className="mr-4 mt-1 flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <p className="text-gray-700 leading-[1.8]">{item}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <p className="text-xl font-semibold text-[#FF9626]">
                Blogosocial exists because - authenticity beats automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Layer Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">
              The 5-Layer Process: Why We're Unmatched
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              Our revolutionary approach combines human expertise with AI innovation
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8">
            {[
              {
                layer: "Layer 1",
                title: "Niche Experts",
                description:
                  "Every blog begins with 1,200+ vetted professionals—PhDs for biotech, certified CPAs for fintech, practicing lawyers for legal SaaS. No AI hallucination. Just accuracy.",
                icon: <Users className="h-8 w-8 text-white" />,
              },
              {
                layer: "Layer 2",
                title: "Founder Insights",
                description:
                  "Your content is stress-tested by active SaaS founders who've scaled companies to $10M+ ARR. They ensure blogs solve real pain points—like churn reduction or investor pitches—not just keyword stuffing.",
                icon: <Zap className="h-8 w-8 text-white" />,
              },
              {
                layer: "Layer 3",
                title: "ICP Research Engine",
                description:
                  "Proprietary AI trained on 50M+ ideal customer profiles identifies gaps your audience actually cares about. No more guessing what resonates.",
                icon: <Brain className="h-8 w-8 text-white" />,
              },
              {
                layer: "Layer 4",
                title: "Deep Research AI",
                description:
                  "Unlike surface-level tools, our AI cross-references 120M academic papers (JSTOR/PubMed), 6.2M live SEO experiments from ClickFlow/SearchPilot, and real-time SERP shifts via Google's Knowledge Graph API.",
                icon: <BarChart3 className="h-8 w-8 text-white" />,
              },
              {
                layer: "Layer 5",
                title: "Editorial Review Board",
                description:
                  "Ex-NYT and TechCrunch editors enforce journalistic standards: fact-checking, tone polishing, and EEAT optimization.",
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
        </div>
      </section>

      {/* Who Thrives Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Who Thrives with Blogosocial?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              Our platform is designed to serve various business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "SaaS Founders",
                description:
                  "Scale content without hiring writers. Our Founder Insights Layer ensures blogs align with investor messaging and churn-reduction strategies.",
                icon: <Zap className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "D2C Brands",
                description:
                  'Dominate niches like "organic baby formula" with pediatrician-validated, FDA-compliant content.',
                icon: <Users className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Agency Owners",
                description:
                  "White-label our platform to deliver 120-day ranking guarantees—backed by 24/7 ex-Google strategist support.",
                icon: <Award className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Bloggers",
                description:
                  "Outrank AI spam with 3,000+ word masterposts featuring original interviews and proprietary data visualizations.",
                icon: <FileText className="h-8 w-8 text-[#FF9626]" />,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-3 leading-[1.3]">{item.title}</h3>
                <p className="text-gray-700 leading-[1.8]">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <h3 className="text-2xl font-bold mb-2 leading-[1.3]">The Future Is Human + AI</h3>
          </motion.div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-[1.2]">
                Case Study: 317% Traffic Surge in 120 Days
              </h2>
              <p className="text-lg text-gray-700 mb-8 leading-[1.8]">
                When D2C skincare brand XYZ switched from AI writer:
              </p>

              <div className="space-y-6 mb-8">
                {[
                  "317% organic traffic growth",
                  "58% conversion lift on product pages via blogs embedding user testimonials",
                  "12 editorial backlinks from Allure and Byrdie",
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 mt-1 flex-shrink-0">
                      <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium leading-[1.8]">{item}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-lg italic text-gray-700 leading-[1.8]">
                  "Blogosocial gave us AI's speed with medical board-level credibility."
                </p>
                <p className="text-gray-600 mt-2">— CEO</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Case study results visualization"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founding DNA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">
              Built by Founders, Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">Our Founding DNA</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Krissmann Gupta",
                role: "Serial Entrepreneur",
                bio: "8 years in entrepreneurship optimizing Fortune 500 EEAT scores",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Mridul Thareja",
                role: "2x SaaS Builder",
                bio: "Scaled 2 SaaS ventures to 1M MAU via organic content",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                name: "Anjali Singh",
                role: "Google Quality Researcher",
                bio: "Bridging AI ethics with real-world utility",
                image: "/placeholder.svg?height=400&width=400",
              },
            ].map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="aspect-square">
                  <Image
                    src={founder.image || "/placeholder.svg"}
                    alt={founder.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 leading-[1.3]">{founder.name}</h3>
                  <p className="text-[#FF9626] font-medium mb-3">{founder.role}</p>
                  <p className="text-gray-700 leading-[1.8]">{founder.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <h3 className="text-2xl font-bold mb-4 leading-[1.3]">Join 30,000+ Brands Revolutionizing Content</h3>
            <p className="text-lg text-gray-600 leading-[1.8]">
              Including YC-backed startups, Top 10 Shopify stores, and LegalTech unicorns.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Ironclad Promises Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">Our Ironclad Promises</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-[1.6]">
              We stand behind our service with confidence
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "120-Day Ranking Guarantee",
                description: "Our 90% customer reported getting ranked in top 10 in less than 6 months.",
                icon: <Award className="h-8 w-8 text-white" />,
              },
              {
                title: "Zero Data Retention",
                description: "All content is AES-256 encrypted and deleted post-delivery. Your insights stay yours.",
                icon: <Shield className="h-8 w-8 text-white" />,
              },
              {
                title: "Unlimited SEO Support",
                description: "24/7 access to ex-Google strategists for technical audits and Core Update protection.",
                icon: <Users className="h-8 w-8 text-white" />,
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
                <h3 className="text-xl font-semibold mb-3 leading-[1.3]">{item.title}</h3>
                <p className="text-gray-700 leading-[1.8]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#FF9626]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-[1.2]">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8 leading-[1.8]">
              Join thousands of businesses that are already seeing results with Blogosocial
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/start"
                className="px-6 py-3 bg-white text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="/demo"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                Book Founder-Led Demo
              </a>
            </div>

            <div className="mt-12 bg-white/10 p-6 rounded-xl">
              <p className="text-xl italic text-white leading-[1.8]">
                "Finally, an AI tool that doesn't make me cringe."
              </p>
              <p className="text-white/80 mt-2">— Marketing Director, Fortune 500 Retail Brand</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-[1.2]">Why We Exist</h2>
              <p className="text-lg text-gray-700 mb-6 leading-[1.8]">
                The internet deserves better than AI-generated sludge. Blogosocial is a rebellion against empty
                calories—a platform where every word builds trust, drives action, and ear empty calories—a platform
                where every word builds trust, drives action, and earns its place on Google's first page.
              </p>

              <h3 className="text-xl font-semibold mb-4 leading-[1.3]">Human-AI Collaboration: The Next Frontier</h3>
              <p className="text-lg text-gray-700 mb-6 leading-[1.8]">
                While competitors automate, we elevate. By 2026, 72% of winning content will blend AI efficiency with
                human nuance (Gartner). We're leading that charge—proving machines and minds create magic when aligned.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/placeholder.svg?height=500&width=800"
                  alt="Blogosocial mission visualization"
                  width={800}
                  height={500}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <IntegrationsSection />
      <LanguageScroll />

      {/* Additional CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#FF9626] to-[#FF7E26]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-[1.2]">
                  Start Your Content Revolution Today
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-[1.8]">
                  Join the 30,000+ brands that have already transformed their content strategy with Blogosocial. Our
                  expert-led approach ensures your content stands out in a sea of AI-generated mediocrity.
                </p>
                <div className="space-y-4 md:space-y-0 md:flex md:space-x-4">
                  <a
                    href="/pricing"
                    className="w-full md:w-auto flex items-center justify-center px-8 py-3 bg-[#FF9626] text-white rounded-lg font-medium hover:bg-[#e88620] transition-colors"
                  >
                    View Pricing Plans
                  </a>
                  <a
                    href="/schedule-call"
                    className="w-full md:w-auto flex items-center justify-center px-8 py-3 border-2 border-[#FF9626] text-[#FF9626] rounded-lg font-medium hover:bg-[#FF9626]/5 transition-colors"
                  >
                    Schedule a Strategy Call <ChevronRight className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square md:aspect-video rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Content strategy transformation"
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#FF9626] text-white p-4 rounded-lg shadow-lg">
                  <p className="font-bold text-xl">Limited Time Offer</p>
                  <p className="text-sm">20% off annual plans</p>
                </div>
              </div>
            </motion.div>

            <div className="mt-12 border-t border-gray-100 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                        <Image
                          src={`/placeholder.svg?height=40&width=40`}
                          alt={`User ${i}`}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="ml-4 text-gray-600">Joined by 2,500+ companies this month</p>
                </div>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="text-gray-600">4.9/5 from 800+ reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

