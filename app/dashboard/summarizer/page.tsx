import { ChevronDown } from "lucide-react"
import URLForm from "./url-form"
import { Sidebar } from "@/app/components/layout/sidebar"

export default function SummarizerPage() {
  return (
    <div className="flex min-h-screen">
      <div className="fixed top-0 left-0 h-full">
        <Sidebar />
      </div>
      <div className="flex-1 ml-[240px]">
        {" "}
        {/* Adjust the margin-left to match your sidebar width */}
        <div className="bg-[#F8F9FB] min-h-screen">
          <header className="bg-[#F9FAFB] sticky top-0 z-10">
            <div className="flex items-center justify-between px-8 py-4">
              <h1 className="text-2xl font-semibold text-gray-900">Content Writer</h1>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm text-gray-600">
                  🇺🇸 <span className="hidden sm:inline">United States</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button className="flex items-center gap-2 text-sm text-gray-600">
                  English
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button className="px-4 py-2 text-sm font-medium text-black bg-[#4ADE80] rounded-full hover:bg-[#22C55E] transition-colors">
                  Upgrade
                </button>
              </div>
            </div>
          </header>

          <main className="p-8">
            <div className="max-w-[1200px] mx-auto">
              <URLForm />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

