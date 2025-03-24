"use client"

import { motion } from "framer-motion"
import {
  Factory,
  Clock,
  Check,
  BarChart,
  Zap,
  Database,
  Search,
  TrendingUp,
  Calendar,
  FileText,
  Settings,
  PenToolIcon as Tool,
  Cpu,
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

export default function ManufacturingCompanyBlogAutomationPage() {
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
                  Manufacturing Industry
                </span>
              </div>

              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Manufacturing Company Automation:{" "}
                  <span className="bg-[#FF9626] text-white px-3 py-1 relative top-7">Optimize</span>
                </h1>
              </div>

              <p className="text-xl text-gray-700 mb-8 mt-10 relative top-5">
                In the competitive landscape of manufacturing, effective communication and content management are
                essential for engaging stakeholders and driving business growth. Blog automation is a transformative
                tool that allows manufacturing companies to streamline their content creation and distribution
                processes.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Introduction to Manufacturing Company Blog Automation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Manufacturing Company Blog Automation offers a transformative solution, enabling industrial businesses to
              create engaging, high-quality content effortlessly while focusing on their core production activities. At
              Blogosocial, we specialize in automating blog creation for manufacturers using our unique hybrid model
              that combines industry expertise with advanced AI technology.
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
                The manufacturing sector is experiencing a significant shift towards automation, with the global market
                projected to reach $25 billion by 2027. Automation technologies are revolutionizing production
                processes, enhancing efficiency, and addressing labor shortages.
              </p>

              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Automation Potential</h3>
                    <p className="text-gray-600">
                      Approximately 23% of tasks in manufacturing can be automated, leading to reduced production times.
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
                      The global manufacturing automation market is projected to reach $25 billion by 2027.
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
                    <h3 className="font-semibold text-lg">Quality Improvement</h3>
                    <p className="text-gray-600">
                      Automation leads to improved product quality and fewer recalls in manufacturing processes.
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
                    <h3 className="font-semibold text-lg">Content Demand</h3>
                    <p className="text-gray-600">
                      As manufacturers increasingly adopt these technologies, the demand for informative content that
                      addresses these advancements becomes crucial.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-gray-700">
                As manufacturers increasingly adopt automation technologies, the demand for informative content that
                addresses these advancements becomes crucial for stakeholder engagement and business growth.
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
                  src="/placeholder.svg?height=600&width=600"
                  alt="Manufacturing Company Blog Automation"
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Key Benefits of Blog Automation for Manufacturing Companies
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Automating blog creation offers several advantages for manufacturing companies looking to enhance their
              online presence and stakeholder communication.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Time Efficiency",
                description:
                  "Automating repetitive tasks such as content scheduling and social media sharing allows manufacturers to focus on high-value activities, such as optimizing production processes and improving client relationships.",
                icon: <Clock className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Consistent Content Delivery",
                description:
                  "Regularly updated blogs help maintain audience engagement and improve SEO rankings. Automated scheduling ensures that content is published consistently without manual intervention.",
                icon: <Calendar className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Enhanced Quality Control",
                description:
                  "Automation reduces human error in both production and content creation processes, leading to higher quality outputs and fewer recalls.",
                icon: <Settings className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Data-Driven Insights",
                description:
                  "Automated analytics tools provide valuable insights into audience engagement metrics, enabling manufacturers to tailor their content strategies based on real-time data.",
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
              Blogosocial's Unique Approach to Manufacturing Company Blog Automation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Blogosocial, we don't just automate blogs—we revolutionize them through our proprietary 5-layer expert
              blogging engine, designed specifically for manufacturing companies.
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
                  <td className="py-4 px-6 text-gray-800 font-medium">Industry Content Experts</td>
                  <td className="py-4 px-6 text-gray-600">
                    Craft precise, engaging content tailored to your manufacturing niche and target audience.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Manufacturing Professionals</td>
                  <td className="py-4 px-6 text-gray-600">
                    Provide real-world insights and strategies that resonate with clients and stakeholders.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Technical Research Technology</td>
                  <td className="py-4 px-6 text-gray-600">
                    Analyze industry trends and technical specifications to ensure accurate and relevant content for
                    your specific manufacturing processes.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">AI Deep Research Layer</td>
                  <td className="py-4 px-6 text-gray-600">
                    Leverage advanced AI tools for comprehensive research on manufacturing innovations and industry
                    developments.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Technical Accuracy Review</td>
                  <td className="py-4 px-6 text-gray-600">
                    Enforce rigorous editorial standards for accuracy and technical precision in all content.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 mt-6 text-center">
            This hybrid model ensures every blog we produce is optimized for search engines while delivering genuine
            value to readers—showcasing your expertise and driving business growth.
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
              To improve visibility and attract relevant traffic to manufacturing blogs, consider incorporating these
              high-volume keywords.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                keyword: "Manufacturing blog automation",
                icon: <Factory className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Industrial automation benefits",
                icon: <Settings className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Manufacturing process optimization",
                icon: <Tool className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Automated content management",
                icon: <FileText className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Manufacturing industry trends",
                icon: <TrendingUp className="h-5 w-5 text-[#FF9626]" />,
              },
              {
                keyword: "Industrial productivity tools",
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
            Long-tail keywords like "how to automate a manufacturing blog" can also help target specific queries
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
              Key Features of Blogosocial's Manufacturing Company Blog Automation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive solution offers everything you need to streamline your manufacturing company's content
              strategy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Industry-Specific Keyword Optimization",
                description:
                  "Our system uses specialized manufacturing SEO tools to identify high-value keywords tailored specifically to your production niche. By targeting long-tail keywords such as 'precision CNC machining services' or 'custom industrial automation solutions,' we ensure your blogs rank higher on search engines.",
                icon: <Search className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Technical Content Accuracy",
                description:
                  "All content is reviewed by manufacturing professionals to ensure technical accuracy and precision in describing processes, equipment, and innovations.",
                icon: <Tool className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Seamless CMS Integration",
                description:
                  "Blogosocial integrates effortlessly with popular CMS platforms and industrial website builders—streamlining publishing workflows for busy manufacturing companies.",
                icon: <Database className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "AI-Powered Technical Research",
                description:
                  "Our AI tools analyze industry trends, technical specifications, and manufacturing innovations to provide robust, relevant foundations for every blog.",
                icon: <Cpu className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Quality Control Systems",
                description:
                  "By automating content creation and management processes, manufacturing companies can ensure consistent quality in their communications, mirroring the precision of their production processes.",
                icon: <Settings className="h-8 w-8 text-[#FF9626]" />,
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Blogosocial for Manufacturing Company Blogging?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our unique selling points set us apart from other content creation services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Tailored Solutions",
                description:
                  "Our platform is specifically designed to meet the unique needs of manufacturing companies, enhancing efficiency across various production lines.",
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
                title: "Technical Precision Guaranteed",
                description:
                  "All content adheres to industry standards and technical specifications relevant to your manufacturing processes.",
              },
              {
                title: "Industry Specialization",
                description:
                  "Content is tailored to your specific manufacturing niche and target audience demographics.",
              },
              {
                title: "Expert-Led Technical Content",
                description:
                  "Our team combines manufacturing industry expertise with AI precision for unmatched quality and relevance.",
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases for Manufacturing Company Blog Automation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our blog automation solution can help manufacturing companies create various types of content.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Product Showcases",
                description:
                  "Create detailed blogs highlighting your manufacturing capabilities and product specifications to attract potential clients.",
                icon: <Factory className="h-4 w-4" />,
              },
              {
                title: "Process Innovations",
                description:
                  "Share insights about your manufacturing innovations and process improvements to establish thought leadership.",
                icon: <Settings className="h-4 w-4" />,
              },
              {
                title: "Industry Trends",
                description:
                  "Create educational content about emerging trends and technologies in the manufacturing sector.",
                icon: <TrendingUp className="h-4 w-4" />,
              },
              {
                title: "Quality Control Insights",
                description: "Showcase your quality control processes to build trust with potential clients.",
                icon: <Tool className="h-4 w-4" />,
              },
              {
                title: "Case Studies",
                description:
                  "Highlight successful manufacturing projects with measurable results to demonstrate your capabilities.",
                icon: <FileText className="h-4 w-4" />,
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
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose a plan that fits your manufacturing company's needs.
            </p>
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
                  <td className="py-4 px-6 text-gray-600">Two Expert-Led Manufacturing Blogs</td>
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

      {/* CTA Section */}
      <section className="py-16 bg-[#FF9626]" id="contact">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Call-to-Action: Enhance Your Manufacturing Blog Strategy Today!
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Are you ready to enhance your manufacturing blog strategy? Discover how our automation solutions can
              streamline your content management processes and boost your online presence.
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
              Blogosocial: Where Manufacturing Expertise Meets Innovation—Your Partner in Industrial Content Excellence!
            </p>
          </motion.div>
        </div>
      </section>

      <TrustedBySection />
      <Footer />
    </main>
  )
}

