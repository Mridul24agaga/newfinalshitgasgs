"use client"

import type React from "react"
import dynamic from "next/dynamic"

const DynamicChartSection = dynamic(() => import("./DynamicChartSection"), { ssr: false })

interface ChartData {
  name: string
  value: number
}

const ChartSection: React.FC<{ data: ChartData[] }> = ({ data }) => {
  return <DynamicChartSection data={data} />
}

export default ChartSection

