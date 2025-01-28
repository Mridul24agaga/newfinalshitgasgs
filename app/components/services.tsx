"use client"

const features = [
  {
    title: "Keyword Research",
    description: "Discover profitable keywords without complex analysis.",
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
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    bgColor: "bg-[#FFFFCB]",
    cardBg: "bg-[#FFFFCB]/30",
  },
  {
    title: "Content Editor",
    description: "Get AI-powered guidance to create top-ranking content.",
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
    title: "Rankings Tracker",
    description: "Monitor the progress and performance of your keywords.",
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
    title: "Automatic Publisher",
    description: "Effortlessly schedule and publish your optimized content.",
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
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
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
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">SEO Made Simple, Effective, And Scalable</h2>
          <p className="text-lg text-gray-500 md:text-xl">
            Designed to Drive Traffic, Boost Rankings, and Grow Your Business
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 pt-20 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative cursor-pointer rounded-xl border border-black ${feature.cardBg} p-6 transition-all duration-200 hover:shadow-lg`}
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
      </div>
    </section>
  )
}

