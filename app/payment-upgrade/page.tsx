"use client"

import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import PaymentUpgradeContent from "./payment-upgrade-content"

export default function PaymentUpgradePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-8 max-w-md w-full">
        <Suspense
          fallback={
            <div className="flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-[#294fd6] animate-spin mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading</h1>
              <p className="text-gray-600 text-center">Please wait while we load your subscription details...</p>
            </div>
          }
        >
          <PaymentUpgradeContent />
        </Suspense>
      </div>
    </div>
  )
}
