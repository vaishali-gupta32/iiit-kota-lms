"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Users, GraduationCap, UserCheck, Building } from "lucide-react"

interface StatsCardProps {
  title: string
  count: number
  year: string
  color?: string
}

export function StatsCard({ title, count, year, color }: StatsCardProps) {
  // Map titles to appropriate icons for educational context
  const getIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case "students":
        return <GraduationCap className="h-6 w-6" />
      case "teachers":
        return <UserCheck className="h-6 w-6" />
      case "parents":
        return <Users className="h-6 w-6" />
      case "staffs":
        return <Building className="h-6 w-6" />
      default:
        return <Users className="h-6 w-6" />
    }
  }

  const getCardStyle = (title: string) => {
    switch (title.toLowerCase()) {
      case "students":
        return "bg-primary text-primary-foreground shadow-lg hover:shadow-xl border-0"
      case "teachers":
        return "bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl border-0"
      case "parents":
        return "bg-accent text-accent-foreground shadow-lg hover:shadow-xl border-0"
      case "staffs":
        return "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl border-0"
      default:
        return "bg-card text-card-foreground border shadow-lg hover:shadow-xl"
    }
  }

  return (
    <Card className={`edu-card hover:scale-105 transition-all duration-300 ${getCardStyle(title)}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">{getIcon(title)}</div>
            <span className="text-sm font-medium opacity-90">{year}</span>
          </div>
          <MoreHorizontal className="h-4 w-4 opacity-70" />
        </div>
        <div className="space-y-2">
          <div className="text-3xl font-bold tracking-tight">{count.toLocaleString()}</div>
          <div className="text-sm font-medium opacity-90">{title}</div>
        </div>
      </CardContent>
    </Card>
  )
}
