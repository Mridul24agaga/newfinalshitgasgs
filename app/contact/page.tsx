"use client"

import { motion } from "framer-motion"
import { Mail, ArrowRight, Menu } from "lucide-react"
import { Saira } from "next/font/google"
import Link from "next/link"
import { useState } from "react"
import Footer from "../components/footer"

// Initialize the Saira font with the weights we need
const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-saira",
})

export default function ContactPage() {
  // You can replace this with your actual email address
  const contactEmail = "contact@blogosocial.com"
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className={`${saira.className} bg-white min-h-screen`}>
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

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>

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

            <div className="hidden md:flex items-center space-x-4">
              

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

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg z-50 py-2 px-4 mx-4"
        >
          <div className="flex flex-col space-y-3 py-2">
            <Link href="/about" className="text-gray-600 hover:text-gray-900 py-1">
              About
            </Link>
            <Link href="/team" className="text-gray-600 hover:text-gray-900 py-1">
              Team
            </Link>
            <Link href="/services" className="text-gray-600 hover:text-gray-900 py-1 font-medium text-gray-900">
              Services
            </Link>
            <Link href="/mission" className="text-gray-600 hover:text-gray-900 py-1">
              Mission
            </Link>
            <div className="pt-2 flex flex-row space-x-2">
              <Link
                href="/start"
                className="flex-1 flex items-center justify-center px-4 py-2 bg-[#FF9626] hover:bg-[#e88620] text-white rounded-full transition-all duration-300 font-medium"
              >
                Start for free
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Contact Section */}
      <section className="flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left Column - Orange Background */}
              <div className="bg-[#fd921c] p-8 md:p-12 text-white md:w-1/2 flex flex-col justify-between">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl sm:text-4xl font-bold mb-6"
                  >
                    Get in Touch
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-white/90 mb-8"
                  >
                    Have questions about our services? Need help with integration? We're here to help you succeed.
                  </motion.p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Link
                    href="/"
                    className="inline-flex items-center text-white font-medium hover:text-white/90 transition-colors"
                  >
                    <span>Back to home</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </motion.div>
              </div>

              {/* Right Column - White Background */}
              <div className="p-8 md:p-12 md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-8"
                >
                  <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                    Contact Us
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-8"
                >
                  <h3 className="text-2xl font-semibold mb-4">Email Us</h3>
                  <p className="text-gray-600 mb-6">
                    The fastest way to get in touch with our team is through email. We typically respond within 24
                    hours.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-gray-50 rounded-xl p-6 flex items-center gap-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="bg-[#fd921c]/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#fd921c]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email Address</p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-lg font-medium text-gray-900 hover:text-[#fd921c] transition-colors"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-8 text-center"
                >
                  <p className="text-gray-500 text-sm">
                    We look forward to hearing from you and helping with your content needs.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  )
}

