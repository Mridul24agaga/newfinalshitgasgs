import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      {/* CTA Section */}
      <div className="bg-[#294df6] py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
            Grow Faster, Rank Higher
            <span className="block text-white/90">With GetMoreSEO</span>
          </h2>
          <p className="text-white/80 mb-8">Don't miss out on more traffic, higher rankings, and better results.</p>

          <div className="flex justify-center mb-12">
            <Link
              href="/get-started"
              className="bg-white hover:bg-gray-100 text-[#294df6] px-6 py-3 rounded-md font-medium inline-flex items-center transition-colors duration-200 shadow-md"
            >
              Start For Free Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-1 flex items-center justify-center mr-2">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="text-white">100% Human Written Content</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-1 flex items-center justify-center mr-2">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="text-white">Full Access</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-1 flex items-center justify-center mr-2">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="text-white">With Integrations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <div className="flex items-center">
            <Image src="/getmoreseo.png" alt="GetMoreSEO Logo" width={120} height={40} className="h-10 w-auto" />
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          <div className="text-sm text-gray-500 mb-4 md:mb-0">© 2025 GetMoreSEO Inc. All rights reserved.</div>
          <div className="text-sm text-gray-500 flex items-center">
            Made with <span className="text-red-500 mx-1">❤</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
