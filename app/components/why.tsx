import Image from "next/image"
import { BarChart2, TrendingUp, Users } from "lucide-react"

export default function WhyBloggingSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#294df6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>

      {/* Background Accents */}
      <div className="absolute top-40 left-0 w-72 h-72 bg-[#294df6]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-[#294df6]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center bg-[#294df6]/10 rounded-full px-4 py-1.5 mb-6 text-sm text-[#294df6] font-medium">
            <BarChart2 className="h-4 w-4 mr-2" />
            <span>PROVEN RESULTS</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 leading-tight">
            Why Consistent Blogging <span className="text-[#294df6]">Changes Everything</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl">
            Consistent, high-quality blog content is the backbone of successful SEO strategies, but creating it manually
            is time-consuming and expensive.
          </p>
        </div>

        {/* Graph Section */}
        <div className="mb-20 relative">
          <div className="bg-white rounded-xl border border-gray-200 hover:border-[#294df6]/30 transition-colors duration-300 p-6 md:p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Organic Traffic Growth with Consistent Blogging
                </h3>
                <p className="text-gray-600">Average results from our customers after 6 months</p>
              </div>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-[#294df6] rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">With GetMoreSEO</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Manual Blogging</span>
                </div>
              </div>
            </div>

            {/* Graph Image with Animation */}
            <div className="relative h-[300px] md:h-[400px] w-full group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#294df6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg pointer-events-none"></div>
              <Image
                src="/traffic.png"
                alt="Organic Traffic Growth Chart"
                fill
                className="object-contain"
              />

              {/* Animated Highlight Points */}
              <div className="absolute top-[30%] right-[30%] w-6 h-6 rounded-full border-2 border-[#294df6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
              <div
                className="absolute top-[60%] right-[15%] w-6 h-6 rounded-full border-2 border-[#294df6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>

            {/* Stats Below Graph */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 pt-10 border-t border-gray-100">
              {[
                {
                  icon: <TrendingUp className="h-8 w-8 text-[#294df6]" />,
                  value: "237%",
                  label: "Average Traffic Increase",
                  description: "After 6 months of consistent blogging",
                },
                {
                  icon: <Users className="h-8 w-8 text-[#294df6]" />,
                  value: "68%",
                  label: "More Conversions",
                  description: "Higher quality leads from organic traffic",
                },
                {
                  icon: <BarChart2 className="h-8 w-8 text-[#294df6]" />,
                  value: "12.4x",
                  label: "ROI Improvement",
                  description: "Compared to paid advertising channels",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="border border-gray-100 hover:border-[#294df6]/30 transition-all duration-300 rounded-lg p-6 text-center group hover:bg-gradient-to-b hover:from-white hover:to-[#294df6]/5"
                >
                  <div className="inline-flex items-center justify-center bg-[#294df6]/10 rounded-full p-3 mb-4 group-hover:bg-[#294df6]/20 transition-colors duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-800 mb-1 group-hover:text-[#294df6] transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="font-medium text-gray-700 mb-2">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
