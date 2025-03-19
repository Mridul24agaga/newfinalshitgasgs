"use client"

import { useEffect, useRef } from "react"

export default function ScrollingResults() {
  const scrollLeftRef = useRef<HTMLDivElement>(null)
  const scrollRightRef = useRef<HTMLDivElement>(null)

  // The specific image to use
  const resultImage = "/scrolling.png"

  useEffect(() => {
    const scrollLeftContainer = scrollLeftRef.current
    const scrollRightContainer = scrollRightRef.current

    if (!scrollLeftContainer || !scrollRightContainer) return

    // Clone the content for infinite scrolling
    const cloneLeftContent = () => {
      const items = scrollLeftContainer.querySelectorAll(".scroll-item")
      items.forEach((item) => {
        const clone = item.cloneNode(true)
        scrollLeftContainer.appendChild(clone)
      })
    }

    const cloneRightContent = () => {
      const items = scrollRightContainer.querySelectorAll(".scroll-item")
      items.forEach((item) => {
        const clone = item.cloneNode(true)
        scrollRightContainer.appendChild(clone)
      })
    }

    cloneLeftContent()
    cloneRightContent()

    // Set up the animation
    const leftSpeed = 0.5
    const rightSpeed = 0.4 // Slightly different speed for more natural look

    let leftAnimationId: number
    let rightAnimationId: number

    const animateLeft = () => {
      if (!scrollLeftContainer) return

      scrollLeftContainer.scrollLeft += leftSpeed

      // Reset scroll position when we've scrolled through the first set of items
      const firstItemWidth = scrollLeftContainer.querySelector(".scroll-item")?.clientWidth || 0
      const gap = 16 // gap-4 = 16px

      if (scrollLeftContainer.scrollLeft >= firstItemWidth + gap) {
        scrollLeftContainer.scrollLeft -= firstItemWidth + gap
      }

      leftAnimationId = requestAnimationFrame(animateLeft)
    }

    const animateRight = () => {
      if (!scrollRightContainer) return

      scrollRightContainer.scrollLeft -= rightSpeed

      // Reset scroll position when we've scrolled through the first set of items
      const firstItemWidth = scrollRightContainer.querySelector(".scroll-item")?.clientWidth || 0
      const gap = 16 // gap-4 = 16px

      if (scrollRightContainer.scrollLeft <= 0) {
        scrollRightContainer.scrollLeft += firstItemWidth + gap
      }

      rightAnimationId = requestAnimationFrame(animateRight)
    }

    leftAnimationId = requestAnimationFrame(animateLeft)
    rightAnimationId = requestAnimationFrame(animateRight)

    return () => {
      cancelAnimationFrame(leftAnimationId)
      cancelAnimationFrame(rightAnimationId)
    }
  }, [])

  return (
    <section className="w-full py-12 bg-[#f8f9fa] font-['Saira',sans-serif] overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="border border-[#fd921c] text-black text-sm font-medium px-8 py-2 rounded-full mb-4">
            Client Results
          </div>
          <h2 className="text-3xl font-bold text-black mb-2">Our Success Stories</h2>
          <p className="text-gray-600 text-sm max-w-2xl mx-auto">
            Real results from real clients. See how our content strategy drives measurable growth.
          </p>
        </div>

        {/* First row - scrolling left */}
        <div className="relative overflow-hidden mb-4">
          <div
            ref={scrollLeftRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[...Array(3)].map((_, index) => (
              <div
                key={`left-${index}`}
                className="scroll-item min-w-[250px] md:min-w-[300px] lg:min-w-[350px] rounded-xl overflow-hidden shadow-sm flex-shrink-0"
              >
                <img
                  src={resultImage || "/placeholder.svg"}
                  alt={`Client result ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Second row - scrolling right */}
        <div className="relative overflow-hidden">
          <div
            ref={scrollRightRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[...Array(3)].map((_, index) => (
              <div
                key={`right-${index}`}
                className="scroll-item min-w-[250px] md:min-w-[300px] lg:min-w-[350px] rounded-xl overflow-hidden shadow-sm flex-shrink-0"
              >
                <img
                  src={resultImage || "/placeholder.svg"}
                  alt={`Client result ${index + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

