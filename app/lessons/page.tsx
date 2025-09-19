"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Calendar, Clock, User } from "lucide-react"

export default function LessonsPage() {
  const { user } = useAuth()

  const lessons = [
    {
      id: 1,
      title: "Introduction to Calculus",
      subject: "Mathematics",
      date: "2025-09-16",
      time: "9:00 AM - 10:30 AM",
      teacher: "Dr. Smith",
      status: "scheduled",
      description: "Basic concepts of differential calculus",
    },
    {
      id: 2,
      title: "Quantum Mechanics Basics",
      subject: "Physics",
      date: "2025-09-16",
      time: "11:00 AM - 12:30 PM",
      teacher: "Dr. Johnson",
      status: "ongoing",
      description: "Introduction to quantum mechanics principles",
    },
    {
      id: 3,
      title: "Data Structures",
      subject: "Computer Science",
      date: "2025-09-15",
      time: "2:00 PM - 3:30 PM",
      teacher: "Prof. Wilson",
      status: "completed",
      description: "Arrays, linked lists, and basic operations",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "ongoing":
        return "bg-yellow-100 text-yellow-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
          <p className="text-gray-600">View and manage lesson schedule</p>
        </div>
        {["admin", "teacher"].includes(user?.role || "") && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Lesson
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <Badge variant="outline">{lesson.subject}</Badge>
                </div>
                <Badge className={getStatusColor(lesson.status)}>{lesson.status}</Badge>
              </div>
              <CardTitle className="text-lg">{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{lesson.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{lesson.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{lesson.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{lesson.teacher}</span>
              </div>
              <Button className="w-full">{lesson.status === "completed" ? "View Recording" : "Join Lesson"}</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
