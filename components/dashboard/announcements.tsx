"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Announcement {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "success" | "error"
  createdAt: Date
}

interface AnnouncementsProps {
  announcements: Announcement[]
}

export function Announcements({ announcements }: AnnouncementsProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 border-l-green-500"
      case "warning":
        return "bg-yellow-100 border-l-yellow-500"
      case "error":
        return "bg-red-100 border-l-red-500"
      default:
        return "bg-blue-100 border-l-blue-500"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Announcements</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className={`p-4 rounded-lg border-l-4 ${getTypeColor(announcement.type)}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{announcement.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                <span className="text-xs text-gray-500">{new Date(announcement.createdAt).toLocaleDateString()}</span>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
