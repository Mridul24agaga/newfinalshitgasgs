"use client"

import { motion } from "framer-motion"
import {
  BookOpen,
  Clock,
  Check,
  BarChart,
  Zap,
  Database,
  Search,
  TrendingUp,
  Sparkles,
  Calendar,
  FileText,
  Users,
  Scale,
  Shield,
  Gavel,
} from "lucide-react"
import { Saira } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/footer"
import TrustedBySection from "../components/trusted"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

export default function LawFirmBlogAutomationPage() {
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
                  Legal Industry
                </span>
              </div>

              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Law Firm Blog Automation: <span className="bg-[#FF9626] text-white px-3 py-1">Optimize</span>
                </h1>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Your Content Strategy with Blogosocial
                </h1>
              </div>

              <p className="text-xl text-gray-700 mb-8 mt-10">
                In today's competitive legal landscape, law firms must leverage technology to enhance their efficiency
                and client engagement. Blog automation is a powerful tool that allows law firms to streamline their
                content creation and distribution processes, ensuring they remain relevant and informative in a rapidly
                changing environment.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Introduction to Law Firm Blog Automation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto ">
              Law Firm Blog Automation offers a transformative solution, enabling legal professionals to create
              engaging, high-quality content effortlessly while focusing on their core services. At Blogosocial, we
              specialize in automating blog creation for law firms using our unique hybrid model that combines legal
              expertise with advanced AI technology.
            </p>
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
                The legal industry is undergoing a significant transformation due to advancements in technology.
                According to McKinsey Global, approximately 23% of a lawyer's tasks can be automated with existing
                technology, which can lead to substantial time savings and increased productivity.
              </p>

              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Technological Transformation</h3>
                    <p className="text-gray-600">
                      Law firms face mounting pressure to deliver timely and accurate information to clients.
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
                    <h3 className="font-semibold text-lg">Market Growth</h3>
                    <p className="text-gray-600">
                      The global legal tech market is expected to reach $25 billion by 2027.
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
                    <h3 className="font-semibold text-lg">Competitive Edge</h3>
                    <p className="text-gray-600">
                      Automating blog management becomes essential for maintaining a competitive edge in the legal
                      industry.
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
                    <h3 className="font-semibold text-lg">Automation Potential</h3>
                    <p className="text-gray-600">
                      Approximately 23% of a lawyer's tasks can be automated with existing technology.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-gray-700">
                As law firms face mounting pressure to deliver timely and accurate information to clients, automating
                blog management becomes essential for maintaining a competitive edge.
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
                  alt="Law Firm Blog Automation"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Benefits of Blog Automation for Law Firms</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Automating blog creation offers several advantages for law firms looking to enhance their online presence
              and client communication.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Time Efficiency",
                description:
                  "Automating repetitive tasks such as content scheduling and social media sharing allows lawyers to focus on high-value activities, such as client interaction and case strategy.",
                icon: <Clock className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Consistent Content Delivery",
                description:
                  "Regularly updated blogs help maintain audience engagement and improve SEO rankings. Automated scheduling ensures that content is published consistently without manual intervention.",
                icon: <Calendar className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Enhanced Client Experience",
                description:
                  "Automation tools can streamline client communication, providing timely updates on case statuses and enhancing overall client satisfaction.",
                icon: <Users className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Data-Driven Insights",
                description:
                  "Automated analytics tools provide valuable insights into audience engagement metrics, enabling law firms to tailor their content strategies based on real-time data.",
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
              Blogosocial's Unique Approach to Law Firm Blog Automation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Blogosocial, we don't just automate blogs—we revolutionize them through our proprietary 5-layer expert
              blogging engine, designed specifically for legal professionals.
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
                  <td className="py-4 px-6 text-gray-800 font-medium">Legal Content Experts</td>
                  <td className="py-4 px-6 text-gray-600">
                    Craft precise, engaging content tailored to your practice areas and target audience.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Practicing Attorneys</td>
                  <td className="py-4 px-6 text-gray-600">
                    Provide real-world insights and strategies that resonate with clients and prospects.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Legal Research Technology</td>
                  <td className="py-4 px-6 text-gray-600">
                    Analyze case law and legal trends to ensure accurate and relevant content for your specific
                    practice.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">AI Deep Research Layer</td>
                  <td className="py-4 px-6 text-gray-600">
                    Leverage advanced AI tools for comprehensive research on legal developments and precedents.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Legal Compliance Review</td>
                  <td className="py-4 px-6 text-gray-600">
                    Enforce rigorous editorial standards for accuracy and ethical compliance in all content.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 mt-6 text-center">
            This hybrid model ensures every blog we produce is optimized for search engines while delivering genuine
            value to readers—showcasing your expertise and driving client acquisition.
          </p>
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
              To improve visibility and attract relevant traffic to law firm blogs, consider incorporating these
              high-volume keywords.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                keyword: "Law firm blog automation",
                icon: <Gavel className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Legal content management",
                icon: <FileText className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Automate legal workflows",
                icon: <Clock className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Client communication automation",
                icon: <Users className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Legal document automation",
                icon: <FileText className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Law firm productivity tools",
                icon: <Zap className="h-5 w-5 text-[#FF9626]" />,
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
            Long-tail keywords like "best practices for law firm blog automation" can also help target specific queries
            effectively.
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
              Key Features of Blogosocial's Law Firm Blog Automation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive solution offers everything you need to streamline your law firm's content strategy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Legal-Specific Keyword Optimization",
                description:
                  "Our system uses specialized legal SEO tools to identify high-value keywords tailored specifically to your practice areas. By targeting long-tail keywords such as 'experienced personal injury attorney in [location]' or 'corporate law firm specializing in mergers,' we ensure your blogs rank higher on search engines.",
                icon: <Search className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Compliance-Focused Content",
                description:
                  "All content is reviewed by legal professionals to ensure accuracy and compliance with ethical guidelines and bar association rules.",
                icon: <Shield className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Seamless CMS Integration",
                description:
                  "Blogosocial integrates effortlessly with popular CMS platforms and legal-specific website builders—streamlining publishing workflows for busy law firms.",
                icon: <Database className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "AI-Powered Legal Research",
                description:
                  "Our AI tools analyze case law, statutes, and legal trends to provide robust, relevant foundations for every blog.",
                icon: <Sparkles className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Error Reduction Systems",
                description:
                  "By automating document creation and management processes, law firms can minimize human errors that often occur during manual entry, ensuring accuracy in client communications.",
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Blogosocial for Law Firm Blogging?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our unique selling points set us apart from other content creation services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Tailored Solutions",
                description:
                  "Our platform is specifically designed to meet the unique needs of law firms, enhancing efficiency across various practice areas.",
              },
              {
                title: "User-Friendly Interface",
                description:
                  "Enjoy an intuitive system that simplifies the blogging process from planning to execution.",
              },
              {
                title: "Expert Support",
                description:
                  "Benefit from dedicated support resources that help you maximize your automation efforts and improve your workflow efficiency.",
              },
              {
                title: "Legal Compliance Guaranteed",
                description:
                  "All content adheres to legal advertising rules and ethical guidelines specific to your jurisdiction.",
              },
              {
                title: "Practice Area Specialization",
                description: "Content is tailored to your specific practice areas and target client demographics.",
              },
              {
                title: "Expert-Led Legal Content",
                description:
                  "Our team combines legal industry expertise with AI precision for unmatched quality and relevance.",
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases for Law Firm Blog Automation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our blog automation solution can help law firms create various types of content.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Practice Area Insights",
                description:
                  "Create detailed blogs explaining complex legal concepts in your practice areas to educate potential clients.",
                icon: <Scale className="h-4 w-4" />,
              },
              {
                title: "Legal Updates",
                description:
                  "Share timely updates on changing laws and regulations that affect your clients' interests.",
                icon: <TrendingUp className="h-4 w-4" />,
              },
              {
                title: "Client Education",
                description:
                  "Create educational content that helps potential clients understand their legal rights and options.",
                icon: <BookOpen className="h-4 w-4" />,
              },
              {
                title: "Case Studies",
                description: "Showcase successful cases with anonymized details to demonstrate your firm's expertise.",
                icon: <FileText className="h-4 w-4" />,
              },
              {
                title: "FAQ Content",
                description: "Address common legal questions that potential clients frequently search for online.",
                icon: <Search className="h-4 w-4" />,
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

      {/* Pricing Plans */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing Plans</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Choose a plan that fits your firm's needs.</p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-md border border-gray-100">
              <thead className="bg-[#FF9626] text-white">
                <tr>
                  <th className="py-4 px-6 text-left text-lg font-semibold">Plan</th>
                  <th className="py-4 px-6 text-left text-lg font-semibold">Features</th>
                  <th className="py-4 px-6 text-left text-lg font-semibold">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-800 font-medium">Trial</td>
                  <td className="py-4 px-6 text-gray-600">Two Expert-Led Legal Blogs</td>
                  <td className="py-4 px-6 text-gray-800 font-bold">$9</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-800 font-medium">Monthly</td>
                  <td className="py-4 px-6 text-gray-600">Weekly Blogs Delivered</td>
                  <td className="py-4 px-6 text-gray-800 font-bold">$199/month</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-800 font-medium">Quarterly</td>
                  <td className="py-4 px-6 text-gray-600">Weekly Blogs for 3 Months</td>
                  <td className="py-4 px-6 text-gray-800 font-bold">$499</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-800 font-medium">Semi-Annual</td>
                  <td className="py-4 px-6 text-gray-600">Weekly Blogs for 6 Months</td>
                  <td className="py-4 px-6 text-gray-800 font-bold">$899</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors bg-gray-50">
                  <td className="py-4 px-6 text-gray-800 font-bold">Annual</td>
                  <td className="py-4 px-6 text-gray-600">Weekly Blogs for 12 Months</td>
                  <td className="py-4 px-6 text-[#FF9626] font-bold">$1499</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <TrustedBySection />

      {/* CTA Section */}
      <section className="py-16 bg-[#FF9626]" id="contact">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Call-to-Action: Transform Your Law Firm's Blogging Strategy Today!
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Are you ready to transform your law firm's blogging strategy? Discover how our automation solutions can
              streamline your content management processes and enhance your online presence.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="mailto:info@blogosocial.com"
                className="px-6 py-3 bg-white text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-gray-100 transition-colors text-lg"
              >
                Contact Us
              </Link>
              <Link
                href="/schedule-demo"
                className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-medium flex items-center justify-center hover:bg-white/10 transition-colors text-lg"
              >
                Schedule a Demo
              </Link>
            </div>

            <p className="text-white mt-8 opacity-80">
              Blogosocial: Where Legal Expertise Meets Innovation—Your Partner in Law Firm Blogging Excellence!
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

