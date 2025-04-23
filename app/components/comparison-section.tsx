import { Check, X, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

export default function ComparisonSection() {
  // Define features in a structured array for easier management
  const features = [
    {
      name: "100% Autopilot",
      getMoreSEO: true,
      competitors: { value: false, note: "Limited automation" },
    },
    {
      name: "Start Free",
      getMoreSEO: true,
      competitors: { value: false, note: "Paid plans only" },
    },
    {
      name: "Human-Quality Content",
      getMoreSEO: true,
      competitors: { value: false, note: "Often generic" },
    },
    {
      name: "Founder Support",
      getMoreSEO: true,
      competitors: { value: false, note: "Ticket-based help" },
    },
    {
      name: "Cost",
      getMoreSEO: { value: true, note: "1/5th of others" },
      competitors: { value: false, note: "Premium pricing" },
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-[#294df6]/10 rounded-full px-4 py-1.5 mb-4 text-sm text-[#294df6] font-medium">
            <Star className="h-4 w-4 mr-2" />
            <span>COMPARISON</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Sets GetMoreSEO <span className="text-[#294df6]">Apart</span>
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            While competitors offer partial automation or require significant input, GetMoreSEO delivers true 100%
            autopilot blogging at a fraction of the cost.
          </p>
        </div>

        {/* Desktop comparison table */}
        <div className="hidden lg:block mb-12">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
            {/* Header row */}
            <div className="grid grid-cols-3 border-b border-gray-200">
              <div className="p-5 bg-gray-50 font-bold text-gray-800">Feature</div>
              <div className="p-5 border-l border-gray-200 bg-[#294df6]/5 font-bold text-[#294df6] relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#294df6]"></div>
                GetMoreSEO
              </div>
              <div className="p-5 border-l border-gray-200 font-bold text-gray-800">
                Competitors
                <span className="block text-xs font-normal text-gray-500 mt-1">
                  SEOBOTAI, TEXTA, JASPERAI, WRITESONIC, etc.
                </span>
              </div>
            </div>

            {/* Feature rows */}
            {features.map((feature, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 ${index !== features.length - 1 ? "border-b border-gray-200" : ""}`}
              >
                <div className="p-5 bg-gray-50 font-medium text-gray-800">{feature.name}</div>
                <div className="p-5 border-l border-gray-200 bg-[#294df6]/5 text-center">
                  {typeof feature.getMoreSEO === "boolean" ? (
                    <Check className="w-6 h-6 text-[#294df6] mx-auto" />
                  ) : (
                    <div>
                      <Check className="w-6 h-6 text-[#294df6] mx-auto mb-1" />
                      <span className="text-sm text-[#294df6]">{feature.getMoreSEO.note}</span>
                    </div>
                  )}
                </div>
                <div className="p-5 border-l border-gray-200 text-center">
                  {feature.competitors.value ? (
                    <Check className="w-6 h-6 text-green-500 mx-auto" />
                  ) : (
                    <div className="flex items-center justify-center">
                      <X className="w-6 h-6 text-red-500 mr-2" />
                      <span className="text-sm text-gray-500">{feature.competitors.note}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile comparison table */}
        <div className="lg:hidden mb-12">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md">
            <div className="p-4 bg-[#294df6]/5 border-b border-gray-200 font-bold text-[#294df6] relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#294df6]"></div>
              Feature Comparison
            </div>

            {features.map((feature, index) => (
              <div key={index} className={`p-4 ${index !== features.length - 1 ? "border-b border-gray-200" : ""}`}>
                <div className="font-medium text-gray-800 mb-2">{feature.name}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center bg-[#294df6]/5 p-3 rounded-lg">
                    <Check className="w-5 h-5 text-[#294df6] mr-2" />
                    <span className="text-sm font-medium">
                      GetMoreSEO
                      {typeof feature.getMoreSEO !== "boolean" && (
                        <span className="block text-xs text-[#294df6]/80">{feature.getMoreSEO.note}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <X className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-sm">
                      Competitors
                      <span className="block text-xs text-gray-500">{feature.competitors.note}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-3 bg-[#294df6] hover:bg-[#1e3ed0] text-white font-medium rounded-lg transition-colors shadow-md"
          >
            Start Creating Ranking Content Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
