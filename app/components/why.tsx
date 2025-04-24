import Image from "next/image"
import { Search, Activity, BarChart3, Users, DollarSign } from "lucide-react"

const WhyBloggingSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Blogging Matters</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the power of blogging for your business and personal brand.
          </p>
        </div>

        {/* Graph and Features Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl border border-gray-200 hover:border-[#294df6]/30 hover:shadow-lg transition-all duration-300 p-6 md:p-8 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left side - Graph */}
              <div className="border border-gray-100 rounded-xl shadow-sm p-6 bg-white">
                {/* Key Blogging Benefits instead of metrics */}
                <div className="grid grid-cols-1 gap-4 mb-6">

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-3 border border-gray-100 rounded-lg hover:border-[#294df6]/30 hover:bg-gray-50 transition-all">
                      <BarChart3 className="w-8 h-8 text-[#294df6] mb-2" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">67%</div>
                        <div className="text-xs text-gray-600 mt-1">More leads per month</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center p-3 border border-gray-100 rounded-lg hover:border-[#294df6]/30 hover:bg-gray-50 transition-all">
                      <Users className="w-8 h-8 text-[#294df6] mb-2" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">55%</div>
                        <div className="text-xs text-gray-600 mt-1">Increased website visitors</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center p-3 border border-gray-100 rounded-lg hover:border-[#294df6]/30 hover:bg-gray-50 transition-all">
                      <DollarSign className="w-8 h-8 text-[#294df6] mb-2" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">13x</div>
                        <div className="text-xs text-gray-600 mt-1">Positive ROI</div>
                      </div>
                    </div>
                  </div>

                  
                </div>

                {/* Graph Image */}
                <div className="relative h-[250px] w-full group border-t border-b border-gray-100 py-4 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/googlie.png"
                      alt="Organic Traffic Growth Chart"
                      width={500}
                      height={250}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* Right side - Feature Cards */}
              <div className="space-y-6">
                {/* First Feature Card */}
                <div className="border border-gray-100 rounded-xl p-6 hover:border-[#294df6]/30 hover:shadow-md transition-all duration-300 bg-white group">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-5">
                      <div className="p-3 bg-[#294df6]/10 rounded-full group-hover:bg-[#294df6]/20 transition-colors duration-300">
                        <Search className="w-6 h-6 text-[#294df6]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#294df6] mb-3">In-Depth, Research-Backed Content</h3>
                      <ul className="mt-3 space-y-3">
                        <li className="flex items-start">
                          <span className="text-[#294df6] mr-2 text-lg leading-tight">•</span>
                          <span className="text-gray-700">Comprehensive articles (up to 4,000 words)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#294df6] mr-2 text-lg leading-tight">•</span>
                          <span className="text-gray-700">Fact-checked from reliable sources</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#294df6] mr-2 text-lg leading-tight">•</span>
                          <span className="text-gray-700">Audience-specific problem-solving content</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Second Feature Card */}
                <div className="border border-gray-100 rounded-xl p-6 hover:border-[#294df6]/30 hover:shadow-md transition-all duration-300 bg-white group">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-5">
                      <div className="p-3 bg-[#294df6]/10 rounded-full group-hover:bg-[#294df6]/20 transition-colors duration-300">
                        <Activity className="w-6 h-6 text-[#294df6]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#294df6] mb-3">Complete SEO Framework</h3>
                      <ul className="mt-3 space-y-3">
                        <li className="flex items-start">
                          <span className="text-[#294df6] mr-2 text-lg leading-tight">•</span>
                          <span className="text-gray-700">Strategic keyword placement (primary & longtail)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#294df6] mr-2 text-lg leading-tight">•</span>
                          <span className="text-gray-700">Effective internal & external linking</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-[#294df6] mr-2 text-lg leading-tight">•</span>
                          <span className="text-gray-700">Organized in search-friendly structures</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="px-8 py-3 bg-[#294df6] hover:bg-[#1a3ad0] text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
            Start Your Blogging Strategy
          </button>
          <p className="mt-4 text-gray-500 text-sm">
            Join 2,500+ businesses already growing with our content strategies
          </p>
        </div>
      </div>
    </section>
  )
}

export default WhyBloggingSection
