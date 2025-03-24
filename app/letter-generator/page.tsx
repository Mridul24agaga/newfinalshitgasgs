"use client"

import { motion } from "framer-motion"
import { Users, Briefcase, Check } from "lucide-react"
import { Saira } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import Footer from "../components/footer"
import TrustedBySection from "../components/trusted"
import TestimonialsSection from "../components/testimonials"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

export default function LetterGeneratorPage() {
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
                href="/tools"
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium text-gray-900"
              >
                Tools
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
                <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">Free Tool</span>
              </div>

              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Free Letter Generator Tool by <span className="bg-[#FF9626] text-white px-3 py-1 relative top-6">Blogosocial</span>
                </h1>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 relative top-5">Write Perfect Letters in Seconds</h1>
              </div>

              <p className="text-xl text-gray-700 mb-8 mt-10">
                Are you tired of staring at a blank page, struggling to craft the perfect letter? Whether it's for
                business, personal, or professional use, writing letters can be time-consuming and challenging. That's
                why we created the Free Letter Generator Tool—a fast, easy, and efficient way to create polished,
                professional letters in just seconds.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is a Letter Generator */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Is a Letter Generator?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A Letter Generator is an innovative tool designed to automate the process of writing letters. It allows
              users to create customized letters by simply inputting key details such as the recipient, purpose, tone
              (formal or informal), and length. The tool generates a professionally structured letter that is ready for
              use—saving you time and effort.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Use Our Letter Generator */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Use Blogosocial's Free Letter Generator?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              With Blogosocial's Letter Generator, you can say goodbye to writer's block and hello to perfectly written
              letters tailored to your needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Saves Time and Effort",
                description:
                  "Forget spending hours drafting letters from scratch. Our tool generates high-quality letters in seconds, allowing you to focus on what matters most.",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                title: "Perfect for All Occasions",
                description:
                  "Whether you need a business proposal, a formal complaint letter, a personal thank-you note, or even an academic recommendation letter, our generator has you covered.",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                title: "Customizable and User-Friendly",
                description:
                  "Choose between formal and casual tones. Adjust the length of the letter as per your requirements. Input specific details for a personalized touch.",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                title: "Error-Free Writing",
                description:
                  "The tool ensures proper grammar, spelling, and formatting—delivering polished letters that leave a lasting impression.",
                image: "/placeholder.svg?height=400&width=400",
              },
              {
                title: "Completely Free",
                description:
                  "No hidden costs or sign-ups required! Access the tool anytime and start generating letters instantly.",
                image: "/placeholder.svg?height=400&width=400",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="relative mb-6">
                  <div className="h-12 w-12 rounded-full bg-[#FF9626] flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">{index + 1}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features of Blogosocial's Letter Generator</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our tool is designed with powerful features to make letter writing effortless and professional.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-lg font-semibold text-gray-700">Feature</th>
                  <th className="py-4 px-6 text-left text-lg font-semibold text-gray-700">Benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Customizable Templates</td>
                  <td className="py-4 px-6 text-gray-600">
                    Pre-defined formats for business, personal, or professional letters.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Tone Adjustment</td>
                  <td className="py-4 px-6 text-gray-600">
                    Choose between formal or informal styles based on your needs.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Grammar & Spell Check</td>
                  <td className="py-4 px-6 text-gray-600">Ensures error-free writing for a professional finish.</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Quick Generation</td>
                  <td className="py-4 px-6 text-gray-600">Create a complete letter in under 10 seconds!</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Multi-Language Support</td>
                  <td className="py-4 px-6 text-gray-600">
                    Generate letters in over 50 languages with native-level accuracy.
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Download & Share Options</td>
                  <td className="py-4 px-6 text-gray-600">
                    Save your letter as a PDF or share it directly via email or messaging apps.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">How to Use Blogosocial's Free Letter Generator</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our tool is designed to be intuitive and easy to use. Follow these simple steps:
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: "Input Key Details",
                    description:
                      "Enter the recipient's name, purpose of the letter, and any specific information you'd like included.",
                  },
                  {
                    title: "Select Tone and Style",
                    description: "Choose whether the letter should be formal or casual based on its purpose.",
                  },
                  {
                    title: "Generate Your Letter",
                    description:
                      'Click the "Generate Letter" button and watch as your custom letter is created instantly!',
                  },
                  {
                    title: "Review & Download",
                    description:
                      "Make any necessary edits using our user-friendly interface, then download or share your letter directly.",
                  },
                ].map((step, index) => (
                  <div key={index} className="flex">
                    <div className="mr-4 mt-1">
                      <div className="h-6 w-6 rounded-full bg-[#FF9626] flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                ))}
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
                  alt="Letter Generator Interface"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who Can Benefit */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Can Benefit from Our Letter Generator?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">Our tool is designed for everyone:</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Business Professionals",
                description:
                  "Draft proposals, cover letters, resignation letters, or client communications effortlessly.",
              },
              {
                title: "Students & Academics",
                description: "Create recommendation letters, scholarship applications, or formal requests with ease.",
              },
              {
                title: "Personal Use",
                description: "Write heartfelt thank-you notes, invitations, or apology letters without stress.",
              },
              {
                title: "Frequent Writers",
                description: "Save time on repetitive tasks like follow-up emails or meeting requests.",
              },
            ].map((user, index) => (
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
                    <Users className="h-4 w-4" />
                  </div>
                  <h3 className="text-xl font-semibold">{user.title}</h3>
                </div>
                <p className="text-gray-600 pl-11">{user.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Benefits */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">SEO Benefits of Using Our Free Tool</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Blogosocial's Free Letter Generator isn't just about convenience—it's also optimized to help you rank
              higher in search engines:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Targeted Keywords",
                description:
                  "Targeted keywords like &quot;free letter generator,&quot; &quot;AI-powered letter writer,&quot; and &quot;customizable letter templates&quot; ensure maximum visibility.",
              },
              {
                title: "Multi-language Support",
                description:
                  "Multi-language capabilities allow users worldwide to discover and use the tool in their native language.",
              },
              {
                title: "Regular Updates",
                description: "Regular updates ensure compatibility with evolving SEO trends.",
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
                <div className="h-12 w-12 rounded-full bg-[#FF9626] flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Blogosocial Over Other Tools?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Unlike other tools that charge fees or offer limited functionality, Blogosocial provides a comprehensive
              solution that is free, user-friendly, and packed with features.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-lg font-semibold text-gray-700">Feature</th>
                  <th className="py-4 px-6 text-left text-lg font-semibold text-gray-700">Blogosocial</th>
                  <th className="py-4 px-6 text-left text-lg font-semibold text-gray-700">Other Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Completely Free</td>
                  <td className="py-4 px-6 text-green-600">✅</td>
                  <td className="py-4 px-6 text-red-600">❌ (often require subscriptions)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Multi-Language Support</td>
                  <td className="py-4 px-6 text-green-600">✅ (50+ languages)</td>
                  <td className="py-4 px-6 text-gray-600">Limited</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Customization Options</td>
                  <td className="py-4 px-6 text-green-600">✅</td>
                  <td className="py-4 px-6 text-gray-600">Limited</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Error-Free Writing</td>
                  <td className="py-4 px-6 text-green-600">✅</td>
                  <td className="py-4 px-6 text-gray-600">May require manual corrections</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium">Download & Share Options</td>
                  <td className="py-4 px-6 text-green-600">✅</td>
                  <td className="py-4 px-6 text-gray-600">Limited</td>
                </tr>
              </tbody>
            </table>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Use Cases for Blogosocial's Letter Generator</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our tool can help you create a wide variety of letters for different purposes:
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Business Letters",
                description:
                  "Draft professional proposals, resignation letters, client communications, or follow-up emails effortlessly.",
              },
              {
                title: "Personal Letters",
                description: "Write thank-you notes, invitations, apology letters, or heartfelt messages quickly.",
              },
              {
                title: "Academic Letters",
                description: "Create recommendation letters for students or scholarship applications with ease.",
              },
              {
                title: "Legal & Formal Letters",
                description: "Generate complaint letters or formal requests while ensuring proper structure and tone.",
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
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <h3 className="text-xl font-semibold">{useCase.title}</h3>
                </div>
                <p className="text-gray-600 pl-11">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection/>

      {/* FAQ Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">FAQs About Blogosocial's Free Letter Generator</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get answers to the most commonly asked questions about our tool.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "What types of letters can I create with this tool?",
                answer:
                  "You can create business proposals, personal notes, academic recommendations, complaint letters, thank-you notes, invitations, and more!",
              },
              {
                question: "Is it really free?",
                answer:
                  "Yes! Our Letter Generator is completely free to use with no hidden costs or sign-ups required.",
              },
              {
                question: "Can I generate letters in different languages?",
                answer: "The tool supports over 50 languages with native-level accuracy.",
              },
              {
                question: "How long does it take to generate a letter?",
                answer: "Typically less than 10 seconds! Just input your details and let our AI do the rest.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <h3 className="text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <TrustedBySection />


      {/* CTA Section */}
      <section className="py-16 bg-[#FF9626]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Call-to-Action: Try It Now!</h2>
            <p className="text-xl text-white opacity-90 mb-8">
              Ready to simplify your letter-writing process? Experience the power of Blogosocial's Free Letter Generator
              today!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/generate-letter"
                className="px-6 py-3 bg-white text-[#FF9626] rounded-lg font-medium flex items-center justify-center hover:bg-gray-100 transition-colors text-lg"
              >
                Generate Your Letter Now
              </Link>
            </div>

            <p className="text-white mt-8 opacity-80">
              Blogosocial: Where innovation meets simplicity—helping you communicate effectively without breaking a
              sweat!
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

