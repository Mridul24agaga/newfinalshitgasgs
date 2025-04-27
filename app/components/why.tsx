"use client"

import { useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function AnalyticsDashboard() {
  // State for checkbox selection
  const [selectedMetrics, setSelectedMetrics] = useState({
    clicks: true,
    impressions: true,
    ctr: false,
    position: false,
  })

  // Toggle metric visibility
  const toggleMetric = (metric: keyof typeof selectedMetrics) => {
    setSelectedMetrics((prev) => ({
      ...prev,
      [metric]: !prev[metric],
    }))
  }

  // Even more accurate data points to match the image pattern
  const clicksData = [
    // Initial flat period with small fluctuations
    10, 12, 9, 13, 11, 14, 12, 15, 13, 16, 14, 17, 15, 18, 16,
    // Early growth period with fluctuations
    19, 22, 20, 25, 23, 28, 25, 30, 27, 32, 30, 35, 38, 35, 40,
    // Mid growth with more pronounced fluctuations
    45, 42, 48, 45, 52, 48, 55, 52, 60, 56, 65, 60, 70, 65, 75,
    // Accelerated growth with sharp fluctuations
    80, 75, 90, 85, 100, 95, 110, 105, 120, 115, 135, 145, 160, 180, 210,
    // Final spike
    240, 270, 310, 350, 400, 450, 520, 580, 650, 700,
  ]

  // Create impressions data with specific variations to match the image
  const impressionsData = [
    // Initial flat period with small fluctuations
    1000, 1200, 950, 1350, 1100, 1450, 1250, 1550, 1300, 1650, 1400, 1750, 1500, 1850, 1600,
    // Early growth period with fluctuations
    1950, 2250, 2050, 2550, 2350, 2850, 2550, 3050, 2750, 3250, 3050, 3550, 3850, 3550, 4050,
    // Mid growth with more pronounced fluctuations
    4550, 4250, 4850, 4550, 5250, 4850, 5550, 5250, 6050, 5650, 6550, 6050, 7050, 6550, 7550,
    // Accelerated growth with sharp fluctuations
    8050, 7550, 9050, 8550, 10050, 9550, 11050, 10550, 12050, 11550, 13550, 14550, 16050, 18050, 21050,
    // Final spike
    24050, 27050, 31050, 35050, 40050, 45050, 52050, 58050, 65050, 70050,
  ]

  // Create a third data set with a different pattern but similar trend
  const thirdLineData = [
    // Initial flat period with different fluctuations
    8, 11, 7, 12, 9, 13, 10, 14, 11, 15, 12, 16, 13, 17, 14,
    // Early growth period with different fluctuations
    17, 20, 18, 23, 21, 26, 23, 28, 25, 30, 28, 33, 36, 33, 38,
    // Mid growth with different fluctuations
    43, 40, 46, 43, 50, 46, 53, 50, 58, 54, 63, 58, 68, 63, 73,
    // Accelerated growth with different fluctuations
    78, 73, 88, 83, 98, 93, 108, 103, 118, 113, 133, 143, 158, 178, 208,
    // Final spike with slight variation
    235, 265, 305, 345, 395, 445, 515, 575, 645, 695,
  ]

  // Filter datasets based on selected metrics
  const filteredDatasets = [
    selectedMetrics.clicks && {
      label: "Clicks",
      data: clicksData,
      borderColor: "#294fd6", // Blue line
      backgroundColor: "rgba(41, 79, 214, 0.1)",
      yAxisID: "y",
      tension: 0.15, // Less smoothing to show the fluctuations more accurately
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 4,
    },
    selectedMetrics.impressions && {
      label: "Impressions",
      data: impressionsData,
      borderColor: "#000000", // Black line
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      yAxisID: "y1",
      tension: 0.15, // Less smoothing to show the fluctuations more accurately
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 4,
    },
    selectedMetrics.ctr && {
      label: "Trend",
      data: thirdLineData,
      borderColor: "#333333", // Dark gray/black line
      backgroundColor: "rgba(51, 51, 51, 0.05)",
      yAxisID: "y",
      tension: 0.15,
      borderWidth: 2.5,
      borderDash: [5, 5], // Dashed line to distinguish from the solid black line
      pointRadius: 0,
      pointHoverRadius: 4,
    },
  ].filter(Boolean) as any[]

  const chartData = {
    labels: Array.from({ length: clicksData.length }, (_, i) => `Day ${i + 1}`),
    datasets: filteredDatasets,
  }

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      y: {
        type: "linear" as const,
        display: false, // Hide the actual axis
        position: "left" as const,
        min: 0,
        max: 750,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawTicks: false,
        },
      },
      y1: {
        type: "linear" as const,
        display: false, // Hide the actual axis
        position: "right" as const,
        min: 0,
        max: 75000,
        grid: {
          display: false,
        },
      },
      x: {
        display: false, // Hide x-axis
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
          drawTicks: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              if (label.includes("Impressions")) {
                label += new Intl.NumberFormat("en-US").format(context.parsed.y)
              } else {
                label += context.parsed.y
              }
            }
            return label
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.15, // Less smoothing to show the fluctuations more accurately
      },
    },
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      {/* Heading Section - Outside the card */}
      <div className="text-center mb-6 sm:mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
          Why Blogging Matters
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
          Discover the power of blogging for your business and personal brand.
        </p>
      </div>

      {/* Dashboard Card - Shadow removed */}
      <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-gray-200 mb-8">
        {/* Removed the header with getmoreSEO and Performance Dashboard text */}

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {/* Total Clicks */}
          <div className="py-4 sm:py-6 px-4 flex flex-col bg-[#294fd6] text-white border-b sm:border-b-0 sm:border-r border-white/20">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="relative flex items-center justify-center cursor-pointer"
                onClick={() => toggleMetric("clicks")}
              >
                <input
                  type="checkbox"
                  checked={selectedMetrics.clicks}
                  onChange={() => toggleMetric("clicks")}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-white flex items-center justify-center bg-transparent peer-checked:bg-white">
                  {selectedMetrics.clicks && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#294fd6]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <label className="text-sm font-medium cursor-pointer select-none" onClick={() => toggleMetric("clicks")}>
                Total clicks
              </label>
            </div>
            <span className="text-3xl sm:text-4xl font-bold">20.1K</span>
          </div>

          {/* Total Impressions */}
          <div className="py-4 sm:py-6 px-4 flex flex-col bg-[#294fd6] text-white border-b sm:border-b-0 md:border-r border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="relative flex items-center justify-center cursor-pointer"
                onClick={() => toggleMetric("impressions")}
              >
                <input
                  type="checkbox"
                  checked={selectedMetrics.impressions}
                  onChange={() => toggleMetric("impressions")}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-white flex items-center justify-center bg-transparent peer-checked:bg-white">
                  {selectedMetrics.impressions && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[#294fd6]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <label
                className="text-sm font-medium cursor-pointer select-none"
                onClick={() => toggleMetric("impressions")}
              >
                Total impressions
              </label>
            </div>
            <span className="text-3xl sm:text-4xl font-bold">1.93M</span>
          </div>

          {/* Average CTR */}
          <div className="py-4 sm:py-6 px-4 flex flex-col bg-white text-black border-b sm:border-b-0 sm:border-r border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="relative flex items-center justify-center cursor-pointer"
                onClick={() => toggleMetric("ctr")}
              >
                <input
                  type="checkbox"
                  checked={selectedMetrics.ctr}
                  onChange={() => toggleMetric("ctr")}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-black flex items-center justify-center bg-transparent peer-checked:bg-black">
                  {selectedMetrics.ctr && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <label className="text-sm font-medium cursor-pointer select-none" onClick={() => toggleMetric("ctr")}>
                Average CTR
              </label>
            </div>
            <span className="text-3xl sm:text-4xl font-bold text-[#294fd6]">1%</span>
          </div>

          {/* Average Position */}
          <div className="py-4 sm:py-6 px-4 flex flex-col bg-white text-black">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="relative flex items-center justify-center cursor-pointer"
                onClick={() => toggleMetric("position")}
              >
                <input
                  type="checkbox"
                  checked={selectedMetrics.position}
                  onChange={() => toggleMetric("position")}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 border-2 border-black flex items-center justify-center bg-transparent peer-checked:bg-black">
                  {selectedMetrics.position && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <label
                className="text-sm font-medium cursor-pointer select-none"
                onClick={() => toggleMetric("position")}
              >
                Average position
              </label>
            </div>
            <span className="text-3xl sm:text-4xl font-bold text-[#294fd6]">34.1</span>
          </div>
        </div>

        {/* Chart */}
        <div className="px-2 sm:px-4 pb-8 sm:pb-10 pt-4 bg-white h-[180px] sm:h-[220px] relative border-t border-gray-200 select-none">
          {/* Y-axis labels for Clicks - Hidden on smallest screens */}
          <div className="hidden sm:block absolute top-4 left-4 text-gray-700 text-xs space-y-[52px] select-none">
            <div>Clicks</div>
            <div>600</div>
            <div>400</div>
            <div>200</div>
            <div>0</div>
          </div>

          {/* Y-axis labels for Impressions - Hidden on smallest screens */}
          <div className="hidden sm:block absolute top-4 right-4 text-gray-700 text-xs space-y-[52px] text-right select-none">
            <div>Impressions</div>
            <div>60M</div>
            <div>40M</div>
            <div>20M</div>
            <div>0</div>
          </div>

          {/* Chart */}
          <div className="h-full pl-2 pr-2 sm:pl-12 sm:pr-12 pt-2 sm:pt-6 select-none">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Legend removed */}
      </div>
    </div>
  )
}
