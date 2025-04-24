import { Check, X, ArrowRight, Star, Zap, Shield, Clock, Users, DollarSign } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function ComparisonSection() {
  // Enhanced features with more detailed descriptions and icons
  const features = [
    {
      name: "100% Autopilot",
      description: "Set it and forget it content creation with zero manual input required",
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      getMoreSEO: { value: true, highlight: true },
      competitors: { value: false, note: "Requires manual input & oversight" },
    },
    {
      name: "Start Free",
      description: "Begin your SEO journey without any upfront investment",
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      getMoreSEO: { value: true, highlight: true },
      competitors: { value: false, note: "Paid plans only, no free tier" },
    },
    {
      name: "Human-Quality Content",
      description: "AI-generated content that reads like it was written by expert copywriters",
      icon: <Users className="h-5 w-5 text-blue-500" />,
      getMoreSEO: { value: true, highlight: true },
      competitors: { value: false, note: "Generic content that sounds AI-written" },
    },
    {
      name: "Founder Support",
      description: "Direct access to our founding team for personalized assistance",
      icon: <Shield className="h-5 w-5 text-purple-500" />,
      getMoreSEO: { value: true, highlight: true },
      competitors: { value: false, note: "Ticket-based support with long wait times" },
    },
    {
      name: "Cost Efficiency",
      description: "Maximum ROI with pricing that makes sense for businesses of all sizes",
      icon: <Clock className="h-5 w-5 text-red-500" />,
      getMoreSEO: { value: true, note: "80% more affordable" },
      competitors: { value: false, note: "Premium pricing with hidden costs" },
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Header with animation */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#294df6]/10 rounded-full px-5 py-2 mb-6 text-sm text-[#294df6] font-medium animate-pulse">
            <Star className="h-4 w-4 mr-2 fill-[#294df6]" />
            <span>WHY CHOOSE US</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            The{" "}
            <span className="text-[#294df6] relative">
              GetMoreSEO<span className="absolute bottom-0 left-0 w-full h-1 bg-[#294df6]/30 rounded-full"></span>
            </span>{" "}
            Advantage
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            While competitors promise partial automation, only GetMoreSEO delivers true hands-off content creation that
            ranks—at a fraction of the industry cost.
          </p>
        </div>

        {/* Desktop comparison table with enhanced visuals */}
        <div className="hidden lg:block mb-16">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all">
            {/* Header row */}
            <div className="grid grid-cols-3">
              <div className="p-6 bg-gray-50 font-bold text-gray-800 text-lg border-b border-gray-200">Feature</div>
              <div className="p-6 border-l border-gray-200 bg-[#294df6]/5 font-bold text-[#294df6] text-lg relative border-b border-gray-200">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-[#294df6]"></div>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-[#294df6] flex items-center justify-center mr-3">
                    <Star className="h-4 w-4 text-white fill-white" />
                  </div>
                  GetMoreSEO
                </div>
              </div>
              <div className="p-6 border-l border-gray-200 font-bold text-gray-800 text-lg border-b border-gray-200">
                Competitors
                <span className="block text-xs font-normal text-gray-500 mt-1">
                  SEOBOTAI, TEXTA, JASPERAI, WRITESONIC, etc.
                </span>
              </div>
            </div>

            {/* Feature rows with enhanced styling */}
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "grid grid-cols-3 group hover:bg-gray-50/50 transition-colors",
                  index !== features.length - 1 ? "border-b border-gray-200" : "",
                )}
              >
                <div className="p-6 bg-gray-50 group-hover:bg-gray-100/70 transition-colors">
                  <div className="flex items-center">
                    {feature.icon}
                    <div className="ml-3">
                      <div className="font-semibold text-gray-900">{feature.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{feature.description}</div>
                    </div>
                  </div>
                </div>
                <div className="p-6 border-l border-gray-200 bg-[#294df6]/5 group-hover:bg-[#294df6]/10 transition-colors">
                  {typeof feature.getMoreSEO === "boolean" || feature.getMoreSEO.highlight ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-12 h-12 rounded-full bg-[#294df6]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Check className="w-7 h-7 text-[#294df6]" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="w-12 h-12 rounded-full bg-[#294df6]/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Check className="w-7 h-7 text-[#294df6]" />
                      </div>
                      <span className="text-sm font-medium text-[#294df6] bg-[#294df6]/10 px-3 py-1 rounded-full">
                        {feature.getMoreSEO.note}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6 border-l border-gray-200 group-hover:bg-gray-50/50 transition-colors">
                  {feature.competitors.value ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="w-7 h-7 text-green-500" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                        <X className="w-7 h-7 text-red-500" />
                      </div>
                      <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                        {feature.competitors.note}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completely redesigned mobile comparison */}
        <div className="lg:hidden mb-12">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center">
                    {feature.icon}
                    <h3 className="ml-2 font-semibold text-gray-900">{feature.name}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                </div>

                <div className="grid grid-cols-1 divide-y divide-gray-200">
                  <div className="p-4 bg-[#294df6]/5">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#294df6]/10 flex items-center justify-center mr-3">
                        <Star className="h-4 w-4 text-[#294df6] fill-[#294df6]" />
                      </div>
                      <span className="font-medium text-[#294df6]">GetMoreSEO</span>
                    </div>
                    <div className="mt-2 flex items-center">
                      <Check className="w-5 h-5 text-[#294df6] mr-2" />
                      <span className="text-sm text-gray-700">
                        {typeof feature.getMoreSEO !== "boolean" && feature.getMoreSEO.note ? (
                          <span className="font-medium text-[#294df6]">{feature.getMoreSEO.note}</span>
                        ) : (
                          "Included"
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700">Competitors</span>
                    </div>
                    <div className="mt-2 flex items-center justify-center">
                      <X className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-sm text-gray-600">{feature.competitors.note}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial/Social Proof */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-gray-200">
                <img src="/profile5.jpeg" alt="Sarah Johnson" className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-3">
                "GetMoreSEO completely transformed our content strategy. We're now publishing 3x more content with half
                the resources, and our organic traffic has increased by 187% in just 3 months."
              </p>
              <div className="font-medium text-gray-900">Velika</div>
              <div className="text-sm text-gray-500">SEO Expert</div>
            </div>
          </div>
        </div>

        
      </div>
    </section>
  )
}
