import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // 👉 In real app, you’d fetch from MongoDB using teacherId = id
    // For now, return mock data
    const stats = {
      totalStudents: 156,
      totalClasses: 8,
      pendingAssignments: 12,
      upcomingLessons: 5,
    }

    const recentActivities = [
      { id: 1, type: "assignment", title: "Mathematics Assignment 3", status: "pending", date: "2025-09-15" },
      { id: 2, type: "lesson", title: "Physics - Quantum Mechanics", status: "scheduled", date: "2025-09-16" },
      { id: 3, type: "exam", title: "Construction Mid-term", status: "graded", date: "2025-09-14" },
    ]

    return NextResponse.json({ stats, recentActivities })
  } catch (error) {
    console.error("Get teacher stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
