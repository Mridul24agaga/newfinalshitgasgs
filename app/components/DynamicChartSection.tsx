import type React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { TooltipProps } from "recharts"
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

interface ChartData {
  name: string
  value: number
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-2 rounded-md">
        <p className="text-sm font-medium">{`${label}: ${payload[0].value}`}</p>
      </div>
    )
  }
  return null
}

const DynamicChartSection: React.FC<{ data: ChartData[] }> = ({ data }) => {
  return (
    <div className="rounded-2xl bg-white p-8 border border-gray-200">
      <h2 className="mb-6 text-4xl font-extrabold text-gray-900 leading-tight tracking-tight">WITH Blogosocial.</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
              tick={{ fill: "#4B5563", fontSize: 12, fontWeight: 500 }}
            />
            <YAxis
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={false}
              tick={{ fill: "#4B5563", fontSize: 12, fontWeight: 500 }}
              domain={[0, 20]}
              ticks={[0, 4, 8, 12, 16, 20]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#FF8A3D"
              strokeWidth={3}
              dot={{ fill: "#FF8A3D", strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: "#FF8A3D", stroke: "#FFF", strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 text-center">
        <span className="inline-block bg-[#FF8A3D] text-white text-sm font-semibold px-4 py-2 rounded-full tracking-wide">
          After Blogsocial
        </span>
      </div>
    </div>
  )
}

export default DynamicChartSection

