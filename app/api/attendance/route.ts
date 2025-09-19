import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { AttendanceRecord } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const date = searchParams.get("date")

    const db = await getDatabase()
    const query: any = {}

    if (studentId) query.studentId = studentId
    if (date) {
      const targetDate = new Date(date)
      const nextDay = new Date(targetDate)
      nextDay.setDate(nextDay.getDate() + 1)
      query.date = { $gte: targetDate, $lt: nextDay }
    }

    const attendance = await db
      .collection<AttendanceRecord>(COLLECTIONS.ATTENDANCE)
      .find(query)
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json({ attendance })
  } catch (error) {
    console.error("Get attendance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !["admin", "teacher"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const attendanceData = await request.json()
    const db = await getDatabase()

    const newAttendance: AttendanceRecord = {
      id: uuidv4(),
      ...attendanceData,
      date: new Date(attendanceData.date),
      markedBy: user.userId,
      createdAt: new Date(),
    }

    await db.collection<AttendanceRecord>(COLLECTIONS.ATTENDANCE).insertOne(newAttendance)

    return NextResponse.json({ attendance: newAttendance }, { status: 201 })
  } catch (error) {
    console.error("Create attendance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
