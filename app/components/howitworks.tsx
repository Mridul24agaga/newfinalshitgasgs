import Image from "next/image"
import { CheckCircle } from "lucide-react"

const steps = [
  {
    number: 1,
    id: "keyword-research",
    label: "Keyword Research",
    title: "Find Your Hidden SEO Goldmine",
    description:
      "Uncover untapped keyword opportunities your competitors haven't even thought of, driving more targeted traffic to your site.",
    features: [
      {
        title: "Keyword Research, Simplified",
        description:
          "Skip the tedious manual work and let our AI engine do the heavy lifting. Uncover hidden keyword gems with high search volume and low competition.",
      },
      {
        title: "AI-Powered Search Intent Analysis",
        description:
          "Our AI digs deep into search intent, revealing the true meaning behind users queries so you can deliver exactly what they're looking for.",
      },
    ],
    image: "/placeholder.svg?height=400&width=500",
  },
  {
    number: 2,
    id: "content-editor",
    label: "Content Editor",
    title: "Create Content That Search Engines Love",
    description:
      "Tired of staring at a blank page? Our AI-powered writer does the heavy lifting, crafting SEO-optimized content that not only ranks higher in search results but also captivates your readers.",
    features: [
      {
        title: "AI Humanizer",
        description:
          "Say goodbye to robotic, bland content. Create content that engages and resonates with your audience.",
      },
      {
        title: "Seamless Keyword Integration",
        description:
          "We weave relevant keywords naturally into your content, boosting your visibility without sacrificing readability and quality.",
      },
      {
        title: "Brand Voice",
        description:
          "Your brand's voice is unique, and our AI understands that. We tailor the tone and style of your content to match your brand's personality perfectly.",
      },
    ],
    image: "/placeholder.svg?height=400&width=500",
  },
  {
    number: 3,
    id: "auto-publish",
    label: "Auto-Publish",
    title: "Publish Without Lifting a Finger",
    description:
      "Set it and forget it. Our platform automatically publishes your content to your blog on your schedule, saving you hours of manual work.",
    features: [
      {
        title: "Smart Scheduling",
        description:
          "Our AI determines the optimal publishing times for maximum engagement based on your audience's online behavior.",
      },
      {
        title: "Multi-Platform Publishing",
        description:
          "Automatically publish to WordPress, Medium, and other popular blogging platforms with a single click.",
      },
    ],
    image: "/placeholder.svg?height=400&width=500",
  },
  {
    number: 4,
    id: "analytics",
    label: "Analytics",
    title: "Track Your Content Performance",
    description:
      "Get detailed insights into how your content is performing and make data-driven decisions to improve your SEO strategy.",
    features: [
      {
        title: "Real-Time Performance Tracking",
        description:
          "Monitor your content's performance in real-time, including rankings, traffic, and engagement metrics.",
      },
      {
        title: "Competitor Analysis",
        description:
          "See how your content stacks up against your competitors and identify opportunities to outrank them.",
      },
    ],
    image: "/placeholder.svg?height=400&width=500",
  },
]

export function HowItWorks() {
  return (
    <section id="howitworks" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform makes it easy to create, publish, and optimize content that ranks.
          </p>
        </div>

        {/* Steps with Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[24px] top-[60px] bottom-20 w-[2px] bg-gray-200 hidden md:block"></div>

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step Indicator */}
                <div className="flex items-center mb-6 md:mb-8">
                  <div className="bg-[#294df6] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10 shadow-md">
                    {step.number}
                  </div>
                  <div className="ml-4">
                    <div className="text-[#294df6] font-bold text-lg">Step {step.number}</div>
                    <div className="text-gray-600">{step.label}</div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="ml-0 md:ml-16">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Text Content */}
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-4">{step.title}</h3>
                      <p className="text-gray-600 mb-8">{step.description}</p>

                      <div className="space-y-6">
                        {step.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex gap-3">
                            <CheckCircle className="h-6 w-6 text-[#294df6] flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                              <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Image */}
                    <div className="bg-[#f9f9f9] rounded-xl p-4 flex items-center justify-center">
                      <div className="relative w-full max-w-md mx-auto">
                        <Image
                          src={step.image || "/placeholder.svg"}
                          alt={step.title}
                          width={500}
                          height={400}
                          className="rounded-lg shadow-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Connector Arrow (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-8 md:my-12">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-300"
                    >
                      <path d="M12 5v14"></path>
                      <path d="m19 12-7 7-7-7"></path>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of content creators who are already using our platform to create SEO-optimized content that
            ranks.
          </p>
          <button className="bg-[#294df6] hover:bg-[#1e3fd0] text-white px-6 py-3 rounded-md font-medium">
            Start for Free Today
          </button>
        </div>
      </div>
    </section>
  )
}

