"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Settings, Key, LogOut, User } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface ProfileDropdownProps {
  user: SupabaseUser | null | undefined
  onSignOut: () => Promise<void>
}

export function ProfileDropdown({ user, onSignOut }: ProfileDropdownProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isProfileOpen && !target.closest('[aria-haspopup="true"]') && !target.closest(".absolute")) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isProfileOpen])

  const navigateTo = (path: string) => {
    setIsProfileOpen(false)
    router.push(path)
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await onSignOut()
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // If user is not available, show a placeholder
  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 relative">
          <Bell size={20} />
        </button>
        <div className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100">
          <User size={20} className="text-gray-400" />
        </div>
      </div>
    )
  }

  // Get the first letter of email or use a fallback
  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : "U"

  return (
    <div className="flex items-center space-x-4">
      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 relative">
        <Bell size={20} />
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
      </button>

      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden border-2 border-[#294fd6]/20 hover:border-[#294fd6]/50 transition-all duration-200"
          aria-expanded={isProfileOpen}
          aria-haspopup="true"
          type="button"
        >
          <div className="w-10 h-10 bg-[#294fd6] flex items-center justify-center text-white font-medium">
            {userInitial}
          </div>
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl py-1 z-50 border border-gray-200 overflow-hidden shadow-lg">
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#294fd6]/20 mr-3">
                  <div className="w-10 h-10 bg-[#294fd6] flex items-center justify-center text-white font-medium text-lg">
                    {userInitial}
                  </div>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.user_metadata?.name || (user.email ? user.email.split("@")[0] : "User")}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email || "No email available"}</p>
                </div>
              </div>
            </div>

            <div className="py-1">
              <button
                onClick={() => navigateTo("/settings")}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="h-4 w-4 mr-3 text-gray-500" />
                Account Settings
              </button>

              <button
                onClick={() => navigateTo("/apigenerate")}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Key className="h-4 w-4 mr-3 text-gray-500" />
                API Keys
              </button>
            </div>

            <div className="border-t border-gray-100">
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <LogOut className="h-4 w-4 mr-3 text-red-500" />
                {isSigningOut ? "Signing out..." : "Log out"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
