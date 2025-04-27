import Image from "next/image"
import { BarChart3, Users, DollarSign } from "lucide-react"

const WhyBloggingSection = () => {
  return (
    <section className="bg-white">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 tracking-tight">
            Why Blogging Matters
          </h2>
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

              {/* Right side - Image (smaller on mobile) */}
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[200px] lg:h-[400px] rounded-xl overflow-hidden border border-gray-100 hover:border-[#294df6]/30 hover:shadow-md transition-all duration-300">
                  <Image
                    src="/loading.png"
                    alt="Content marketing strategy illustration"
                    fill
                    className="object-cover w-full h-full"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
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
