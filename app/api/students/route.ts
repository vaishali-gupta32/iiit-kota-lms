import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { Student } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !["admin", "teacher"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search") || ""

    const db = await getDatabase()
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { rollNumber: { $regex: search, $options: "i" } },
            { class: { $regex: search, $options: "i" } },
            { section: { $regex: search, $options: "i" } },
          ],
        }
      : {}

    const [students, total] = await Promise.all([
      db
        .collection<Student>(COLLECTIONS.STUDENTS)
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      db.collection<Student>(COLLECTIONS.STUDENTS).countDocuments(query),
    ])

    return NextResponse.json({
      students,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get students error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentData = await request.json()
    const db = await getDatabase()

    const newStudent: Student = {
      id: uuidv4(),
      ...studentData,
    }

    await db.collection<Student>(COLLECTIONS.STUDENTS).insertOne(newStudent)

    return NextResponse.json({ student: newStudent }, { status: 201 })
  } catch (error) {
    console.error("Create student error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
