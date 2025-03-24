"use client"

import { motion } from "framer-motion"
import { BookOpen, Check, Zap, Users, LineChart, School, PenTool, Lightbulb } from "lucide-react"
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

export default function EducationBusinessBlogAutomationPage() {
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
                  Education Sector
                </span>
              </div>

              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Education Business Blog Automation: <span className="bg-[#FF9626] text-white px-3 py-1 relative top-7">Enhance</span>
                </h1>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 relative top-5">
                  Your Educational Content Strategy
                </h1>
              </div>

              <p className="text-xl text-gray-700 mb-8 mt-10">
                The education sector is undergoing a digital transformation, with institutions increasingly leveraging
                technology to enhance learning experiences. Blog automation plays a pivotal role in this transition by
                streamlining content creation and distribution processes, allowing educators to focus on what matters
                most - teaching and student engagement.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Introduction to Education Business Blog Automation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              As educational institutions adapt to new learning paradigms, there is a growing need for relevant and
              timely content that addresses the needs of students, educators, and administrators. Blog automation allows
              institutions to keep pace with these demands while ensuring high-quality content delivery that engages and
              informs their audience.
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
                The education sector is rapidly evolving, with digital transformation reshaping how institutions connect
                with their communities. Educational blogs serve multiple purposes:
              </p>

              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4 mt-1">
                    <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Student Engagement</h3>
                    <p className="text-gray-600">
                      Create content that resonates with students and enhances their learning experience.
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
                    <h3 className="font-semibold text-lg">Institutional Marketing</h3>
                    <p className="text-gray-600">
                      Showcase programs, faculty expertise, and campus life to attract prospective students.
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
                    <h3 className="font-semibold text-lg">Community Building</h3>
                    <p className="text-gray-600">
                      Foster connections between students, parents, alumni, and educators through shared content.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-gray-700">
                Automation in blog management allows institutions to keep pace with these demands while ensuring
                high-quality content delivery that meets the needs of diverse educational stakeholders.
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
                  alt="Education Blog Automation"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Benefits of Blog Automation in Education</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Automating blog creation offers several advantages for educational institutions looking to enhance their
              online presence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Enhanced Engagement",
                description:
                  "Automated content scheduling ensures that educational blogs remain active and engaging for readers, maintaining consistent connection with your audience.",
                icon: <Users className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Resource Optimization",
                description:
                  "By automating routine tasks such as post scheduling and social media sharing, educators can allocate more time to curriculum development and student interaction.",
                icon: <Zap className="h-10 w-10 text-[#FF9626]" />,
              },
              {
                title: "Improved Reach",
                description:
                  "Automated SEO tools can help optimize blog content for search engines, increasing visibility among prospective students and the broader educational community.",
                icon: <LineChart className="h-10 w-10 text-[#FF9626]" />,
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
              Blogosocial's Unique Approach to Education Blog Automation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Blogosocial, we don't just automate blogs—we revolutionize them through our proprietary 5-layer expert
              blogging engine, designed specifically for educational institutions.
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
                  <td className="py-4 px-6 text-gray-800 font-medium">Expert Education Writers</td>
                  <td className="py-4 px-6 text-gray-600">
                    Craft precise, engaging content tailored to your educational institution's mission and audience
                    needs.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Experienced Education Leaders</td>
                  <td className="py-4 px-6 text-gray-600">
                    Infuse real-world educational insights into every blog for strategic relevance.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Student Profile Research</td>
                  <td className="py-4 px-6 text-gray-600">
                    Analyze student demographics and interests to ensure hyper-targeted content creation.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">AI Deep Research Layer</td>
                  <td className="py-4 px-6 text-gray-600">
                    Leverage advanced AI tools (GPT-4 Turbo, Perplexity) for comprehensive research on educational
                    topics.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Dedicated Review Team</td>
                  <td className="py-4 px-6 text-gray-600">
                    Enforce rigorous editorial standards for accuracy and educational integrity.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-gray-700 mt-6 text-center">
            This hybrid model ensures every blog we produce is optimized for search engines while delivering genuine
            value to readers—enhancing educational outcomes and driving measurable institutional goals.
          </p>
        </div>
      </section>

      {/* Best SEO Keywords */}
      <section className="py-16 bg-white border-t border-gray-100" id="features">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Best SEO Keywords for Ranking</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Incorporating relevant keywords is vital for driving traffic to education blogs. Our system targets these
              key phrases to maximize your content's reach.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Education blog automation",
                description:
                  "Target educational institutions looking for comprehensive automation solutions for their content needs.",
                icon: <BookOpen className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Online learning resources",
                description: "Capture audiences searching for digital educational materials and learning platforms.",
                icon: <School className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Educational technology trends",
                description: "Attract institutions interested in staying current with the latest edtech innovations.",
                icon: <Lightbulb className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Student engagement strategies",
                description:
                  "Connect with educators looking for ways to better engage with their students through content.",
                icon: <Users className="h-8 w-8 text-[#FF9626]" />,
              },
              {
                title: "Content marketing for education",
                description: "Reach educational institutions seeking to improve their content marketing efforts.",
                icon: <PenTool className="h-8 w-8 text-[#FF9626]" />,
              },
            ].map((keyword, index) => (
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
                    {keyword.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{keyword.title}</h3>
                </div>
                <p className="text-gray-600 pl-13">{keyword.description}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-gray-700 mt-6 text-center">
            We also utilize long-tail keywords like "how to automate educational blog posts" to enhance targeting
            capabilities and connect with specific audience segments.
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
              Our unique selling points set us apart from other content creation services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Tailored Solutions",
                description:
                  "Our tools are specifically designed to meet the unique needs of educational institutions.",
              },
              {
                title: "User-Friendly Interface",
                description: "Enjoy an intuitive platform that simplifies the blogging process from start to finish.",
              },
              {
                title: "Continuous Improvement",
                description: "Leverage analytics-driven insights to refine your content strategy over time.",
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
              Choose a plan that fits your educational institution's needs.
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
                  <td className="py-4 px-6 text-gray-600">Two Expert-Led Blogs</td>
                  <td className="py-4 px-6 text-gray-800 font-bold">$9</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-800 font-medium">Monthly</td>
                  <td className="py-4 px-6 text-gray-600">Daily Blogs Delivered</td>
                  <td className="py-4 px-6 text-gray-800 font-bold">$149/month</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-800 font-medium">Quarterly</td>
                  <td className="py-4 px-6 text-gray-600">Daily Blogs for 3 Months</td>
                  <td className="py-4 px-6 text-gray-800 font-bold">$399</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-gray-800 font-medium">Semi-Annual</td>
                  <td className="py-4 px-6 text-gray-600">Daily Blogs for 6 Months</td>
                  <td className="py-4 px-6 text-gray-800 font-bold">$649</td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors bg-gray-50">
                  <td className="py-4 px-6 text-gray-800 font-bold">Annual</td>
                  <td className="py-4 px-6 text-gray-600">Daily Blogs for 12 Months</td>
                  <td className="py-4 px-6 text-[#FF9626] font-bold">$999</td>
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
              Transform Your Educational Content Strategy Today!
            </h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Explore our innovative solutions for automating your education business blog and connect with your
              audience like never before.
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
              Blogosocial: Where Innovation Meets Education—Your Partner in Educational Content Excellence!
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

