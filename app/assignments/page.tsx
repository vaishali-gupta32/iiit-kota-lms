"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Calendar, Clock } from "lucide-react"

export default function AssignmentsPage() {
  const { user } = useAuth()

  const assignments = [
    {
      id: 1,
      title: "Calculus Problem Set 3",
      subject: "Mathematics",
      dueDate: "2025-09-20",
      status: "pending",
      description: "Solve problems 1-15 from Chapter 4",
    },
    {
      id: 2,
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "2025-09-18",
      status: "submitted",
      description: "Write a report on the pendulum experiment",
    },
    {
      id: 3,
      title: "Programming Assignment",
      subject: "Computer Science",
      dueDate: "2025-09-25",
      status: "pending",
      description: "Implement a binary search tree in Python",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Manage and track your assignments</p>
        </div>
        {["admin", "teacher"].includes(user?.role || "") && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <Badge variant="outline">{assignment.subject}</Badge>
                </div>
                <Badge className={getStatusColor(assignment.status)}>{assignment.status}</Badge>
              </div>
              <CardTitle className="text-lg">{assignment.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{assignment.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Due: {assignment.dueDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>
                  {new Date(assignment.dueDate) > new Date()
                    ? `${Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left`
                    : "Overdue"}
                </span>
              </div>
              <Button className="w-full" variant={assignment.status === "submitted" ? "outline" : "default"}>
                {assignment.status === "submitted" ? "View Submission" : "Submit Assignment"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
