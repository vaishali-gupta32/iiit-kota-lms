import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()

    // Get counts for dashboard cards
    const [studentsCount, teachersCount, parentsCount, staffsCount] = await Promise.all([
      db.collection(COLLECTIONS.STUDENTS).countDocuments(),
      db.collection(COLLECTIONS.TEACHERS).countDocuments(),
      db.collection(COLLECTIONS.PARENTS).countDocuments(),
      db.collection(COLLECTIONS.USERS).countDocuments({ role: "admin" }),
    ])

    // Get gender distribution
    const genderStats = await db
      .collection(COLLECTIONS.STUDENTS)
      .aggregate([
        {
          $group: {
            _id: "$gender",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    const maleCount = genderStats.find((stat) => stat._id === "male")?.count || 0
    const femaleCount = genderStats.find((stat) => stat._id === "female")?.count || 0

    // Get attendance data for the week
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - 6)

    const attendanceStats = await db
      .collection(COLLECTIONS.ATTENDANCE)
      .aggregate([
        {
          $match: {
            date: { $gte: weekStart, $lte: today },
          },
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    // Get finance data for the year
    const currentYear = new Date().getFullYear()
    const yearStart = new Date(`${currentYear}-01-01`)
    const yearEnd = new Date(`${currentYear}-12-31`)

    const financeStats = await db
      .collection(COLLECTIONS.FINANCE)
      .aggregate([
        {
          $match: {
            date: { $gte: yearStart, $lte: yearEnd },
          },
        },
        {
          $group: {
            _id: {
              month: { $month: "$date" },
              type: "$type",
            },
            total: { $sum: "$amount" },
          },
        },
      ])
      .toArray()

    return NextResponse.json({
      counts: {
        students: studentsCount,
        teachers: teachersCount,
        parents: parentsCount,
        staffs: staffsCount,
      },
      gender: {
        male: maleCount,
        female: femaleCount,
      },
      attendance: attendanceStats,
      finance: financeStats,
    })
  } catch (error) {
    console.error("Get dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
