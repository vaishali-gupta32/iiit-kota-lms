"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardCheck, Plus, Calendar, Clock, MapPin } from "lucide-react"

export default function ExamsPage() {
  const { user } = useAuth()

  const exams = [
    {
      id: 1,
      title: "Mathematics Mid-term",
      subject: "Mathematics",
      date: "2025-09-25",
      time: "10:00 AM - 12:00 PM",
      location: "Room 101",
      status: "upcoming",
      duration: "2 hours",
    },
    {
      id: 2,
      title: "Physics Final",
      subject: "Physics",
      date: "2025-10-02",
      time: "2:00 PM - 4:00 PM",
      location: "Room 205",
      status: "upcoming",
      duration: "2 hours",
    },
    {
      id: 3,
      title: "CS Quiz",
      subject: "Computer Science",
      date: "2025-09-15",
      time: "11:00 AM - 12:00 PM",
      location: "Lab 3",
      status: "completed",
      duration: "1 hour",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-600">View and manage examination schedule</p>
        </div>
        {["admin", "teacher"].includes(user?.role || "") && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Exam
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-blue-600" />
                  <Badge variant="outline">{exam.subject}</Badge>
                </div>
                <Badge className={getStatusColor(exam.status)}>{exam.status}</Badge>
              </div>
              <CardTitle className="text-lg">{exam.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{exam.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {exam.time} ({exam.duration})
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{exam.location}</span>
              </div>
              <Button className="w-full" variant={exam.status === "completed" ? "outline" : "default"}>
                {exam.status === "completed" ? "View Results" : "View Details"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
