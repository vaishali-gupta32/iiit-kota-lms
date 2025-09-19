"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Settings, LogOut, User } from "lucide-react"
import { NotificationDropdown } from "@/components/notifications/notification-dropdown"
import { ProfileDialog } from "@/components/profile/profile-dialog"

export function Header() {
  const { user, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  if (!user) return null

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = "/login"
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin"
      case "teacher":
        return "Teacher"
      case "student":
        return "Student"
      case "parent":
        return "Parent"
      default:
        return role
    }
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Right Side */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Notifications */}
            <NotificationDropdown />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowProfile(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <ProfileDialog open={showProfile} onOpenChange={setShowProfile} />
    </>
  )
}
