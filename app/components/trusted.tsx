"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { PenLine, BarChart3, DollarSign } from "lucide-react"

export default function TrustedBySection() {
  const logoContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollLogos = () => {
      if (logoContainerRef.current) {
        const container = logoContainerRef.current

        // If we've scrolled to the end, reset to start
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth) {
          container.scrollTo({ left: 0, behavior: "auto" })
        } else {
          // Otherwise, scroll a bit more
          container.scrollBy({ left: 1, behavior: "auto" })
        }
      }
    }

    // Set up the animation interval
    const interval = setInterval(scrollLogos, 30)

    // Clean up on unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="w-full py-16 md:py-24">
      <div className="container px-4 md:px-6 mx-auto max-w-6xl">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-8">
          Trusted by <span className="text-[#294fd6]">industry-leading</span> companies
        </h2>

        <div className="rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-[0_0_30px_rgba(41,79,214,0.1)]">
          {/* Logos Section */}
          <div className="border-b border-gray-200 py-8 overflow-hidden">
            <div
              ref={logoContainerRef}
              className="flex items-center justify-center gap-16 px-6 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* Duplicate logos to create infinite scroll effect */}
              {[...Array(2)].map((_, dupeIndex) => (
                <div key={dupeIndex} className="flex items-center gap-16 min-w-max">
                  <div className="h-10 w-36 relative flex items-center justify-center">
                    <div className="w-full h-full relative">
                      <Image
                        src="/d2c1.avif"
                        alt="Company 1"
                        fill
                        sizes="(max-width: 768px) 100vw, 144px"
                        className="object-contain"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                  <div className="h-10 w-36 relative flex items-center justify-center">
                    <div className="w-full h-full relative">
                      <Image
                        src="/d2c2.png"
                        alt="Company 2"
                        fill
                        sizes="(max-width: 768px) 100vw, 144px"
                        className="object-contain"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                  <div className="h-10 w-36 relative flex items-center justify-center">
                    <div className="w-full h-full relative">
                      <Image
                        src="/saas1.webp"
                        alt="Company 3"
                        fill
                        sizes="(max-width: 768px) 100vw, 144px"
                        className="object-contain"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                  <div className="h-10 w-36 relative flex items-center justify-center">
                    <div className="w-full h-full relative">
                      <Image
                        src="/skillop-logo.png"
                        alt="Company 4"
                        fill
                        sizes="(max-width: 768px) 100vw, 144px"
                        className="object-contain"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>

                  <div className="h-10 w-36 relative flex items-center justify-center">
                    <div className="w-full h-full relative">
                      <Image
                        src="/markupx.png"
                        alt="Company 6"
                        fill
                        sizes="(max-width: 768px) 100vw, 144px"
                        className="object-contain"
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-[#294fd6]/10 rounded-full flex items-center justify-center">
                  <PenLine className="h-6 w-6 text-[#294fd6]" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Total Articles Written</p>
              <p className="text-4xl md:text-5xl font-bold text-gray-800">26,850</p>
            </div>

            <div className="p-8 text-center border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-[#294fd6]/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-[#294fd6]" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Total Organic Impressions</p>
              <p className="text-4xl md:text-5xl font-bold text-gray-800">151.4M</p>
            </div>

            <div className="p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-[#294fd6]/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-[#294fd6]" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">Total Revenue Driven by Articles</p>
              <p className="text-4xl md:text-5xl font-bold text-gray-800">$13.03M</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
