"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { PenLine, LayoutGrid, Lightbulb, BarChart2, FileText, Database, Home } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Content Planner", href: "/content-planner", icon: PenLine },
  {
    name: "Company Database",
    icon: Database,
    subItems: [
      { name: "Content Ideas", href: "/company-database/ideas", icon: Lightbulb },
      { name: "Brand Profile", href: "/company-database/brand", icon: FileText },
      { name: "Blog Settings", href: "/company-database/blog", icon: LayoutGrid },
      { name: "Audience and Keywords", href: "/company-database/audience", icon: BarChart2 },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="flex items-center gap-3 p-5">
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">T</span>
        </div>
        <span className="text-xl font-semibold text-black">Texta.ai</span>
      </div>

      <div className="px-4 mt-2 mb-8">
        <button className="w-full bg-orange-500 text-white font-medium py-3.5 rounded-xl hover:bg-orange-600 transition-colors">
          Get Started
        </button>
      </div>

      <nav className="flex-1 px-4 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || (item.subItems && item.subItems.some((subItem) => pathname === subItem.href))

          return (
            <div key={item.name}>
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-[15px] font-medium rounded-xl transition-colors mb-2",
                    isActive ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50",
                  )}
                >
                  <Icon className="w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px]" />
                  {item.name}
                </Link>
              ) : (
                <div className="flex items-center px-4 py-3 text-[15px] font-medium text-black mb-2">
                  <Icon className="w-[18px] h-[18px] mr-3 flex-shrink-0 stroke-[1.5px]" />
                  {item.name}
                </div>
              )}
              {item.subItems && (
                <div className="ml-6 space-y-2">
                  {item.subItems.map((subItem) => {
                    const SubIcon = subItem.icon
                    const isSubActive = pathname === subItem.href
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center px-4 py-2 text-[14px] font-medium rounded-lg transition-colors",
                          isSubActive ? "text-black bg-gray-100" : "text-gray-600 hover:text-black hover:bg-gray-50",
                        )}
                      >
                        <SubIcon className="w-[16px] h-[16px] mr-3 flex-shrink-0 stroke-[1.5px]" />
                        {subItem.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 bg-gray-50 mt-auto border-t border-gray-200">
        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-1">
            <div>
              <p className="text-sm font-medium text-black">Credits</p>
              <p className="text-sm text-gray-500">SEO Credits</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-black">8</p>
              <p className="text-sm text-gray-500">7</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <button className="text-sm text-orange-500 font-medium hover:text-orange-600">Free Trial</button>
            <button className="bg-black text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1">
              Upgrade <span className="text-orange-500">↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

