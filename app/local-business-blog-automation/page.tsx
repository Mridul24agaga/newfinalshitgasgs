"use client"

import { motion } from "framer-motion"
import { Users, Briefcase, Check, BarChart, Globe, Zap, Database, Search, MapPin, Calendar, Heart } from "lucide-react"
import { Saira } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/footer"
import TrustedBySection from "../components/trusted"
import PricingSection from "../components/pagespricing"
import UniversalBlogCTA from "../components/ctacontent"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

export default function LocalBusinessBlogAutomationPage() {
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
                  Local Business
                </span>
              </div>

              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Local Business Blog Automation:{" "}
                  <span className="bg-[#FF9626] text-white px-3 py-1 relative top-6">Revolutionizing</span>
                </h1>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 relative top-4">
                  Content Creation for Local Enterprises
                </h1>
              </div>

              <p className="text-xl text-gray-700 mb-8 mt-10">
                In today's digital age, local businesses must establish a strong online presence to remain competitive.
                Blogs are a powerful tool for engaging local audiences, driving organic traffic, and building trust
                within the community. However, creating high-quality, SEO-optimized blogs consistently can be
                challenging for small teams with limited resources.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="#contact"
                  className="px-6 py-3 bg-[#FF9626] text-white rounded-lg font-medium flex items-center justify-center hover:bg-[#e88620] transition-colors"
                >
                  Schedule a Demo
                </Link>
                <Link
                  href="#features"
                  className="px-6 py-3 bg-transparent border-2 border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  Explore Features
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Introduction to Local Business Blog Automation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Local Business Blog Automation provides a solution by streamlining the blog creation process while
              ensuring content is tailored to local audiences. At Blogosocial, we specialize in automating blog creation
              for local businesses using a hybrid model that combines human expertise with advanced AI technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Automate */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Automate Blogging for Local Businesses?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Local businesses often struggle with limited budgets, time constraints, and the need to compete with
                larger enterprises. Blogs help:
              </p>

              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Attract Local Customers</h3>
                    <p className="text-gray-600">
                      Target location-specific keywords like "best coffee shop in [city]" or "plumbers near me" to drive
                      organic traffic.
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
                    <h3 className="font-semibold text-lg">Build Community Trust</h3>
                    <p className="text-gray-600">
                      Share stories about your business's involvement in local events or initiatives.
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
                    <h3 className="font-semibold text-lg">Enhance SEO Rankings</h3>
                    <p className="text-gray-600">
                      Optimize content for local searches to ensure your business appears at the top of search engine
                      results pages (SERPs).
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
                    <h3 className="font-semibold text-lg">Drive Foot Traffic</h3>
                    <p className="text-gray-600">
                      Use blogs to promote special offers, seasonal campaigns, or new products/services.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-gray-700">
                Manual blog creation can be overwhelming for local businesses focused on day-to-day operations.
                Automation solves this by enabling consistent, high-quality content production without additional strain
                on resources.
              </p>
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
                  alt="Local Business Blog Automation"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits of Blog Automation */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of Blog Automation for Local Businesses</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Automating blog creation offers several advantages for local businesses looking to enhance their online
              presence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Efficiency",
                description: "Save time by automating research, drafting, and optimization processes.",
                icon: <Zap className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Hyperlocal Targeting",
                description: "Create content tailored to specific geographic areas and customer demographics.",
                icon: <MapPin className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Scalability",
                description: "Produce blogs at scale to support business growth without increasing overhead costs.",
                icon: <BarChart className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Cost Savings",
                description:
                  "Reduce expenses associated with hiring writers while maintaining premium content standards.",
                icon: <Briefcase className="h-10 w-10 text-[#FF9626]" />,
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

      {/* Blogosocial's Unique Approach */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Blogosocial's Unique Approach to Local Business Blog Automation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Blogosocial, we don't just automate blogs—we revolutionize them through our proprietary 5-layer expert
              blogging engine, designed specifically for local businesses.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-lg font-semibold text-gray-700">Layer</th>
                  <th className="py-4 px-6 text-left text-lg font-semibold text-gray-700">Purpose & Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Expert SEO Writers</td>
                  <td className="py-4 px-6 text-gray-600">
                    Craft precise, engaging content tailored to your specific location and audience needs.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Experienced SaaS Founders</td>
                  <td className="py-4 px-6 text-gray-600">
                    Infuse real-world business insights into every blog for strategic relevance.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">ICP Research Technology</td>
                  <td className="py-4 px-6 text-gray-600">
                    Analyze Ideal Customer Profiles to ensure hyper-targeted content creation.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">AI Deep Research Layer</td>
                  <td className="py-4 px-6 text-gray-600">
                    Leverage advanced AI tools (GPT-4 Turbo, Perplexity) for comprehensive research.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Dedicated Review Team</td>
                  <td className="py-4 px-6 text-gray-600">
                    Enforce rigorous editorial standards for accuracy and credibility.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 mt-6 text-center">
            This hybrid model ensures every blog we produce is optimized for search engines while delivering genuine
            value to readers—solving real-world problems and driving measurable business outcomes.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white border-t border-gray-100" id="features">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Key Features of Blogosocial's Local Business Blog Automation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive solution offers everything you need to streamline your local business content strategy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Advanced Keyword Optimization",
                description:
                  'Our system uses tools like SEMrush and Google Keyword Planner to identify high-value keywords tailored specifically to local searches. By targeting long-tail keywords such as "family-friendly restaurants in [city]" or "affordable home repair services near me," we ensure your blogs rank higher on search engines.',
                icon: <Search className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Hyperlocal Content Creation",
                description:
                  "We specialize in creating blogs that resonate with local audiences by incorporating regional events, landmarks, and cultural references.",
                icon: <MapPin className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Multi-Language Support",
                description:
                  "With support for over 50 languages validated by native linguists, we help businesses expand their reach globally while maintaining localized accuracy.",
                icon: <Globe className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Seamless CMS Integration",
                description:
                  "Blogosocial integrates effortlessly with popular CMS platforms like WordPress, Webflow, Shopify Blogs, and Notion Databases—streamlining publishing workflows.",
                icon: <Database className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Continuous Optimization",
                description:
                  "We monitor competitor blogs and Google algorithm updates to ensure your content remains relevant and optimized over time.",
                icon: <BarChart className="h-8 w-8 text-[#FF9626]" />,
              },
            ].map((feature, index) => (
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
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600 pl-13">{feature.description}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Blogosocial for Local Business Blogging?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our unique selling points set us apart from other content creation services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Guaranteed Rankings Within 120 Days",
                description:
                  "Achieve top-tier Google rankings with our proven SEO strategies tailored specifically for local businesses.",
              },
              {
                title: "Unlimited SEO Support",
                description: "Benefit from continuous optimization aligned with evolving search engine algorithms.",
              },
              {
                title: "Expert-Led Content Creation",
                description: "Our team combines human creativity with AI precision for unmatched quality.",
              },
              {
                title: "Hyperlocal Targeting",
                description:
                  "Create content that resonates deeply with your community and drives meaningful engagement.",
              },
              {
                title: "Global Reach",
                description:
                  "Expand your brand's presence worldwide with multi-language capabilities validated by native speakers.",
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

      {/* Use Cases */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases for Local Business Blog Automation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our blog automation solution can help local businesses create various types of content.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Promoting Events",
                description:
                  "Create detailed blogs about upcoming festivals or events in your area to attract local customers.",
                icon: <Calendar className="h-4 w-4" />,
              },
              {
                title: "Seasonal Campaigns",
                description:
                  'Publish blogs about seasonal trends like "Top Holiday Gift Ideas from Local Shops" or "Winter Home Maintenance Tips."',
                icon: <Calendar className="h-4 w-4" />,
              },
              {
                title: "Customer Success Stories",
                description:
                  "Share testimonials or case studies highlighting how your business solved customer problems.",
                icon: <Users className="h-4 w-4" />,
              },
              {
                title: "SEO-Focused Blogs",
                description: 'Target keywords like "best electricians near me" or "top-rated yoga studios in [city]."',
                icon: <Search className="h-4 w-4" />,
              },
              {
                title: "Community Engagement",
                description:
                  "Write about partnerships with other local businesses or charities to build trust within the community.",
                icon: <Heart className="h-4 w-4" />,
              },
            ].map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-[#FF9626] text-white h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3">
                    {useCase.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{useCase.title}</h3>
                </div>
                <p className="text-gray-600 pl-11">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection/>
      <TrustedBySection />
      <UniversalBlogCTA/>

      <Footer />
    </main>
  )
}

