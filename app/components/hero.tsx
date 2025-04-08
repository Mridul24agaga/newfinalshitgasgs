import Image from "next/image"
import Link from "next/link"
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export default function Home() {
  return (
    <div className={`min-h-screen flex flex-col ${inter.variable} font-sans`}>
      {/* Promotion Banner */}
      <div className="bg-[#294df6] text-white py-3 px-4 flex items-center justify-between text-sm md:text-base">
        <div className="flex-1 hidden sm:block"></div>
        <div className="flex items-center justify-center flex-1">
          <span className="mr-2">😊</span>
          <span className="font-medium text-xs sm:text-sm md:text-base">Get 78% off on the annual plan</span>
        </div>
        <div className="flex items-center justify-end flex-1">
          
        </div>
      </div>

      {/* Navigation */}
      <header className="bg-white py-3 md:py-4 px-4 md:px-6 border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image src="/getmoreseo.png" alt="Logo" width={132} height={132} className="mr-2" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <a href="#howitworks" className="px-3 py-2 text-gray-700 hover:text-gray-900 text-sm">
              How It Works
            </a>
            <a href="#features" className="px-3 py-2 text-gray-700 hover:text-gray-900 text-sm">
              Features
            </a>
            <a href="#content" className="px-3 py-2 text-gray-700 hover:text-gray-900 text-sm">
              Content
            </a>
            <a href="#comparison" className="px-3 py-2 text-gray-700 hover:text-gray-900 text-sm">
              Comparison
            </a>
            <a href="#pricing" className="px-3 py-2 text-gray-700 hover:text-gray-900 text-sm">
              Pricing
            </a>
            <a href="#faq" className="px-3 py-2 text-gray-700 hover:text-gray-900 text-sm">
              FAQ
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-[#294df6] hover:text-[#1e3fd0] font-medium text-sm">
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-[#294df6] hover:bg-[#1e3fd0] text-white px-3 md:px-4 py-2 rounded-md font-medium text-sm whitespace-nowrap"
            >
              Start For Free Today
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow bg-gradient-to-br from-[#f0f3ff] via-white to-[#e6ebff]">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 lg:py-24">
          {/* Text Content */}
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6">
              <span className="text-gray-800">AI</span> <span className="text-[#294df6]">SEO Writer</span>{" "}
              <span className="text-gray-800">that</span> <br className="hidden sm:block" />
              <span className="text-[#294df6]">Auto-Publishes</span> <br className="hidden sm:block" />
              <span className="text-gray-800">to your Blog</span>
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-6 md:mb-8">
              Generate, publish, syndicate and update articles automatically.
            </p>

            <div className="flex flex-col sm:flex-row mb-6 md:mb-8 w-full max-w-md mx-auto">
              <div className="relative flex-grow mb-3 sm:mb-0 sm:mr-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-3 md:px-4 py-2 md:py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#294df6] focus:border-transparent text-sm"
                />
              </div>
              <Link href="/signup" className="bg-[#294df6] hover:bg-[#1e3fd0] text-white px-4 md:px-6 py-2 md:py-3 rounded-md font-medium text-sm whitespace-nowrap">
                Start For Free Today
              </Link>
            </div>

            <div className="mb-6 md:mb-8">
              <div className="flex items-center justify-center">
                <div className="flex -space-x-2">
                  {[1].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white overflow-hidden bg-gray-300"
                    >
                      <Image src={`/abc3.jpg`} alt={`User ${i}`} width={32} height={32} />
                      <Image src={`/abc3.jpg`} alt={`User ${i}`} width={32} height={32} />

                    </div>
                  ))}
                </div>
                <span className="ml-2 md:ml-3 text-gray-700 font-medium text-xs sm:text-sm">
                  Join 25,260+ business owners
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 text-xs sm:text-sm justify-center">
              <div className="flex items-center">
                <div className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2 text-[#294df6]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-credit-card"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                    <line x1="2" x2="22" y1="10" y2="10"></line>
                  </svg>
                </div>
                <span className="text-gray-700">Start For Free</span>
              </div>

              <div className="flex items-center">
                <div className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2 text-[#294df6]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-clock"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <span className="text-gray-700">Articles in 30 secs</span>
              </div>

              <div className="flex items-center">
                <div className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2 text-[#294df6]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shield-check"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <span className="text-gray-700">Plagiarism Free</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

