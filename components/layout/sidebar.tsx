"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import {
  Home,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  School,
  FileText,
  ClipboardCheck,
  Trophy,
  Calendar,
  MessageSquare,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  FolderCheck,
  Calendar1,
  Database,
  BookCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: string[]
}

const navItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    title: "Teachers",
    href: "/teachers",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Students",
    href: "/students",
    icon: GraduationCap,
    roles: ["admin", "teacher"],
  },
  {
    title: "Parents",
    href: "/parents",
    icon: UserCheck,
    roles: ["admin", "teacher"],
  },
  {
    title: "Subjects",
    href: "/subjects",
    icon: BookCheck,
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Classes",
    href: "/classes",
    icon: School,
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Lessons",
    href: "/lessons",
    icon: BookOpen,
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Exams",
    href: "/exams",
    icon: ClipboardCheck,
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Assignments",
    href: "/assignments",
    icon: FileText,
    roles: ["admin", "teacher", "student"],
  },
  {
    title: "Curriculum",
    href: "/curriculum",
    icon: FolderCheck,
    roles: ["admin", "teacher", "student","parent"],
  },
  {
    title: "Results",
    href: "/results",
    icon: Trophy,
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: Database,
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    title: "Events",
    href: "/events",
    icon: Calendar,
    roles: ["admin", "teacher", "student", "parent"],
  },
  {
    title: "Announcements",
    href: "/announcements",
    icon: Megaphone,
    roles: ["admin", "teacher", "student", "parent"],
  },
]

export function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  if (!user) return null

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user.role))

  return (
    <div
      className={cn(
        "bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img src="/images/iiit-logo.png" alt="IIIT Kota" className="w-8 h-8 rounded-full" />
              <span className="font-semibold text-gray-900">IIIT Kota</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="p-1 h-8 w-8">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Menu Label */}
      {!collapsed && (
        <div className="px-4 py-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">MENU</span>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-2 py-2 space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-blue-100 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  collapsed && "justify-center",
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-blue-700" : "text-gray-400")} />
                {!collapsed && <span>{item.title}</span>}
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
