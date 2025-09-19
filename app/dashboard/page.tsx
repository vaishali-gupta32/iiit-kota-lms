"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { StatsCard } from "@/components/dashboard/stats-cards"
import { GenderChart } from "@/components/dashboard/gender-chart"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { FinanceChart } from "@/components/dashboard/finance-chart"
import { Calendar } from "@/components/dashboard/calendar"
import { Announcements } from "@/components/dashboard/announcements"
import { Events } from "@/components/dashboard/events"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import { TeacherDashboard } from "@/components/dashboard/teacher-dashboard"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { ParentDashboard } from "@/components/dashboard/parent-dashboard"
import { GraduationCap, Users, UserCheck, Building } from "lucide-react"

interface DashboardStats {
  counts: {
    students: number
    teachers: number
    parents: number
    staffs: number
  }
  gender: {
    male: number
    female: number
  }
  attendance: any[]
  finance: any[]
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [announcements, setAnnouncements] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  if (!user) return;

  if (user.role === "admin") {
    fetchDashboardData();
  } else {
    // For teacher/student/parent we don't need stats, but still stop loading
    setLoading(false);
  }
}, [user]);


  const fetchDashboardData = async () => {
    try {
      const [statsRes, announcementsRes, eventsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/announcements"),
        fetch("/api/events"),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (announcementsRes.ok) {
        const announcementsData = await announcementsRes.json()
        setAnnouncements(announcementsData.announcements.slice(0, 4))
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json()
        setEvents(eventsData.events.slice(0, 3))
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Process attendance data for chart
  const processAttendanceData = (attendanceStats: any[]) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    return days.map((day) => ({
      day,
      present: Math.floor(Math.random() * 100) + 50,
      absent: Math.floor(Math.random() * 50) + 10,
    }))
  }

  // Process finance data for chart
  const processFinanceData = (financeStats: any[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months.map((month) => ({
      month,
      income: Math.floor(Math.random() * 5000) + 2000,
      expense: Math.floor(Math.random() * 3000) + 1000,
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const renderDashboard = () => {
    switch (user.role) {
      case "teacher":
        return <TeacherDashboard userId={user.id} />
      case "student":
        return <StudentDashboard userId={user.id} />
      case "parent":
        return <ParentDashboard userId={user.id} />
      case "admin":
        return (
          <div className="min-h-screen bg-background">
            <div className="p-6 space-y-8">
              <div className="iiit-gradient rounded-xl p-8 text-white shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <GraduationCap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold text-white mb-2">IIIT Kota</h1>
                      <p className="text-white/90 text-lg font-medium">Learning Management System</p>
                      <p className="text-white/80 text-sm">Indian Institute of Information Technology</p>
                    </div>
                  </div>
                  <div className="text-right bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <div className="text-white/90 font-semibold mb-1">Academic Session 2025-26</div>
                    <div className="text-white/80 text-sm">Odd Semester Registration</div>
                    <div className="text-white/80 text-sm">Room No. 214 • Engineering Block</div>
                    <div className="mt-3 px-3 py-1 bg-secondary rounded-full text-secondary-foreground text-xs font-medium">
                      Registration Open
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Cards with better spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard title="Students" count={stats?.counts.students || 0} year="2025/26" />
                <StatsCard title="Teachers" count={stats?.counts.teachers || 0} year="2025/26" />
                <StatsCard title="Parents" count={stats?.counts.parents || 0} year="2025/26" />
                <StatsCard title="Staffs" count={stats?.counts.staffs || 0} year="2025/26" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column with enhanced cards */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Students and Attendance Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Enhanced Students Gender Chart */}
                    <Card className="edu-card">
                      <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          Students Distribution
                        </CardTitle>
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <GenderChart maleCount={stats?.gender.male || 0} femaleCount={stats?.gender.female || 0} />
                      </CardContent>
                    </Card>

                    {/* Enhanced Attendance Chart */}
                    <Card className="edu-card">
                      <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="text-xl font-semibold flex items-center gap-2">
                          <UserCheck className="h-5 w-5 text-primary" />
                          Weekly Attendance
                        </CardTitle>
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6 mb-6">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-primary rounded-full"></div>
                            <span className="text-sm font-medium text-muted-foreground">Present</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-secondary rounded-full"></div>
                            <span className="text-sm font-medium text-muted-foreground">Absent</span>
                          </div>
                        </div>
                        <AttendanceChart data={processAttendanceData(stats?.attendance || [])} />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Enhanced Finance Chart */}
                  <Card className="edu-card">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                      <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        Financial Overview
                      </CardTitle>
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-6 mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="text-sm font-medium text-muted-foreground">Income</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-secondary rounded-full"></div>
                          <span className="text-sm font-medium text-muted-foreground">Expense</span>
                        </div>
                      </div>
                      <FinanceChart data={processFinanceData(stats?.finance || [])} />
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Right Column */}
                <div className="space-y-6">
                  {/* Calendar with better styling */}
                  <div className="edu-card p-6">
                    <Calendar />
                  </div>

                  {/* Events with enhanced design */}
                  <div className="edu-card p-6">
                    <Events events={events} />
                  </div>
                </div>
              </div>

              {/* Enhanced Announcements */}
              <div className="edu-card p-6">
                <Announcements announcements={announcements} />
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Welcome to IIIT Kota LMS</h1>
              <p className="text-muted-foreground max-w-md">
                Your personalized dashboard will appear here based on your role in the learning management system.
              </p>
            </div>
          </div>
        )
    }
  }

  return <div className="min-h-screen bg-background">{renderDashboard()}</div>
}
