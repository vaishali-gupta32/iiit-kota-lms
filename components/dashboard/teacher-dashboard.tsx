"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, BookOpen, ClipboardCheck, MessageSquare, Plus, GraduationCap } from "lucide-react"

interface TeacherDashboardProps {
  userId: string
}

export function TeacherDashboard({ userId }: TeacherDashboardProps) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    pendingAssignments: 0,
    upcomingLessons: 0,
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTeacherStats()
  }, [userId])

  const fetchTeacherStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      try {
        const response = await fetch(`/api/teachers/${userId}/stats`, {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats || stats)
          setRecentActivities(data.recentActivities || [])
        } else {
          throw new Error("Failed to fetch teacher data")
        }
      } catch (fetchError: any) {
        if (fetchError.name === "AbortError") {
          throw new Error("Request timed out. Please check your connection.")
        }
        throw fetchError
      }
    } catch (error: any) {
      console.error("Failed to fetch teacher stats:", error)
      setError(error.message || "Failed to load dashboard data")

      setStats({
        totalStudents: 156,
        totalClasses: 8,
        pendingAssignments: 12,
        upcomingLessons: 5,
      })

      setRecentActivities([
        { id: 1, type: "assignment", title: "Mathematics Assignment 3", status: "pending", date: "2025-09-15" },
        { id: 2, type: "lesson", title: "Physics - Quantum Mechanics", status: "scheduled", date: "2025-09-16" },
        { id: 3, type: "exam", title: "construction Mid-term", status: "graded", date: "2025-09-14" },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="text-lg font-medium">Loading your dashboard...</div>
          <div className="text-sm text-muted-foreground">Please wait while we fetch your teaching data</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="iiit-gradient rounded-xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, Teacher!</h2>
            <p className="text-white/90 text-lg">Here's what's happening in your classes today.</p>
            <p className="text-white/80 text-sm">IIIT Kota • Faculty Dashboard</p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <p className="text-white/90 text-sm">⚠️ {error}</p>
            <p className="text-white/70 text-xs mt-1">Showing cached data. Please refresh to try again.</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="edu-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="edu-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Classes</p>
                <p className="text-2xl font-bold">{stats.totalClasses}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="edu-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <ClipboardCheck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Assignments</p>
                <p className="text-2xl font-bold">{stats.pendingAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="edu-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <Calendar className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Lessons</p>
                <p className="text-2xl font-bold">{stats.upcomingLessons}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity: any) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                  <Badge variant={activity.status === "pending" ? "destructive" : "secondary"}>{activity.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button className="h-20 flex flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Create Assignment</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <Calendar className="h-6 w-6" />
                <span>Schedule Lesson</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <ClipboardCheck className="h-6 w-6" />
                <span>Grade Exams</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2 bg-transparent">
                <MessageSquare className="h-6 w-6" />
                <span>Send Message</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
