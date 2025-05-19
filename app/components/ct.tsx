import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BlogCTA() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#294fd6] to-[#3e5df8] rounded-xl border border-gray-200 p-8 md:p-12 text-white text-center relative overflow-hidden">
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
              <Link
                href="/signup"
                className="bg-white text-[#294fd6] hover:bg-white/90 px-8 py-4 rounded-md font-medium text-base whitespace-nowrap transition-all duration-200 flex items-center justify-center border border-white/50 hover:scale-105 transform"
              >
                Get one Article for Free 
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href='#howitworks' className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-md font-medium text-base whitespace-nowrap transition-all duration-200 hover:scale-105 transform">
                See How It Works
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
