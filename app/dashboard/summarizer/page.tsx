"use client"

import { ChevronDown, Menu } from "lucide-react"
import URLForm from "./url-form"
import { Sidebar } from "@/app/components/layout/sidebar"
import { useState } from "react"

export default function SummarizerPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-orange-500 text-white p-2 rounded-md"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 transition-all duration-300 ease-in-out">
        <div className="bg-[#F8F9FB] min-h-screen">
          <header className="bg-[#F9FAFB] sticky top-0 z-30">
            <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-4 mt-14 md:mt-0">
              
            </div>
          </header>

          <main className="p-4 md:p-8 pt-20 md:pt-8">
            <div className="max-w-[1200px] mx-auto">
              <URLForm />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

