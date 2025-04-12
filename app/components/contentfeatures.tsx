"use client"

import { useState } from "react"
import { Code, ImageIcon, Video, LinkIcon, Sparkles, ArrowRight, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function ContentFeaturesSection() {
  const [activeTab, setActiveTab] = useState("images")

  const tabs = [
    { id: "formatting", label: "Formatting", icon: <Code className="w-5 h-5" /> },
    { id: "images", label: "AI Images", icon: <ImageIcon className="w-5 h-5" /> },
    { id: "videos", label: "YouTube Videos", icon: <Video className="w-5 h-5" /> },
    { id: "links", label: "Smart Links", icon: <LinkIcon className="w-5 h-5" /> },
  ]

  const tabContent = {
    formatting: {
      title: "Content Formatting",
      description:
        "Our AI structures your content with semantic HTML and proper markdown. Get perfectly formatted headings, paragraphs, code blocks, and bullet points that improve readability and SEO.",
      codeSnippet: `// Content formatting example
article.format({
  headings: true,
  codeBlocks: true,
  bulletPoints: true,
  quotes: true,
  tables: true
});`,
      image: "/placeholder.svg?height=400&width=500",
      imageAlt: "Example of professionally formatted content",
    },
    images: {
      title: "AI-Generated Images",
      description:
        "Every article includes stunning AI-generated images that enhance your content. Our system automatically creates featured images and in-article visuals that perfectly match your content.",
      codeSnippet: `// AI image generation
const images = await article.generateImages({
  featured: true,
  inlineImages: 3,
  style: "professional",
  relevance: 0.95
});`,
      image: "/placeholder.svg?height=400&width=500",
      imageAlt: "AI-generated images for blog content",
    },
    videos: {
      title: "YouTube Video Embeds",
      description:
        "Boost engagement with relevant YouTube videos embedded within your articles. Our AI finds and places videos that complement your written content.",
      codeSnippet: `// YouTube video embedding
const videos = await article.findVideos({
  relevance: "high",
  maxCount: 2,
  position: "after-paragraph",
  autoplay: false
});`,
      image: "/placeholder.svg?height=400&width=500",
      imageAlt: "Example of embedded video content",
    },
    links: {
      title: "Smart Linking System",
      description:
        "Our system automatically adds relevant internal links to your other content and authoritative external links to boost your SEO and provide additional value to readers.",
      codeSnippet: `// Smart linking system
article.addLinks({
  internal: {
    count: 3,
    relevanceThreshold: 0.8
  },
  external: {
    count: 2,
    authorityScore: "high",
    nofollow: false
  }
});`,
      image: "/placeholder.svg?height=400&width=500",
      imageAlt: "Example of smart linking structure",
    },
  }

  const content = tabContent[activeTab as keyof typeof tabContent]

  return (
    <>
      <section className="py-16 bg-white font-inter">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-gray-100 px-3 py-1 rounded-md text-[#294df6] text-sm mb-3">
              import &#123; ContentFeatures &#125; from "getmoreseo"
            </div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">What Does It Include</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              GetMoreSEO doesn't just write text - it creates fully-featured content ready to publish and rank.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <div className="inline-flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2.5 rounded-md text-sm transition-colors ${
                    activeTab === tab.id ? "bg-[#294df6] text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left side - Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-6 h-6 text-[#294df6] mr-3" />
                  <h3 className="text-2xl font-semibold text-gray-900">{content.title}</h3>
                </div>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{content.description}</p>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm">
                  <div className="flex items-center mb-2">
                    <div className="flex space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                    <div className="ml-2 text-gray-500 text-xs">script.js</div>
                  </div>
                  <pre className="text-[#294df6] overflow-x-auto font-mono">{content.codeSnippet}</pre>
                </div>

                <button className="mt-6 inline-flex items-center text-[#294df6] font-medium">
                  View documentation
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </button>
              </div>

              {/* Right side - Preview */}
              <div className="relative">
                {/* Browser mockup */}
                <div className="h-full bg-gray-50 p-6 flex items-center justify-center">
                  <div className="w-full max-w-md bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden">
                    {/* Browser chrome */}
                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
                      <div className="flex space-x-1.5 mr-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                      </div>
                      <div className="flex-1 bg-white rounded-full h-6 flex items-center justify-center text-xs text-gray-600 px-3 border border-gray-200">
                        https://yourblog.com/article
                      </div>
                    </div>

                    {/* Content preview */}
                    <div className="p-4">
                      {activeTab === "images" && (
                        <>
                          <div className="mb-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                              Maintaining Momentum: Scaling Your Amazon Business
                            </h4>
                            <div className="w-full h-48 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                              <Image
                                src={content.image || "/placeholder.svg"}
                                alt={content.imageAlt}
                                width={500}
                                height={300}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-4/6"></div>
                            </div>
                          </div>

                          <div className="mt-6">
                            <div className="h-4 bg-gray-200 rounded-full w-1/3 mb-3"></div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="h-16 bg-gray-100 rounded-lg"></div>
                              <div className="h-16 bg-gray-100 rounded-lg"></div>
                              <div className="h-16 bg-gray-100 rounded-lg"></div>
                            </div>
                            <div className="space-y-2 mt-3">
                              <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "videos" && (
                        <>
                          <div className="mb-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                              Maintaining Momentum: Scaling Your Amazon Business
                            </h4>
                            <div className="space-y-2 mb-4">
                              <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-4/6"></div>
                            </div>

                            <div className="w-full h-48 bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="white"
                                  >
                                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                  </svg>
                                </div>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gray-600 rounded-full mr-2"></div>
                                  <div>
                                    <div className="h-2 bg-gray-500 rounded-full w-32 mb-1"></div>
                                    <div className="h-2 bg-gray-600 rounded-full w-20"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2 mt-3">
                            <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                          </div>
                        </>
                      )}

                      {activeTab === "links" && (
                        <>
                          <div className="mb-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                              Maintaining Momentum: Scaling Your Amazon Business
                            </h4>
                            <div className="space-y-3 mb-4">
                              <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                              <div className="h-3 bg-[#294df6] rounded-full w-1/3"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-4/6"></div>
                              <div className="h-3 bg-[#294df6] rounded-full w-2/5"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                            </div>

                            <div className="bg-gray-50 rounded p-3 border border-gray-200 mb-4">
                              <div className="text-xs text-gray-500 mb-1">Related Articles:</div>
                              <div className="space-y-2">
                                <div className="h-3 bg-[#294df6] rounded-full w-4/5"></div>
                                <div className="h-3 bg-[#294df6] rounded-full w-3/4"></div>
                                <div className="h-3 bg-[#294df6] rounded-full w-4/6"></div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {activeTab === "formatting" && (
                        <>
                          <div className="mb-4">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                              Maintaining Momentum: Scaling Your Amazon Business
                            </h4>
                            <div className="space-y-2 mb-4">
                              <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                            </div>

                            <div className="mb-3">
                              <div className="h-4 bg-gray-300 rounded-full w-1/3 mb-2"></div>
                              <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded-full w-full"></div>
                                <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded p-3 border border-gray-200 mb-3 text-xs text-gray-600">
                              <div className="text-[#294df6]">// Code example</div>
                              <div>const amazonAPI = new AmazonAPI(credentials);</div>
                              <div>const products = await amazonAPI.getProducts();</div>
                            </div>

                            <div className="flex mb-3">
                              <div className="w-1 h-3 bg-gray-400 rounded-full mr-2 mt-1"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-5/6"></div>
                            </div>
                            <div className="flex mb-3">
                              <div className="w-1 h-3 bg-gray-400 rounded-full mr-2 mt-1"></div>
                              <div className="h-3 bg-gray-200 rounded-full w-4/6"></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Floating info box */}
                {activeTab === "images" && (
                  <div className="absolute top-8 right-8 bg-white text-gray-800 p-4 rounded-lg shadow-lg max-w-xs text-sm z-10 border border-gray-200">
                    <div className="text-[#294df6] mb-1">// Feature</div>
                    <p className="text-gray-600">
                      All articles include a featured-image and in-article images in relevant paragraphs. AI generates
                      custom visuals for each piece of content.
                    </p>
                  </div>
                )}

                {activeTab === "videos" && (
                  <div className="absolute top-8 right-8 bg-white text-gray-800 p-4 rounded-lg shadow-lg max-w-xs text-sm z-10 border border-gray-200">
                    <div className="text-[#294df6] mb-1">// Feature</div>
                    <p className="text-gray-600">
                      Automatically embeds relevant YouTube videos that complement your content, increasing engagement
                      and time on page.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#294df6] font-inter">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to create content that ranks?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using GetMoreSEO to create high-quality, SEO-optimized content at scale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-started"
              className="bg-white hover:bg-gray-100 text-[#294df6] px-8 py-4 rounded-lg font-medium inline-flex items-center justify-center transition-colors duration-200 shadow-md text-lg"
            >
              Start your free trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>

            <Link
              href="/demo"
              className="bg-transparent hover:bg-[#1a3ad8] text-white border border-white px-8 py-4 rounded-lg font-medium inline-flex items-center justify-center transition-colors duration-200 shadow-sm text-lg"
            >
              Schedule a demo
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-8">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-1 flex items-center justify-center mr-2">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="text-white">7-day free trial</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-1 flex items-center justify-center mr-2">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="text-white">No credit card required</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-1 flex items-center justify-center mr-2">
                <Check className="h-4 w-4 text-white" />
              </div>
              <span className="text-white">Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
