"use client"

import { Suspense } from "react"
import WebsiteAnalysisContent from "./website-analysis-content"

export default function WebsiteAnalysisPage() {
  return (
    <Suspense fallback={<WebsiteAnalysisLoading />}>
      <WebsiteAnalysisContent />
    </Suspense>
  )
}

function WebsiteAnalysisLoading() {
  return (
    <div className="min-h-screen flex flex-col font-poppins bg-white">
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative w-32 h-32">
                <div className="w-full h-full border-t-4 border-[#294df6] rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-full h-full border-t-4 border-[#7733ee] rounded-full animate-spin-slow"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-6">Analyzing Website</h1>
            <div className="max-w-md mx-auto mb-8">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Loading</span>
                <span>Please wait...</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#294df6] to-[#7733ee] animate-pulse-width"></div>
              </div>
            </div>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              We're analyzing your website to generate insights about your website and ideal customer profile.
            </p>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes pulse-width {
          0%, 100% { width: 40%; }
          50% { width: 100%; }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-pulse-width {
          animation: pulse-width 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
