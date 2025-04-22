"use client"

import { useState, useRef, useEffect } from "react"
import { CheckCircle, ArrowRight, Play, ChevronRight } from "lucide-react"
import Image from "next/image"

const steps = [
  {
    number: 1,
    id: "website-analysis",
    label: "Website Analysis",
    title: "Enter Your Website URL",
    description:
      "Simply enter your website URL and wait a few seconds while our AI analyzes your content. We'll generate a comprehensive summary of what your website does and identify key opportunities.",
    features: [
      {
        title: "Instant Website Scanning",
        description:
          "Our advanced AI scans your entire website in seconds, analyzing content, structure, and key information.",
      },
      {
        title: "Comprehensive Summary Generation",
        description:
          "Receive a detailed summary of what your website does, your business model, and your unique value proposition.",
      },
    ],
    videoSrc: "/video1.mp4",
    stats: {
      time: "30 seconds",
      accuracy: "98%",
    },
  },
  {
    number: 2,
    id: "icp-generation",
    label: "ICP Generation",
    title: "Generate Your Ideal Customer Profile",
    description:
      "Based on your website analysis, we automatically create your Ideal Customer Profile (ICP), identifying exactly who your perfect customers are and what they're looking for.",
    features: [
      {
        title: "AI-Powered Customer Analysis",
        description:
          "Our AI identifies your ideal customers based on your website content, industry, and business model.",
      },
      {
        title: "Detailed Persona Creation",
        description:
          "Get comprehensive profiles of your ideal customers including demographics, pain points, and buying behaviors.",
      },
    ],
    videoSrc: "/video2.mp4",
    stats: {
      profiles: "5+",
      insights: "25+",
    },
  },
  {
    number: 3,
    id: "blog-generation",
    label: "Blog Generation & Payment",
    title: "Generate Targeted Content & Complete Payment",
    description:
      "Our AI creates high-converting blog content specifically designed to attract your ideal customers. Choose your plan and complete payment to start publishing immediately.",
    features: [
      {
        title: "AI Content Creation",
        description: "Generate SEO-optimized blog posts tailored to your ICP's interests and search behaviors.",
      },
      {
        title: "Flexible Payment Options",
        description:
          "Choose from various plans to suit your content needs and budget with secure, hassle-free payment processing.",
      },
    ],
    videoSrc: "/video3.mp4",
    stats: {
      articles: "Unlimited",
      publishing: "Instant",
    },
  },
]

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0)
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([])
  const [isPlaying, setIsPlaying] = useState<boolean[]>(steps.map(() => false))
  const stepRefs = useRef<Array<HTMLDivElement | null>>([])
  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  // Initialize refs
  useEffect(() => {
    videoRefs.current = videoRefs.current.slice(0, steps.length)
    stepRefs.current = stepRefs.current.slice(0, steps.length)
  }, [])

  // Add a new useEffect to handle video autoplay when a step becomes active
  useEffect(() => {
    // Autoplay the video when a step becomes active
    const currentVideo = videoRefs.current[activeStep]
    if (currentVideo && currentVideo.paused) {
      // Add a small delay to make the transition smoother
      setTimeout(() => {
        currentVideo
          .play()
          .then(() => {
            setIsPlaying((prev) => {
              const newState = [...prev]
              newState[activeStep] = true
              return newState
            })
          })
          .catch((error) => {
            console.log("Autoplay prevented:", error)
            // Keep the play button visible if autoplay is prevented
          })
      }, 300)
    }

    // Pause other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== activeStep && !video.paused) {
        video.pause()
        setIsPlaying((prev) => {
          const newState = [...prev]
          newState[index] = false
          return newState
        })
      }
    })
  }, [activeStep])

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Determine active step based on scroll position
      stepRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()
          // If the step is in the viewport (with some offset)
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveStep(index)
          }
        }
      })
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleVideo = (index: number) => {
    const video = videoRefs.current[index]
    if (!video) return

    if (video.paused) {
      video.play()
      setIsPlaying((prev) => {
        const newState = [...prev]
        newState[index] = true
        return newState
      })
    } else {
      video.pause()
      setIsPlaying((prev) => {
        const newState = [...prev]
        newState[index] = false
        return newState
      })
    }
  }

  const scrollToStep = (index: number) => {
    setActiveStep(index)
    const stepElement = stepRefs.current[index]
    if (stepElement) {
      const yOffset = -100 // Adjust based on your sticky header height
      const y = stepElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  return (
    <section
      ref={(el) => {
        sectionRef.current = el
      }}
      id="howitworks"
      className="py-20 md:py-32 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white"></div>

      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          className="absolute top-40 right-0 w-96 h-96 bg-[#294df6]/5 rounded-full blur-3xl"
          style={{
            transform: `translate(${scrollY * 0.05}px, ${scrollY * -0.02}px)`,
            opacity: 0.7 - (scrollY * 0.0005 > 0.3 ? 0.3 : scrollY * 0.0005),
          }}
        ></div>
        <div
          className="absolute bottom-40 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          style={{
            transform: `translate(${scrollY * -0.05}px, ${scrollY * 0.02}px)`,
            opacity: 0.7 - (scrollY * 0.0005 > 0.3 ? 0.3 : scrollY * 0.0005),
          }}
        ></div>

        {/* Floating particles */}
        <div
          className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#294df6]/20 rounded-full"
          style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * -0.1}px)` }}
        ></div>
        <div
          className="absolute top-3/4 right-1/4 w-6 h-6 bg-purple-500/20 rounded-full"
          style={{ transform: `translate(${scrollY * -0.15}px, ${scrollY * 0.05}px)` }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-3 h-3 bg-blue-300/30 rounded-full"
          style={{ transform: `translate(${scrollY * 0.2}px, ${scrollY * 0.1}px)` }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#294df6]/10 rounded-full px-4 py-1.5 mb-6 text-sm text-[#294df6] font-medium">
            <span className="mr-2">🚀</span>
            SIMPLE PROCESS
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            How It <span className="text-[#294df6]">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform makes it easy to create, publish, and optimize content that ranks.
          </p>
        </div>

        {/* Steps with Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div
            className="absolute left-[24px] top-[60px] bottom-20 w-[3px] bg-gradient-to-b from-[#294df6]/20 via-[#294df6] to-[#294df6]/20 hidden md:block"
            style={{
              backgroundSize: "100% 300%",
              backgroundPosition: `0% ${activeStep * 50}%`,
            }}
          ></div>

          <div className="space-y-32">
            {steps.map((step, index) => (
              <div
                key={step.id}
                ref={(el) => {
                  stepRefs.current[index] = el
                }}
                className={`relative transition-all duration-700 ${
                  Math.abs(activeStep - index) <= 1 ? "opacity-100" : "opacity-50"
                }`}
                style={{
                  transform: `translateY(${(activeStep - index) * 20}px)`,
                }}
              >
                {/* Step Indicator */}
                <div className="flex items-center mb-8">
                  <div
                    className={`text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10 shadow-lg transition-all duration-500 ${
                      activeStep === index ? "bg-[#294df6] scale-110" : "bg-gray-400"
                    }`}
                  >
                    {step.number}
                  </div>
                  <div className="ml-4">
                    <div
                      className={`font-bold text-lg transition-colors duration-300 ${
                        activeStep === index ? "text-[#294df6]" : "text-gray-700"
                      }`}
                    >
                      {step.label}
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="ml-0 md:ml-16">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="order-2 md:order-1">
                      <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{step.title}</h3>
                      <p className="text-gray-600 mb-8 text-lg">{step.description}</p>

                      <div className="space-y-6 mb-8">
                        {step.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex gap-4 group"
                            style={{
                              transform: activeStep === index ? "translateX(0)" : "translateX(-20px)",
                              opacity: activeStep === index ? 1 : 0.7,
                              transition: `transform 0.5s ease ${featureIndex * 0.1}s, opacity 0.5s ease ${featureIndex * 0.1}s`,
                            }}
                          >
                            <div className="mt-1">
                              <div className="w-8 h-8 rounded-full bg-[#294df6]/10 flex items-center justify-center group-hover:bg-[#294df6]/20 transition-colors duration-300">
                                <CheckCircle className="h-5 w-5 text-[#294df6]" />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-[#294df6] transition-colors duration-300">
                                {feature.title}
                              </h4>
                              <p className="text-gray-600">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div
                        className="grid grid-cols-2 gap-4 mb-8"
                        style={{
                          transform: activeStep === index ? "translateY(0)" : "translateY(20px)",
                          opacity: activeStep === index ? 1 : 0.7,
                          transition: "transform 0.5s ease 0.2s, opacity 0.5s ease 0.2s",
                        }}
                      >
                        {step.stats &&
                          Object.entries(step.stats).map(([key, value]) => (
                            <div
                              key={key}
                              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                              <div className="text-sm text-gray-500 capitalize">{key}</div>
                              <div className="text-xl font-bold text-[#294df6]">{value}</div>
                            </div>
                          ))}
                      </div>

                      {/* Next Step Button */}
                      {index < steps.length - 1 && (
                        <button
                          onClick={() => scrollToStep(index + 1)}
                          className="inline-flex items-center text-[#294df6] font-medium hover:text-[#1e3ed0] transition-colors"
                        >
                          Next: {steps[index + 1].label}
                          <ChevronRight className="ml-1 h-5 w-5" />
                        </button>
                      )}
                    </div>

                    {/* Video */}
                    <div
                      className="order-1 md:order-2"
                      style={{
                        transform:
                          activeStep === index ? "translateX(0) rotate(0deg)" : "translateX(20px) rotate(1deg)",
                        opacity: activeStep === index ? 1 : 0.7,
                        transition: "transform 0.5s ease, opacity 0.5s ease",
                      }}
                    >
                      <div className="relative group">
                        <div
                          className="absolute -inset-1 bg-gradient-to-r from-[#294df6] to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"
                          style={{
                            transform: `rotate(${scrollY * 0.01}deg)`,
                          }}
                        ></div>
                        <div className="relative bg-white rounded-xl overflow-hidden shadow-xl">
                          <div className="relative aspect-video overflow-hidden">
                            <video
                              ref={(el) => {
                                videoRefs.current[index] = el
                              }}
                              src={step.videoSrc || "/placeholder-video.mp4"}
                              loop
                              muted
                              playsInline
                              autoPlay={activeStep === index}
                              className="w-full h-full object-cover"
                              onPlay={() => {
                                setIsPlaying((prev) => {
                                  const newState = [...prev]
                                  newState[index] = true
                                  return newState
                                })
                              }}
                              onPause={() => {
                                setIsPlaying((prev) => {
                                  const newState = [...prev]
                                  newState[index] = false
                                  return newState
                                })
                              }}
                            />

                            {/* Play Button Overlay */}
                            <div
                              className={`absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
                                isPlaying[index] ? "opacity-0 pointer-events-none" : "opacity-100"
                              }`}
                              onClick={() => toggleVideo(index)}
                            >
                              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg transform transition hover:scale-105">
                                <Play className="h-6 w-6 text-[#294df6] ml-1" fill="#294df6" />
                              </div>
                            </div>
                          </div>

                          {/* Video Caption */}
                          <div className="p-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-medium text-gray-900">{step.label}</div>
                              <button
                                onClick={() => toggleVideo(index)}
                                className="text-xs text-[#294df6] hover:text-[#1e3ed0]"
                              >
                                {isPlaying[index] ? "Playing" : "Play Demo"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Screenshot Previews */}
                      <div className="flex justify-center mt-6 space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              i === 1 ? "w-8 bg-[#294df6]" : "bg-gray-300"
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center">
          <div
            className="bg-gradient-to-r from-[#294df6]/10 to-purple-500/10 rounded-2xl p-10 md:p-16 max-w-4xl mx-auto"
            style={{
              transform: `translateY(${Math.max(0, 100 - scrollY * 0.1)}px)`,
              opacity: Math.min(1, scrollY * 0.001),
            }}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of content creators who are already using our platform to create SEO-optimized content that
              ranks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#294df6] hover:bg-[#1e3fd0] text-white px-8 py-4 rounded-xl font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#294df6]/20 flex items-center justify-center">
                Start for Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-medium text-lg border border-gray-200 transition-all duration-300 hover:shadow-lg flex items-center justify-center">
                Watch Demo
                <Play className="ml-2 h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center">
              <div className="flex -space-x-3 mr-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <Image
                      src={`/user-${i}.jpg`}
                      alt={`User ${i}`}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-gray-600">
                <span className="font-bold text-gray-900">25,260+</span> content creators trust us
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
