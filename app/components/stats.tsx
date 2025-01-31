"use client"

import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { CheckSquare, Square } from "lucide-react"

interface DataPoint {
  name: string
  organic: number
  total: number
  marker?: string
}

// Sample data for the chart
const data: DataPoint[] = Array.from({ length: 50 }, (_, i) => ({
  name: i.toString(),
  organic: Math.floor(Math.random() * 500) + i * 5,
  total: Math.floor(Math.random() * 600) + i * 6,
}))

// Spike after earlySEO
const midPoint = Math.floor(data.length / 2)
data.splice(midPoint, 0, {
  name: "marker",
  organic: data[midPoint - 1].organic,
  total: data[midPoint - 1].total,
  marker: "after earlySEO",
})

export default function StatsSection() {
  const metrics = [
    { label: "Total clicks", value: "2.8k", checked: true, color: "#3DFEA0" },
    { label: "Total impressions", value: "245k", checked: true, color: "#22D3EE" },
    { label: "Average CTR", value: "2.4%", checked: false },
    { label: "Average position", value: "38.8", checked: false },
  ]

  const stats = [
    { value: "$10k+", label: "Lost Monthly Revenue", sublabel: "Without EarlySEO" },
    { value: "89%", label: "Clients Reach Page 1", sublabel: "Within 90 Days" },
    { value: "312%", label: "Traffic Growth", sublabel: "Guaranteed" },
    { value: "50x", label: "ROI Average", sublabel: "For Clients" },
  ]

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with grid */}
      <div className="absolute inset-0 bg-[#1C155A]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-space-grotesk tracking-tight">
              Drive More Traffic
              <br />
              With AI-Powered SEO
            </h2>
            <p className="text-lg text-white/80">
              Our AI analyzes your content and provides actionable insights to improve your search rankings and drive
              more organic traffic to your website.
            </p>
            <button className="px-8 py-4 bg-white text-purple-900 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-colors">
              Start Optimizing Now
            </button>
          </motion.div>

          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#1C1C27] rounded-3xl overflow-hidden"
          >
            {/* Metrics Grid */}
            <div className="grid grid-cols-4">
              {metrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className={`p-4 ${i === 0 ? "bg-[#3DFEA0]/20" : i === 1 ? "bg-[#22D3EE]/20" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-2 text-sm text-white/60">
                    {metric.checked ? (
                      <CheckSquare className="w-4 h-4" style={{ color: metric.color }} />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                    {metric.label}
                  </div>
                  <div className={`text-2xl font-bold ${i < 2 ? `text-[${metric.color}]` : "text-white"}`}>
                    {metric.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div className="h-64 p-6">
              <div className="flex justify-between text-sm text-white/60 mb-2">
                <div>
                  Clicks <span className="font-bold text-white">750</span>
                </div>
                <div>
                  Impressions <span className="font-bold text-white">45K</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        if (payload[0].payload.marker) {
                          return (
                            <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
                              {payload[0].payload.marker}
                            </div>
                          )
                        }
                        return (
                          <div className="bg-[#1C1C27] p-2 rounded-lg border border-white/10">
                            <div className="text-[#3DFEA0]">Clicks: {payload[0].value}</div>
                            <div className="text-[#22D3EE]">Impressions: {payload[1].value}</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="organic"
                    stroke="#3DFEA0"
                    strokeWidth={2}
                    dot={false}
                    name="Organic Traffic"
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#22D3EE"
                    strokeWidth={2}
                    dot={false}
                    name="Total Traffic"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 border-t border-white/10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.value}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  className="p-4 text-center border-r last:border-r-0 border-white/10"
                >
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                  <div className="text-xs text-[#3DFEA0]">{stat.sublabel}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

