import { CheckCircle } from "lucide-react"

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
                  <div className="bg-[#294df6] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg z-10">
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
                    <div className="order-2 md:order-1">
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

                    {/* Video */}
                    <div className="order-1 md:order-2">
                      <div className="w-full">
                        <video
                          src={step.videoSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-auto rounded-lg"
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

export default HowItWorks
