import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { Student } from "@/lib/types"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()

    // Find the student
    const student = await db
      .collection<Student>(COLLECTIONS.STUDENTS)
      .findOne({ id: params.id })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Dummy stats/events/grades for now (replace with real DB queries)
    const stats = {
      totalSubjects: 6,
      completedAssignments: 24,
      pendingAssignments: 3,
      averageGrade: 85,
      attendancePercentage: 92,
    }

    const upcomingEvents = [
      { id: 1, title: "Mathematics Exam", date: "2025-09-20", type: "exam" },
      { id: 2, title: "Physics Assignment Due", date: "2025-09-18", type: "assignment" },
      { id: 3, title: "Construction Lab", date: "2025-09-17", type: "lab" },
    ]

    const recentGrades = [
      { id: 1, subject: "Mathematics", assignment: "Quiz 3", grade: "A", score: 92 },
      { id: 2, subject: "Physics", assignment: "Lab Report", grade: "B+", score: 87 },
      { id: 3, subject: "Construction", assignment: "Mid-term", grade: "A-", score: 89 },
    ]

    return NextResponse.json({ stats, upcomingEvents, recentGrades })
  } catch (error) {
    console.error("Fetch student error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
