"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Users, Clock } from "lucide-react"

export default function SubjectsPage() {
  const { user } = useAuth()

  const subjects = [
    {
      id: 1,
      name: "Mathematics",
      code: "MATH101",
      credits: 4,
      teacher: "Dr. Smith",
      students: 45,
      schedule: "Mon, Wed, Fri - 9:00 AM",
    },
    {
      id: 2,
      name: "Physics",
      code: "PHY101",
      credits: 4,
      teacher: "Dr. Johnson",
      students: 42,
      schedule: "Tue, Thu - 10:00 AM",
    },
    {
      id: 3,
      name: "Computer Science",
      code: "CS101",
      credits: 3,
      teacher: "Prof. Wilson",
      students: 38,
      schedule: "Mon, Wed - 2:00 PM",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-600">Manage academic subjects and courses</p>
        </div>
        {["admin", "teacher"].includes(user?.role || "") && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <Badge variant="outline">{subject.code}</Badge>
                </div>
                <Badge>{subject.credits} Credits</Badge>
              </div>
              <CardTitle className="text-lg">{subject.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{subject.students} students</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{subject.schedule}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Instructor: </span>
                <span className="text-gray-600">{subject.teacher}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
