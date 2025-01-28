import Link from "next/link"

export function Navbar() {
  return (
    <nav className="w-full py-4 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#10B981] rounded-full" />
          <span className="text-gray-900 text-xl font-medium">Texta.ai</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            Blog Automation
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            Email/Letter Writer
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            Writing Assistant
          </Link>
          <Link href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">Log In</button>
          <button className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-full transition-colors">
            Try for Free
          </button>
        </div>
      </div>
    </nav>
  )
}

