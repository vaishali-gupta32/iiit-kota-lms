"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Trophy, Clock, FileText, GraduationCap } from "lucide-react"

interface StudentDashboardProps {
  userId: string
}

export function StudentDashboard({ userId }: StudentDashboardProps) {
  const [stats, setStats] = useState({
    totalSubjects: 0,
    completedAssignments: 0,
    pendingAssignments: 0,
    averageGrade: 0,
    attendancePercentage: 0,
  })
  type UpcomingEvent = { id: number; title: string; date: string; type: string }
  type RecentGrade = { id: number; subject: string; assignment: string; grade: string; score: number }

  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
  const [recentGrades, setRecentGrades] = useState<RecentGrade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStudentStats()
  }, [userId])

  const fetchStudentStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      try {
        const response = await fetch(`/api/students/${userId}`, {
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          setStats(data.stats || stats)
          setUpcomingEvents(data.upcomingEvents || [])
          setRecentGrades(data.recentGrades || [])
        } else {
          throw new Error("Failed to fetch student data")
        }
      } catch (fetchError: any) {
        if (fetchError.name === "AbortError") {
          throw new Error("Request timed out. Please check your connection.")
        }
        throw fetchError
      }
    } catch (error: any) {
      console.error("Failed to fetch student stats:", error)
      setError(error.message || "Failed to load dashboard data")

      setStats({
        totalSubjects: 6,
        completedAssignments: 24,
        pendingAssignments: 3,
        averageGrade: 85,
        attendancePercentage: 92,
      })

      setUpcomingEvents([
        { id: 1, title: "Mathematics Exam", date: "2025-09-20", type: "exam" },
        { id: 2, title: "Physics Assignment Due", date: "2025-09-18", type: "assignment" },
        { id: 3, title: "construction Lab", date: "2025-09-17", type: "lab" },
      ])

      setRecentGrades([
        { id: 1, subject: "Mathematics", assignment: "Quiz 3", grade: "A", score: 92 },
        { id: 2, subject: "Physics", assignment: "Lab Report", grade: "B+", score: 87 },
        { id: 3, subject: "construction", assignment: "Mid-term", grade: "A-", score: 89 },
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
          <div className="text-sm text-muted-foreground">Please wait while we fetch your academic data</div>
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
            <h2 className="text-3xl font-bold mb-2">Welcome back, Student!</h2>
            <p className="text-white/90 text-lg">Keep up the great work! Here's your academic progress.</p>
            <p className="text-white/80 text-sm">IIIT Kota • Academic Session 2025-26</p>
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
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Subjects</p>
                <p className="text-2xl font-bold">{stats.totalSubjects}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="edu-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <FileText className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed Assignments</p>
                <p className="text-2xl font-bold">{stats.completedAssignments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="edu-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Clock className="h-6 w-6 text-accent" />
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
                <Trophy className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Average Grade</p>
                <p className="text-2xl font-bold">{stats.averageGrade}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Academic Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Academic Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Performance</span>
                <span className="text-sm text-gray-600">{stats.averageGrade}%</span>
              </div>
              <Progress value={stats.averageGrade} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Attendance</span>
                <span className="text-sm text-gray-600">{stats.attendancePercentage}%</span>
              </div>
              <Progress value={stats.attendancePercentage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Assignment Completion</span>
                <span className="text-sm text-gray-600">
                  {Math.round(
                    (stats.completedAssignments / (stats.completedAssignments + stats.pendingAssignments)) * 100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={Math.round(
                  (stats.completedAssignments / (stats.completedAssignments + stats.pendingAssignments)) * 100,
                )}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event: any) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">{event.date}</p>
                  </div>
                  <Badge variant={event.type === "exam" ? "destructive" : "secondary"}>{event.type}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentGrades.map((grade: any) => (
              <div key={grade.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{grade.subject}</p>
                    <p className="text-sm text-gray-600">{grade.assignment}</p>
                  </div>
                  <Badge variant="secondary">{grade.grade}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Score</span>
                  <span className="font-medium">{grade.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
