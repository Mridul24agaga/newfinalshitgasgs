"use client"

import React from "react"
import Image from "next/image"

const SearchBar = () => {
  return (
    <div className="flex flex-row items-center gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-full max-w-xl mx-auto lg:mx-0">
      <div className="flex-1 px-4 py-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-500"
        />
      </div>
      <button className="px-6 py-3 bg-mint hover:bg-opacity-90 text-gray-900 rounded-full transition-colors font-medium whitespace-nowrap">
        Search
      </button>
    </div>
  )
}

export function Hero() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#1A1257] via-[#2B3582] to-[#0066FF]">
      {/* Add subtle star effect */}
      <div className="absolute inset-0 bg-[url('/stars.png')] opacity-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-3">
              <h1 className="space-y-2">
                <span className="text-mint leading-none block text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                  AI Blog Writer
                </span>
                <span className="text-white leading-none block text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Skyrocket Your Traffic
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-white/80 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                Hands-Free Blogging to Boost Traffic: AI Generates High-Quality Articles That Convert Visitors to
                Customers
              </p>
            </div>

            <div className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-full max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center flex-1 px-4 py-2">
                <span className="text-white/60 mr-2 whitespace-nowrap text-sm">Write about</span>
                <input
                  type="text"
                  placeholder="How to buy a house"
                  className="w-full bg-transparent border-0 text-white placeholder:text-white/40 focus:outline-none focus:ring-0 text-sm"
                />
              </div>
              <button className="px-6 py-3 bg-mint hover:bg-opacity-90 text-gray-900 rounded-full transition-colors font-medium whitespace-nowrap">
                Generate
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white text-sm sm:text-base">4.8/5 based on 1000+ reviews</span>
              </div>

              <div className="hidden sm:flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full">
                  <div className="w-5 h-5 rounded-full bg-mint/20 flex items-center justify-center">
                    <span className="text-mint text-sm">✓</span>
                  </div>
                  <span className="text-white font-light">7-day Free Trial</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full">
                  <div className="w-5 h-5 rounded-full bg-mint/20 flex items-center justify-center">
                    <span className="text-mint text-sm">✓</span>
                  </div>
                  <span className="text-white font-light">No credit card required</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full">
                  <div className="w-5 h-5 rounded-full bg-mint/20 flex items-center justify-center">
                    <span className="text-mint text-sm">✓</span>
                  </div>
                  <span className="text-white font-light">Full Access</span>
                </div>
              </div>

              {/* Mobile features list */}
              <div className="sm:hidden flex items-center justify-center gap-2 text-sm text-white/80">
                <span>7-day Free Trial</span>
                <span>•</span>
                <span>No credit card required</span>
                <span>•</span>
                <span>Full Access</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <Image src="/dashboard.png" alt="Blog Writer Dashboard" width={800} height={600} className="rounded-lg" />

            

            <div className="absolute top-1/2 -right-4 bg-white rounded-lg p-4 shadow-xl">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">97</div>
                <div className="text-sm text-gray-600">Blog Post Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile dashboard preview */}
        <div className="mt-8 lg:hidden">
          <Image
            src="/dashboard.png"
            alt="Blog Writer Dashboard"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl mx-auto"
          />
        </div>
      </div>
    </div>
  )
}

export default SearchBar

