"use client"

import type React from "react"

import { useSearchParams } from "next/navigation"

export default function AnalysisWrapper({
  formComponent,
  analysisComponent,
}: {
  formComponent: React.ReactNode
  analysisComponent: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const hasAnalyzedUrl = !!searchParams.get("url")

  return hasAnalyzedUrl ? analysisComponent : formComponent
}

