import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      {/* CTA Section */}
      <div className="bg-gray-50 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Grow Faster, Rank Higher
            <span className="block text-[#294df6]">With GetMoreSEO</span>
          </h2>
          <p className="text-gray-600 mb-8">Don't miss out on more traffic, higher rankings, and better results.</p>

          <div className="flex justify-center mb-12">
            <Link
              href="/get-started"
              className="bg-[#294df6] hover:bg-[#1e3fd0] text-white px-6 py-3 rounded-md font-medium inline-flex items-center"
            >
              Try GetMoreSEO free for 7 days
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-[#294df6] mr-2" />
              <span className="text-gray-700">No Credit Card</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-[#294df6] mr-2" />
              <span className="text-gray-700">Full Access</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-[#294df6] mr-2" />
              <span className="text-gray-700">7-Day Free Trial</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logo and Quick Links */}
      <div className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <Image 
              src="/getmoreseo.png" 
              alt="GetMoreSEO Logo" 
              width={120} 
              height={40} 
              className="h-10 w-auto"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/free-seo-course" className="text-gray-600 hover:text-[#294df6] text-sm">
              Free SEO Course
            </Link>
            <Link href="/seo-academy" className="text-gray-600 hover:text-[#294df6] text-sm">
              Free SEO Academy
            </Link>
            <Link href="/ai-translator" className="text-gray-600 hover:text-[#294df6] text-sm">
              Free AI Translator
            </Link>
            <Link href="/tools" className="text-gray-600 hover:text-[#294df6] text-sm">
              Free Tools
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Company */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Homepage
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/affiliate" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Affiliate Program
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Career
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Term & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/topic-explorer" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Topic Explorer
                  </Link>
                </li>
                <li>
                  <Link href="/ai-writer" className="text-gray-600 hover:text-[#294df6] text-sm">
                    AI Article Writer
                  </Link>
                </li>
                <li>
                  <Link href="/keyword-tracker" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Keyword Tracker
                  </Link>
                </li>
                <li>
                  <Link href="/blog-automation" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Blog Automation
                  </Link>
                </li>
                <li>
                  <Link href="/integrations" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="/feature-request" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Feature Request
                  </Link>
                </li>
                <li>
                  <Link href="/roadmap" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Roadmap
                  </Link>
                </li>
              </ul>
            </div>

            {/* Free SEO Tools */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Free SEO Tools</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/ai-outline-generator" className="text-gray-600 hover:text-[#294df6] text-sm">
                    AI Outline Generator
                  </Link>
                </li>
                <li>
                  <Link href="/active-to-passive" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Active To Passive Voice
                  </Link>
                </li>
                <li>
                  <Link href="/ai-paraphraser" className="text-gray-600 hover:text-[#294df6] text-sm">
                    AI Paraphraser
                  </Link>
                </li>
                <li>
                  <Link href="/ai-paragraph-generator" className="text-gray-600 hover:text-[#294df6] text-sm">
                    AI Paragraph Generator
                  </Link>
                </li>
                <li>
                  <Link href="/brand-voice-generator" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Brand Voice Generator
                  </Link>
                </li>
                <li>
                  <Link href="/free-tools" className="text-gray-600 hover:text-[#294df6] text-sm">
                    View All Free Tools
                  </Link>
                </li>
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Learn</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/free-seo-course" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Free SEO Course
                  </Link>
                </li>
                <li>
                  <Link href="/seo-academy" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Free SEO Academy
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-gray-600 hover:text-[#294df6] text-sm">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* Comparison */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Comparison</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/vs-surfer-seo" className="text-gray-600 hover:text-[#294df6] text-sm">
                    GetMoreSEO vs SurferSEO
                  </Link>
                </li>
                <li>
                  <Link href="/vs-clearscope" className="text-gray-600 hover:text-[#294df6] text-sm">
                    GetMoreSEO vs Clearscope
                  </Link>
                </li>
                <li>
                  <Link href="/vs-semrush" className="text-gray-600 hover:text-[#294df6] text-sm">
                    GetMoreSEO vs Semrush
                  </Link>
                </li>
                <li>
                  <Link href="/vs-scalenut" className="text-gray-600 hover:text-[#294df6] text-sm">
                    GetMoreSEO vs Scalenut
                  </Link>
                </li>
                <li>
                  <Link href="/vs-dashword" className="text-gray-600 hover:text-[#294df6] text-sm">
                    GetMoreSEO vs Dashword
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500 mb-4 md:mb-0">© 2024 GetMoreSEO Inc. All rights reserved.</div>
          <div className="text-sm text-gray-500 flex items-center">
            Made with <span className="text-red-500 mx-1">❤</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
