import { ArrowRight } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#294df6] to-[#3e5df8] rounded-xl border border-[#294df6]/50 p-8 md:p-12 text-white text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Animated Circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white opacity-10 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-white opacity-10 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              GetMoreSEO solves this by automating your entire blogging workflow
            </h3>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Delivering professional content that drives organic traffic without the traditional headaches.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#294df6] hover:bg-white/90 px-8 py-4 rounded-md font-medium text-base whitespace-nowrap transition-all duration-200 flex items-center justify-center border border-white/50 hover:scale-105 transform">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-md font-medium text-base whitespace-nowrap transition-all duration-200 hover:scale-105 transform">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
