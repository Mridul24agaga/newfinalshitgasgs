"use client"
import { AppSidebar } from "../components/sidebar"

export default function Page() {
  return (
    <div className="flex h-screen bg-gray-100">
      <AppSidebar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Subscription Management</h2>
            <p className="text-sm text-gray-500">Contact information for account changes</p>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              To cancel your subscription or for credit recovery, please contact us at:
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a href="mailto:hi@mridulthareja.com" className="hover:underline">
                hi@mridulthareja.com
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Our support team will respond to your request within 24-48 business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
