"use client"

import { Button } from "./Button"

const features = [
  {
    title: "AI-Powered Keyword Research",
    description: "Discover high-impact keywords with our advanced AI algorithms.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
      >
        <path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    ),
    bgColor: "bg-[#FFFFCB]",
    cardBg: "bg-[#FFFFCB]/30",
  },
  {
    title: "Smart Content Optimizer",
    description: "Enhance your content's SEO performance with AI-driven suggestions.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
    bgColor: "bg-[#FFF0E3]",
    cardBg: "bg-[#FFF0E3]/30",
  },
  {
    title: "Real-Time Rank Tracker",
    description: "Monitor your SEO progress with up-to-the-minute ranking data.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
      >
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-3 3" />
      </svg>
    ),
    bgColor: "bg-[#E6EAFF]",
    cardBg: "bg-[#E6EAFF]/30",
  },
  {
    title: "Backlink Analyzer",
    description: "Uncover powerful link-building opportunities to boost your authority.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-8 h-8"
      >
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    bgColor: "bg-[#E1F6FF]",
    cardBg: "bg-[#E1F6FF]/30",
  },
]

export function Features() {
  return (
    <section className="py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-500">
            Why GetMoreSEO?
          </div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">Supercharge Your SEO Strategy</h2>
          <p className="max-w-[600px] text-lg text-gray-500 md:text-xl">
            Unlock the power of AI-driven SEO tools to skyrocket your website's rankings and organic traffic.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 pt-20 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative cursor-pointer rounded-xl border border-gray-200 ${feature.cardBg} p-6 transition-all duration-200 hover:shadow-lg`}
            >
              <div className={`mb-8 h-32 w-full rounded-lg ${feature.bgColor} flex items-center justify-center`}>
                <div className="text-gray-800">{feature.icon}</div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              <div className="mt-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-blue-600 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-colors duration-300"
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  )
}

