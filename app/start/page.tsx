"use client"

import { useEffect } from "react"

export default function DemoPage() {
  useEffect(() => {
    // Immediately redirect to the pricing section
    window.location.href = "/#pricing"
  }, [])

  // Return null to avoid rendering any UI
  return null
}

