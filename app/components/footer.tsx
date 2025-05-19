import Link from "next/link"
import Image from "next/image"
import { Mail, CreditCard, Clock, ShieldCheck } from "lucide-react"

export default function Footer() {
  const footerLinks = [
    {
      title: "COMPARISONS",
      links: [
        { name: "GetMoreSEO vs Outrank.so", href: "/getmoreseo-vs-outrank" },
        { name: "GetMoreSEO vs SebotAI", href: "/getmoreseo-vs-seobotai" },
        { name: "GetMoreSEO vs Surfer SEO", href: "/getmoreseo-vs-surferseo" },
      ],
    },
    {
      title: "QUICK LINKS",
      links: [
        { name: "Home", href: "/", highlight: true },
        { name: "Results", href: "/#results" },
        { name: "Examples", href: "/#examples" },
        { name: "How It Works", href: "/#howitworks" },
        { name: "FAQ", href: "/#faq" },
      ],
    },
  ]

  return (
    <div className="relative">
      {/* CTA Card - Overlapping the footer */}
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="rounded-3xl overflow-hidden shadow-2xl transform translate-y-24">
          {/* White Background with Colorful Accents */}
          <div className="relative bg-white px-8 py-12 md:px-16 md:py-20">
            {/* Colorful accent elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Blue accent */}
              <div className="absolute top-0 left-0 w-[30%] h-[30%] bg-[#4f46e5]/20 blur-3xl rounded-full"></div>
              {/* Pink accent */}
              <div className="absolute bottom-0 left-[20%] w-[25%] h-[25%] bg-[#ec4899]/20 blur-3xl rounded-full"></div>
              {/* Orange accent */}
              <div className="absolute top-[30%] right-0 w-[35%] h-[35%] bg-[#f97316]/20 blur-3xl rounded-full"></div>
              {/* Fluorescent green accent */}
              <div className="absolute bottom-[10%] right-[15%] w-[20%] h-[20%] bg-[#4ade80]/20 blur-3xl rounded-full"></div>
            </div>

            {/* Border accents */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4f46e5] via-[#ec4899] to-[#f97316]"></div>
            <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-[#f97316] via-[#4ade80] to-[#4f46e5]"></div>

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-6">
                  Automate your Blogging today
                </h2>
                <p className="text-lg text-[#1a1a1a]/80 max-w-2xl mx-auto">
                  Get your samples and start generating articles for your business.
                </p>
              </div>

              {/* Email Form */}
              <div className="max-w-3xl mx-auto mb-12">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-grow px-6 py-4 rounded-lg text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 shadow-sm"
                  />
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white px-8 py-4 rounded-lg font-medium text-base whitespace-nowrap transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform"
                  >
                    Get one Article for Free →
                  </Link>
                </div>
                <p className="text-center text-sm text-gray-500 mt-3">
                  No credit card required. Start creating in minutes.
                </p>
              </div>

              {/* Features */}
              <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 text-[#1a1a1a]">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-[#4f46e5]/10 mr-3">
                    <CreditCard className="h-5 w-5 text-[#4f46e5]" />
                  </div>
                  <span>No card required</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-[#ec4899]/10 mr-3">
                    <Clock className="h-5 w-5 text-[#ec4899]" />
                  </div>
                  <span>Articles in 30 secs</span>
                </div>
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-[#4ade80]/10 mr-3">
                    <ShieldCheck className="h-5 w-5 text-[#4ade80]" />
                  </div>
                  <span>Plagiarism Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer with padding to accommodate the overlapping card */}
      <footer className="bg-[#0f1116] text-gray-300 pt-40 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Footer Links and CTA Side-by-Side */}
          <div className="flex flex-col lg:flex-row gap-8 mb-20">
            {/* Footer Links */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-12 lg:flex-1">
              {footerLinks.map((column, i) => (
                <div key={i}>
                  <h3 className="text-sm font-medium text-white mb-6">{column.title}</h3>
                  <ul className="space-y-3">
                    {column.links.map((link, j) => (
                      <li key={j}>
                        <Link
                          href={link.href}
                          className={`text-sm ${link.highlight ? "text-[#7c3aed] font-medium" : "text-gray-400"} hover:text-white transition-colors ${link.highlight ? "flex items-center" : ""}`}
                        >
                          {link.name}
                          {link.highlight && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-1"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Sign Up CTA Side Banner */}
            <div className="lg:w-1/3 bg-gradient-to-br from-[#4f46e5]/20 via-[#7c3aed]/15 to-[#ec4899]/10 rounded-xl p-8 border border-[#7c3aed]/20 shadow-lg relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4f46e5]/10 rounded-full blur-2xl animate-pulse"></div>
              <div
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#ec4899]/10 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>

              <div className="relative z-10">
                <div className="mb-8">
                  <span className="inline-block px-3 py-1 bg-[#4f46e5]/10 text-[#4f46e5] text-xs font-semibold rounded-full mb-3">
                    LIMITED TIME OFFER
                  </span>
                  <h3 className="text-white text-xl font-bold mb-3">Skyrocket Your SEO Rankings Today!</h3>
                  <p className="text-gray-300">
                    Join 10,000+ businesses already dominating search results with GetMoreSEO.
                  </p>
                </div>
                <div className="space-y-3">
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] hover:from-[#4338ca] hover:to-[#6d28d9] text-white px-6 py-3 rounded-lg font-medium text-base w-full whitespace-nowrap transition-all duration-200 flex items-center justify-center group"
                  >
                    Get 50% Off Today
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                  <div className="flex items-center justify-center text-xs text-gray-400">
                    <ShieldCheck className="h-4 w-4 text-[#4ade80] mr-1" />
                    <span>30-day money-back guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="pt-10 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="mb-6 md:mb-0">
                {/* Logo */}
                <div className="flex items-center">
                  <Link href="/" className="flex items-center">
                    <Image
                      src="/logowhite.png" // Replace this with the path to your logo image
                      alt="GetMoreSEO Logo"
                      width={120} // Adjust size as needed
                      height={120}
                      className="object-contain"
                    />
                  </Link>
                </div>

                {/* Social Links */}
                <div className="flex space-x-6 mb-6 mt-6">
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  ></a>
                  <a href="https://www.linkedin.com/in/mridulthareja/" className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src="/mridul.jpg"
                      alt="Founder"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </a>
                  <a href="https://www.linkedin.com/in/krissmann/" className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src="/krissmann.jpg"
                      alt="Founder"
                      width={24}
                      height={24}
                      className="w-full h-full object-cover"
                    />
                  </a>
                </div>

                {/* Copyright */}
                <div className="text-xs text-gray-500 mt-4">Copyright 2025. MARKUPX BRANDS. All rights reserved!</div>
              </div>

              {/* Contact & Legal */}
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8">
                <a
                  href="mailto:support@getmoreseo.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  hi@mridulthareja.com
                </a>
                <Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
