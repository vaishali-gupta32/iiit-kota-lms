"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { School, Plus, Users, BookOpen } from "lucide-react"

export default function ClassesPage() {
  const { user } = useAuth()

  const classes = [
    {
      id: 1,
      name: "BTech CSE - Section A",
      year: "2025-26",
      students: 45,
      subjects: 6,
      classTeacher: "Dr. Smith",
    },
    {
      id: 2,
      name: "BTech CSE - Section B",
      year: "2025-26",
      students: 42,
      subjects: 6,
      classTeacher: "Prof. Johnson",
    },
    {
      id: 3,
      name: "BTech ECE - Section A",
      year: "2025-26",
      students: 38,
      subjects: 7,
      classTeacher: "Dr. Wilson",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Classes</h1>
          <p className="text-gray-600">Manage class sections and student groups</p>
        </div>
        {["admin"].includes(user?.role || "") && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Class
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <School className="h-5 w-5 text-blue-600" />
                  <Badge variant="outline">{classItem.year}</Badge>
                </div>
              </div>
              <CardTitle className="text-lg">{classItem.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{classItem.students} students</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                <span>{classItem.subjects} subjects</span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Class Teacher: </span>
                <span className="text-gray-600">{classItem.classTeacher}</span>
              </div>
              <Button className="w-full">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
