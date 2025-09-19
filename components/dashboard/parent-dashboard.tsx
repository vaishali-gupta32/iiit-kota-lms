"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Calendar, Trophy, AlertTriangle, MessageSquare, FileText } from "lucide-react"

interface ParentDashboardProps {
  userId: string
}

interface Child {
  id: number
  name: string
  class: string
  section: string
  attendance: number
  averageGrade: number
  pendingAssignments: number
}

interface Notification {
  id: number
  type: string
  title: string
  message: string
  date: string
}

interface Event {
  id: number
  title: string
  date: string
  type: string
}

export function ParentDashboard({ userId }: ParentDashboardProps) {
  const [children, setChildren] = useState<Child[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])

  useEffect(() => {
    fetchParentData()
  }, [userId])

  const fetchParentData = async () => {
    // Mock data for demonstration
    setChildren([
      {
        id: 1,
        name: "John Doe",
        class: "BTech",
        section: "A",
        attendance: 94,
        averageGrade: 87,
        pendingAssignments: 2,
      },
      {
        id: 2,
        name: "Jane Doe",
        class: "BTech",
        section: "B",
        attendance: 89,
        averageGrade: 92,
        pendingAssignments: 1,
      },
    ])

    setNotifications([
      {
        id: 1,
        type: "warning",
        title: "Low Attendance Alert",
        message: "John's attendance is below 95%",
        date: "2025-09-15",
      },
      { id: 2, type: "info", title: "Parent-Teacher Meeting", message: "Scheduled for next week", date: "2025-09-14" },
      {
        id: 3,
        type: "success",
        title: "Excellent Performance",
        message: "Jane scored 95% in Mathematics",
        date: "2025-09-13",
      },
    ])

    setUpcomingEvents([
      { id: 1, title: "Parent-Teacher Meeting", date: "2025-09-22", type: "meeting" },
      { id: 2, title: "Annual Sports Day", date: "2025-09-25", type: "event" },
      { id: 3, title: "Science Exhibition", date: "2025-09-28", type: "exhibition" },
    ])
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "success":
        return <Trophy className="h-5 w-5 text-green-500" />
      default:
        return <MessageSquare className="h-5 w-5 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Welcome, Parent!</h2>
        <p className="opacity-90">Stay updated with your children's academic progress and school activities.</p>
      </div>

      {/* Children Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child: any) => (
          <Card key={child.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {child.name}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {child.class} - Section {child.section}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Attendance</span>
                  <span className="text-sm text-gray-600">{child.attendance}%</span>
                </div>
                <Progress value={child.attendance} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Average Grade</span>
                  <span className="text-sm text-gray-600">{child.averageGrade}%</span>
                </div>
                <Progress value={child.averageGrade} className="h-2" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pending Assignments</span>
                <Badge variant={child.pendingAssignments > 2 ? "destructive" : "secondary"}>
                  {child.pendingAssignments}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification: any) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming School Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event: any) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <Badge variant="outline">{event.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <MessageSquare className="h-6 w-6" />
              <span>Message Teacher</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <Calendar className="h-6 w-6" />
              <span>View Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <FileText className="h-6 w-6" />
              <span>Download Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
              <Trophy className="h-6 w-6" />
              <span>View Results</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
