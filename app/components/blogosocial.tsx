import ChartSection from "./Chartsection"

const data = [
  { name: "Nov 2024", value: 8 },
  { name: "Dec 2024", value: 12 },
  { name: "Jan 2025", value: 10 },
  { name: "Feb 2025", value: 18 },
]

export default function BlogsocialStats() {
  return (
    <section className="w-full bg-[#FFF1E6] py-16 mt-16 font-['Inter',sans-serif]">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <ChartSection data={data} />

          {/* Stats Cards */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-800 leading-snug">
              Users of Blogsocial have reported a boost in their productivity and success rates.
            </h3>
            <div className="space-y-6">
              {[
                { percent: "90%", text: "Reduced time spent on initial drafts" },
                { percent: "60%", text: "Increase the click-through rate" },
                { percent: "32%", text: "Return on investment using Blogsocial" },
              ].map((item, index) => (
                <div key={index} className="rounded-xl bg-white p-6 border border-gray-200">
                  <span className="text-6xl font-extrabold text-[#FF8A3D] leading-none">{item.percent}</span>
                  <p className="mt-3 text-base font-medium text-gray-700 leading-snug">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

