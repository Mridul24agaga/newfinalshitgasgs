"use client"

import Image from "next/image"

export function ProblemSolution() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Headings Section */}
      <div className="mb-16 relative max-w-2xl mx-auto text-center">
        <div className="relative inline-block">
          <img
            src="arrow.png"
            alt="Arrow"
            className="absolute -top-12 -left-16 w-16 h-16"
          />
          <h2 className="text-4xl md:text-5xl font-bold mb-2">Your problem</h2>
        </div>
        <div className="relative inline-block">
          <h2 className="text-4xl md:text-5xl font-bold">Our solution</h2>
          <img
            src="arrow.png"
            alt="Arrow"
            className="absolute -right-20 -bottom-8 w-16 h-16 transform rotate-180"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-16">
        {/* Problems Column */}
        <div className="w-full md:w-[45%] space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="User avatar"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex-grow">
              <p className="text-[17px] text-gray-800 leading-snug">
                "I'm tired of spending hours writing blogs that don't rank."
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="User avatar"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex-grow">
              <p className="text-[17px] text-gray-800 leading-snug">
                "AI-generated content feels robotic and lacks personality."
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="User avatar"
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex-grow">
              <p className="text-[17px] text-gray-800 leading-snug">
                "Most content agencies don't understand my industry."
              </p>
            </div>
          </div>
        </div>

        {/* Solutions Column */}
        <div className="w-full md:w-[55%]">
          <div className="bg-[#FF7733] rounded-[32px] p-8">
            <div className="mb-8">
              <Image
                src="/logo.png"
                alt="blogosocial logo"
                width={150}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#FF7733]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white text-[17px] leading-snug">
                  Our 5-layer system creates SEO blogs that rank in 120 days.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#FF7733]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white text-[17px] leading-snug">
                  AI efficiency + human creativity = content that stands out.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#FF7733]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white text-[17px] leading-snug">
                  We craft data-driven content that speaks your audience's language.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-[#FF7733]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white text-[17px] leading-snug">
                  Our system ensures every blog is optimized for search and conversions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
        <button className="px-6 py-3 bg-white text-gray-800 rounded-full border-2 border-[#FF7733] hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium">
          See How it Works
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transform translate-y-[1px]"
          >
            <path
              d="M4.16666 10H15.8333"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 4.16666L15.8333 10L10 15.8333"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button className="px-6 py-3 bg-[#FF7733] text-white rounded-full hover:bg-[#FF6620] transition-colors font-medium">
          Outrank Competitors
        </button>
      </div>
    </div>
  )
}

