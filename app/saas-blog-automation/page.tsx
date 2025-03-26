"use client"

import { motion } from "framer-motion"
import { Users, Briefcase, Check, BarChart, Globe, Zap, Database, Search, Code, LineChart, Award } from "lucide-react"
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

export default function SaasBlogAutomationPage() {
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
                  SaaS Industry
                </span>
              </div>

              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  SaaS Company Blog Automation:{" "}
                  <span className="bg-[#FF9626] text-white px-3 py-1 relative top-7">Revolutionizing</span>
                </h1>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 relative top-5">
                  Content Creation for SaaS Businesses
                </h1>
              </div>

              <p className="text-xl text-gray-700 mb-8 mt-10">
                Software-as-a-Service (SaaS) companies operate in a highly competitive and fast-paced industry where
                effective communication is key to success. Blogs are a critical tool for SaaS businesses to educate
                users, showcase expertise, and drive organic traffic. However, creating high-quality, SEO-optimized
                blogs consistently can be challenging due to the technical nature of SaaS products and the need to stay
                ahead of competitors.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Introduction to SaaS Company Blog Automation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              SaaS Company Blog Automation offers a powerful solution by streamlining the blog creation process while
              ensuring premium quality and relevance. At Blogosocial, we specialize in automating blog creation for SaaS
              companies using our unique hybrid model that combines human expertise with advanced AI technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Automate */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Automate Blogging for SaaS Companies?</h2>
              <p className="text-lg text-gray-600 mb-8">
                The SaaS industry demands content that is both technically accurate and engaging for diverse audiences,
                from decision-makers to end-users. Blogs help:
              </p>

              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Educate Users</h3>
                    <p className="text-gray-600">
                      Simplify complex concepts like API integrations, DevOps workflows, or cloud migrations into
                      easy-to-understand content.
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
                    <h3 className="font-semibold text-lg">Boost SEO Rankings</h3>
                    <p className="text-gray-600">
                      Target niche keywords like "best project management tools" or "how to implement CI/CD pipelines"
                      to attract organic traffic.
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
                    <h3 className="font-semibold text-lg">Build Authority</h3>
                    <p className="text-gray-600">
                      Establish thought leadership by sharing insights on emerging trends like AI-driven SaaS or
                      cybersecurity best practices.
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
                    <h3 className="font-semibold text-lg">Drive Conversions</h3>
                    <p className="text-gray-600">
                      Use blogs as a gateway to convert readers into trial users or paying customers.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-gray-700">
                Manual blog creation often requires significant time and resources, especially for technical topics.
                Automation solves these challenges by enabling consistent, high-quality content production without
                additional strain on resources.
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
                  alt="SaaS Blog Automation"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of Blog Automation for SaaS Companies</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Automating blog creation offers several advantages for SaaS companies looking to enhance their content
              strategy.
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
                title: "Scalability",
                description: "Produce content at scale to support rapid growth without increasing overhead costs.",
                icon: <BarChart className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Consistency",
                description:
                  "Maintain a regular publishing schedule to keep your audience engaged and improve SEO rankings.",
                icon: <LineChart className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Cost Savings",
                description:
                  "Reduce expenses associated with hiring technical writers while maintaining premium content standards.",
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
              Blogosocial's Unique Approach to SaaS Company Blog Automation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Blogosocial, we don't just automate blogs—we revolutionize them through our proprietary 5-layer expert
              blogging engine, designed specifically for SaaS companies.
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
                    Craft precise, engaging content tailored to your niche audience's needs.
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
              Key Features of Blogosocial's SaaS Company Blog Automation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive solution offers everything you need to streamline your SaaS content strategy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Advanced Keyword Optimization",
                description:
                  'Our system uses tools like SEMrush and Google Keyword Planner to identify high-value keywords tailored specifically to the SaaS industry. By targeting long-tail keywords such as "how to scale a SaaS business" or "best CRM tools for startups," we ensure your blogs rank higher on search engines.',
                icon: <Search className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Technical Content Expertise",
                description:
                  "We specialize in creating blogs that simplify complex topics like machine learning algorithms, API integrations, or cloud-native architectures while maintaining accuracy.",
                icon: <Code className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Multi-Language Support",
                description:
                  "With support for over 50 languages validated by native linguists, we help SaaS companies expand their reach globally while maintaining localized accuracy.",
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Blogosocial for SaaS Blogging?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our unique selling points set us apart from other content creation services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Guaranteed Rankings Within 120 Days",
                description:
                  "Achieve top-tier Google rankings with our proven SEO strategies tailored specifically for the SaaS niche.",
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
                title: "Scalable Solutions",
                description: "Whether you need one blog or hundreds per month, our platform adapts seamlessly.",
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases for SaaS Company Blog Automation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our blog automation solution can help SaaS companies create various types of content.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Product Tutorials",
                description: "Create detailed blogs explaining how to use your software products effectively.",
                icon: <Code className="h-4 w-4" />,
              },
              {
                title: "Industry Trends Analysis",
                description: "Share insights on emerging technologies like AI-driven automation or low-code platforms.",
                icon: <LineChart className="h-4 w-4" />,
              },
              {
                title: "Thought Leadership Content",
                description:
                  'Publish articles on topics like "The Future of Cloud Computing" or "How DevOps Transforms Software Delivery."',
                icon: <Award className="h-4 w-4" />,
              },
              {
                title: "SEO-Focused Blogs",
                description:
                  'Target keywords like "best collaboration tools" or "how to implement data security in SaaS."',
                icon: <Search className="h-4 w-4" />,
              },
              {
                title: "Customer Case Studies",
                description: "Highlight success stories showcasing how your software solved real-world problems.",
                icon: <Users className="h-4 w-4" />,
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

