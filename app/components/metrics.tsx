"use client"

export default function MetricsSection() {
  const metrics = [
    {
      score: "8.9",
      title: "Ease of Use",
      subtitle: "AI Blog Writer",
      description: "Friendly UI",
      color: "#FF7B51",
      trackColor: "rgba(255, 123, 81, 0.2)",
    },
    {
      score: "9.0",
      title: "Quality of Support",
      subtitle: "AI Blog Writer",
      description: "Easy Setup",
      color: "#0096FF",
      trackColor: "rgba(0, 150, 255, 0.2)",
    },
    {
      score: "8.2",
      title: "Value for Money",
      subtitle: "AI Blog Writer",
      description: "Best quality",
      color: "#6C5CE7",
      trackColor: "rgba(108, 92, 231, 0.2)",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-[#1C155A] rounded-3xl border border-gray-700 p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="relative w-32 h-32">
                {/* Background circle */}
                <div className="absolute inset-0 rounded-full" style={{ backgroundColor: metric.trackColor }} />
                {/* Progress circle */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke={metric.color}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    style={{
                      strokeDasharray: "364.4",
                      strokeDashoffset: 364.4 * (1 - Number(metric.score) / 10),
                      transition: "stroke-dashoffset 1s ease-in-out",
                    }}
                  />
                </svg>
                {/* Score text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold" style={{ color: metric.color }}>
                    {metric.score}
                  </span>
                </div>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">{metric.title}</h3>
              <p className="mt-1 text-sm text-gray-300">{metric.subtitle}</p>
              <p className="text-sm text-gray-300">{metric.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <h2 className="text-2xl font-bold text-white">Top Google ranking in 120 days</h2>
        </div>
      </div>
    </div>
  )
}

