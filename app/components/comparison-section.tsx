import { Check, X, Zap, Users, Award, Search, Shield, ArrowRight, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function ComparisonSection() {
  const features = [
    {
      icon: <Users className="w-5 h-5" />,
      name: "Human-Written Content",
      description: "Content written by professional writers, not AI",
      competitors: {
        getMoreSEO: { status: "check", note: "" },
        chatGPT: { status: "x", note: "" },
        jasperWriteSonic: { status: "x", note: "" },
        blogBuster: { status: "x", note: "" },
      },
    },
    {
      icon: <Shield className="w-5 h-5" />,
      name: "Passes AI Detection",
      description: "Content that passes all AI detection tools",
      competitors: {
        getMoreSEO: { status: "check", note: "" },
        chatGPT: { status: "x", note: "" },
        jasperWriteSonic: { status: "x", note: "" },
        blogBuster: { status: "x", note: "" },
      },
    },
    {
      icon: <Search className="w-5 h-5" />,
      name: "Advanced SEO Optimization",
      description: "Comprehensive keyword and on-page SEO optimization",
      competitors: {
        getMoreSEO: { status: "check", note: "" },
        chatGPT: { status: "x", note: "" },
        jasperWriteSonic: { status: "partial", note: "Basic" },
        blogBuster: { status: "partial", note: "Basic" },
      },
    },
    {
      icon: <Zap className="w-5 h-5" />,
      name: "Automatic Publishing",
      description: "Publish content to your blog without manual work",
      competitors: {
        getMoreSEO: { status: "check", note: "" },
        chatGPT: { status: "x", note: "" },
        jasperWriteSonic: { status: "partial", note: "Limited" },
        blogBuster: { status: "check", note: "" },
      },
    },
    {
      icon: <Award className="w-5 h-5" />,
      name: "Auto Internal & External Linking",
      description: "Automatically adds relevant internal and external links",
      competitors: {
        getMoreSEO: { status: "check", note: "" },
        chatGPT: { status: "x", note: "" },
        jasperWriteSonic: { status: "x", note: "" },
        blogBuster: { status: "x", note: "" },
      },
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with animated gradient text */}
        <div className="text-center mb-16 relative">
          {/* Background decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#294df6]/5 rounded-full blur-[100px] -z-10"></div>
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] -z-10"></div>
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] -z-10"></div>

          <div className="inline-flex items-center bg-[#294df6]/10 rounded-full px-4 py-1.5 mb-6 text-sm text-[#294df6] font-medium">
            <Star className="h-4 w-4 mr-2" />
            <span>COMPARISON</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 relative">
            What Makes Us <span className="text-[#294df6]">Different?</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlike AI writing tools that produce generic content, GetMoreSEO delivers human-written, SEO-optimized
            articles that actually rank and convert.
          </p>
        </div>

        {/* Desktop comparison table */}
        <div className="hidden lg:block mb-16">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
            {/* Header row */}
            <div className="grid grid-cols-5">
              <div className="p-8 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">Features</h3>
              </div>
              <div className="p-8 border-l border-b border-gray-200 bg-[#294df6]/5 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#294df6]"></div>
                <div className="flex items-center">
                 
                  <div>
                    <h3 className="text-xl font-bold text-[#294df6]">GetMoreSEO</h3>
                    <p className="text-sm text-[#294df6]/80">Complete SEO solution</p>
                  </div>
                </div>
              </div>
              <div className="p-8 border-l border-b border-gray-200">
                <div className="flex items-center">
                
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">ChatGPT</h3>
                    <p className="text-sm text-gray-500">AI text generation</p>
                  </div>
                </div>
              </div>
              <div className="p-8 border-l border-b border-gray-200">
                <div className="flex items-center">
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Jasper / WriteSonic</h3>
                    <p className="text-sm text-gray-500">AI writing assistants</p>
                  </div>
                </div>
              </div>
              <div className="p-8 border-l border-b border-gray-200">
                <div className="flex items-center">
                 
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">SEO Bot AI</h3>
                    <p className="text-sm text-gray-500">Blog automation tool</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature rows */}
            {features.map((feature, index) => (
              <div
                key={index}
                className={`grid grid-cols-5 ${index !== features.length - 1 ? "border-b border-gray-200" : ""}`}
              >
                <div className="p-8 bg-gray-50 flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#294df6]/10 flex items-center justify-center text-[#294df6] mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">{feature.name}</span>
                    <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                  </div>
                </div>

                {/* GetMoreSEO */}
                <div className="p-8 border-l border-gray-200 bg-[#294df6]/5 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[#294df6]/10 flex items-center justify-center">
                    <Check className="w-6 h-6 text-[#294df6]" />
                  </div>
                </div>

                {/* ChatGPT */}
                <div className="p-8 border-l border-gray-200 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-6 h-6 text-red-500" />
                  </div>
                </div>

                {/* Jasper/WriteSonic */}
                <div className="p-8 border-l border-gray-200 flex items-center justify-center">
                  {feature.competitors.jasperWriteSonic.status === "check" && (
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                  {feature.competitors.jasperWriteSonic.status === "x" && (
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <X className="w-6 h-6 text-red-500" />
                    </div>
                  )}
                  {feature.competitors.jasperWriteSonic.status === "partial" && (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-500">{feature.competitors.jasperWriteSonic.note}</span>
                    </div>
                  )}
                </div>

                {/* BlogBuster */}
                <div className="p-8 border-l border-gray-200 flex items-center justify-center">
                  {feature.competitors.blogBuster.status === "check" && (
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                  {feature.competitors.blogBuster.status === "x" && (
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <X className="w-6 h-6 text-red-500" />
                    </div>
                  )}
                  {feature.competitors.blogBuster.status === "partial" && (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      </div>
                      <span className="text-sm text-gray-500">{feature.competitors.blogBuster.note}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile comparison cards */}
        <div className="lg:hidden space-y-8">
          {/* GetMoreSEO Card */}
          <div className="bg-white rounded-2xl border-2 border-[#294df6] overflow-hidden shadow-lg relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#294df6]"></div>
            <div className="p-6 bg-[#294df6]/5 border-b border-[#294df6]/20">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-[#294df6]/10 flex items-center justify-center mr-4">
                  <Image
                    src="/logo-icon.png?query=modern minimalist logo icon"
                    alt="GetMoreSEO"
                    width={28}
                    height={28}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#294df6]">GetMoreSEO</h3>
                  <p className="text-[#294df6]/80">The complete SEO content solution</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#294df6]/10 flex items-center justify-center mr-4 mt-1 flex-shrink-0">
                    <Check className="w-5 h-5 text-[#294df6]" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800">{feature.name}</span>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-[#294df6]/5 border-t border-[#294df6]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                        <Image
                          src={`/user-${i}.jpg`}
                          alt={`User ${i}`}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="ml-3 text-sm text-gray-600">
                    <span className="font-semibold">25,260+</span> users
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other competitors in a simplified format */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How competitors compare</h3>

              <div className="space-y-6">
                {/* ChatGPT */}
                <div className="pb-6 border-b border-gray-100">
                  <div className="flex items-center mb-4">
                   
                    <div>
                      <h4 className="font-bold text-gray-800">ChatGPT</h4>
                      <p className="text-sm text-gray-500">AI text generation</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">No human content</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">Fails AI detection</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">No SEO features</span>
                  </div>
                </div>

                {/* Jasper/WriteSonic */}
                <div className="pb-6 border-b border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <Image
                        src="/jasper-icon.png?query=jasper ai logo icon"
                        alt="Jasper/WriteSonic"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">Jasper / WriteSonic</h4>
                      <p className="text-sm text-gray-500">AI writing assistants</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">No human content</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">Fails AI detection</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Basic SEO only</span>
                  </div>
                </div>

                {/* BlogBuster */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <Image
                        src="/blogbuster-icon.png?query=blog automation logo icon"
                        alt="BlogBuster"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">BlogBuster</h4>
                      <p className="text-sm text-gray-500">Blog automation tool</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">No human content</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full">Fails AI detection</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">Has publishing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-[#294df6]/10 to-purple-500/10 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Stop wasting time with AI-generated content that Google penalizes
            </h3>
            <Link
              href="/signup"
              className="inline-flex items-center px-8 py-4 bg-[#294df6] hover:bg-[#1e3ed0] text-white font-medium rounded-xl transition-colors shadow-lg shadow-[#294df6]/20 hover:shadow-[#294df6]/30"
            >
              Get Started For Free Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <p className="mt-4 text-sm text-gray-600">No credit card required. Cancel anytime.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
