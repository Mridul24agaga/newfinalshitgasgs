"use client"

import { motion } from "framer-motion"
import { Check, AlertCircle } from "lucide-react"
import { Saira } from "next/font/google"
import Link from "next/link"
import Footer from "../components/footer"
import Image from "next/image"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

export default function ComparisonPage() {
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
                  Comprehensive Comparison
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight leading-relaxed">
                Blogosocial vs SurferSEO: <br/><span className="bg-[#FF9626] text-white px-3 relative top-5">A Comprehensive</span>
                <br />
                <span className="mt-4 inline-block relative top-5">Comparison</span>
              </h1>

              <p className="text-xl text-gray-700 mb-8">
                Discover which content optimization platform best suits your needs with our in-depth analysis of
                features, pricing, and performance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-4">Overview of Blogosocial</h2>
              <h3 className="text-xl font-semibold mb-3">What Is Blogosocial?</h3>
              <p className="text-gray-700 mb-6">
                Blogosocial is a comprehensive content creation platform that combines human expertise with AI
                technology to deliver high-quality, SEO-optimized blogs that drive traffic and build authority.
              </p>

              <h3 className="text-xl font-semibold mb-3">Key Features of Blogosocial</h3>
              <div className="space-y-4">
                {[
                  "Expert-Led Content Creation: Blogs crafted by seasoned SEO writers and SaaS founders ensure accuracy and relevance.",
                  "Advanced AI Research Layer: Powered by GPT-4 Turbo, Perplexity AI, Deepseek, and Claude models for comprehensive research.",
                  "ICP Research Technology: Proprietary tools analyze Ideal Customer Profiles for hyper-targeted content.",
                  "Multi-Language Support: Create blogs in over 50 languages with native-level accuracy.",
                  "Guaranteed Rankings: Achieve top Google rankings within 120 days with unlimited SEO support.",
                ].map((feature, index) => (
                  <div key={index} className="flex">
                    <div className="mr-3 mt-1">
                      <div className="h-5 w-5 rounded-full bg-[#FF9626] flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-4">Overview of SurferSEO</h2>
              <h3 className="text-xl font-semibold mb-3">What Is SurferSEO?</h3>
              <p className="text-gray-700 mb-6">
                SurferSEO is an AI-driven content optimization tool designed to help users improve their website's
                on-page SEO by analyzing over 500 ranking factors. It provides actionable insights through its Content
                Editor and SERP Analyzer to optimize content for better rankings.
              </p>

              <h3 className="text-xl font-semibold mb-3">Key Features of SurferSEO</h3>
              <div className="space-y-4">
                {[
                  "Content Editor: Real-time suggestions for optimizing content based on competitor analysis and NLP (Natural Language Processing) keywords.",
                  "SERP Analyzer: In-depth analysis of top-ranking pages for specific keywords.",
                  "Grow Flow: AI assistant providing weekly tasks to improve SEO performance.",
                  "Keyword Research Tool: Identifies related keywords and topic clusters for content creation.",
                ].map((feature, index) => (
                  <div key={index} className="flex">
                    <div className="mr-3 mt-1">
                      <div className="h-5 w-5 rounded-full bg-gray-300 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Feature Comparison</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              See how Blogosocial and SurferSEO stack up against each other across key features and capabilities.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left font-semibold text-gray-700 border-b border-gray-200">Feature</th>
                  <th className="py-4 px-6 text-left font-semibold text-[#FF9626] border-b border-gray-200">
                    Blogosocial
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-500 border-b border-gray-200">
                    SurferSEO
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Content Creation",
                    blogosocial: "Expert-led blogs combining human creativity & AI",
                    surferseo: "AI-driven optimization with manual input",
                  },
                  {
                    feature: "Content Optimization",
                    blogosocial: "Guaranteed rankings within 120 days",
                    surferseo: "Real-time optimization via Content Editor",
                  },
                  {
                    feature: "Multi-Language Support",
                    blogosocial: "Supports over 50 languages",
                    surferseo: "Limited language support",
                  },
                  {
                    feature: "Target Audience Analysis",
                    blogosocial: "ICP research technology ensures audience alignment",
                    surferseo: "Limited audience targeting capabilities",
                  },
                  {
                    feature: "Ease of Use",
                    blogosocial: "Fully automated blog creation",
                    surferseo: "Requires manual adjustments",
                  },
                  {
                    feature: "Pricing Transparency",
                    blogosocial: "Affordable plans starting at $9",
                    surferseo: "Expensive plans starting at $49/month",
                  },
                  {
                    feature: "Customization Options",
                    blogosocial: "Full control over tone, style, and format",
                    surferseo: "Limited customization",
                  },
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-4 px-6 border-b border-gray-200 font-medium">{row.feature}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{row.blogosocial}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{row.surferseo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pros and Cons */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pros and Cons</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A balanced look at the strengths and limitations of both platforms.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-2xl font-bold mb-4 text-[#FF9626]">Blogosocial Pros</h3>
                <div className="space-y-3">
                  {[
                    "Human-centric approach ensures high-quality content tailored to readers' needs.",
                    "Multi-language support enables global reach with localized precision.",
                    "Affordable pricing plans suitable for startups and small businesses.",
                    "Guaranteed rankings within 120 days backed by unlimited SEO support.",
                    "Advanced integrations with CMS platforms like WordPress, Shopify Blogs, Webflow, and Notion.",
                  ].map((pro, index) => (
                    <div key={index} className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-700">{pro}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-2xl font-bold mb-4 text-[#FF9626]">Blogosocial Cons</h3>
                <div className="space-y-3">
                  {[
                    "Primarily focused on blogging; lacks additional SEO tools like backlink tracking.",
                    "Requires onboarding to fully understand its hybrid approach.",
                  ].map((con, index) => (
                    <div key={index} className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                          <AlertCircle className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-700">{con}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-700">SurferSEO Pros</h3>
                <div className="space-y-3">
                  {[
                    "Powerful optimization tools like SERP Analyzer and Content Editor.",
                    "Effective for improving on-page SEO metrics quickly.",
                    "Ideal for freelancers or agencies managing multiple clients.",
                  ].map((pro, index) => (
                    <div key={index} className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-700">{pro}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-700">SurferSEO Cons</h3>
                <div className="space-y-3">
                  {[
                    "Expensive pricing structure; entry-level plan starts at $49/month but lacks flexibility.",
                    "Over-reliance on AI can result in keyword-stuffed or irrelevant suggestions.",
                    "Limited support for low-volume keywords critical to niche industries.",
                    "No free trial; inconsistent refund policies reported by users.",
                    "Buggy integrations with WordPress reported by some users.",
                  ].map((con, index) => (
                    <div key={index} className="flex">
                      <div className="mr-3 mt-1">
                        <div className="h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                          <AlertCircle className="h-3 w-3 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-700">{con}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing Comparison</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Compare the pricing structures of Blogosocial and SurferSEO to find the best value for your needs.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 text-left font-semibold text-gray-700 border-b border-gray-200">Plan</th>
                  <th className="py-4 px-6 text-left font-semibold text-[#FF9626] border-b border-gray-200">
                    Blogosocial Pricing
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-gray-500 border-b border-gray-200">
                    SurferSEO Pricing
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    plan: "Trial",
                    blogosocial: "$9 (2 blogs)",
                    surferseo: "No free trial",
                  },
                  {
                    plan: "Monthly",
                    blogosocial: "$149 (daily blogs)",
                    surferseo: "$49/month (Basic plan)",
                  },
                  {
                    plan: "Quarterly",
                    blogosocial: "$399 (daily blogs for 3 months)",
                    surferseo: "$99/month (Pro plan)",
                  },
                  {
                    plan: "Semi-Annual",
                    blogosocial: "$649 (daily blogs for 6 months)",
                    surferseo: "$199/month (Business plan)",
                  },
                  {
                    plan: "Annual",
                    blogosocial: "$999 (daily blogs for 12 months)",
                    surferseo: "Custom pricing for enterprise solutions",
                  },
                ].map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="py-4 px-6 border-b border-gray-200 font-medium">{row.plan}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{row.blogosocial}</td>
                    <td className="py-4 px-6 border-b border-gray-200">{row.surferseo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Negative Reviews About SurferSEO */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Negative Reviews About SurferSEO</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Common complaints and issues reported by SurferSEO users.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Over-Optimization Issues",
                description:
                  "Many users report that SurferSEO's recommendations can lead to keyword stuffing or unnatural content structures.",
              },
              {
                title: "Pricing Concerns",
                description: "Entry-level plans are expensive with limited usage allowances.",
              },
              {
                title: "Buggy Integrations",
                description: "Users have experienced issues integrating SurferSEO with WordPress.",
              },
              {
                title: "Irrelevant Suggestions",
                description: "Some optimization suggestions provided by SurferSEO are not practical or impactful.",
              },
              {
                title: "Limited Keyword Research Tool",
                description: "The tool struggles with low-volume keywords critical to niche industries.",
              },
            ].map((review, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
                  <h3 className="text-xl font-semibold">{review.title}</h3>
                </div>
                <p className="text-gray-600">{review.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Blogosocial */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Blogosocial Over SurferSEO?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Unique selling points that make Blogosocial the superior choice for content creation and optimization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Hybrid Approach",
                description: "Combines human expertise with AI precision for unmatched quality.",
              },
              {
                title: "Affordable Pricing",
                description: "Flexible plans starting at just $9 make it accessible to startups.",
              },
              {
                title: "Guaranteed Results",
                description: "Achieve top Google rankings within 120 days or get unlimited SEO support.",
              },
              {
                title: "Multi-Language Capabilities",
                description: "Reach global audiences with native-level accuracy in over 50 languages.",
              },
              {
                title: "Seamless Integration",
                description:
                  "Effortlessly connect with CMS platforms like WordPress, Shopify Blogs, Webflow, and Notion.",
              },
            ].map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 rounded-full bg-[#FF9626] flex items-center justify-center mb-4">
                  <span className="text-white font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{point.title}</h3>
                <p className="text-gray-600">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 bg-[#FF9626]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Call-to-Action: Elevate Your Blogging Strategy Today!
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Ready to transform your content strategy? Choose Blogosocial—the ultimate solution for expert-led blog
              automation that drives traffic, builds trust, and delivers measurable results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/start"
                className="px-6 py-3 bg-white text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                Explore our flexible plans starting at just $9!
              </Link>
              <a
                href="mailto:info@blogosocial.com"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                Contact us at info@blogosocial.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>


      <Footer />
    </main>
  )
}

