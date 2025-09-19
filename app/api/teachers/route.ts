import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { Teacher } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !["admin", "teacher"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const teachers = await db.collection<Teacher>(COLLECTIONS.TEACHERS).find({}).toArray()

    return NextResponse.json({ teachers })
  } catch (error) {
    console.error("Get teachers error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const teacherData = await request.json()
    const db = await getDatabase()

    const newTeacher: Teacher = {
      id: uuidv4(),
      ...teacherData,
    }

    await db.collection<Teacher>(COLLECTIONS.TEACHERS).insertOne(newTeacher)

    return NextResponse.json({ teacher: newTeacher }, { status: 201 })
  } catch (error) {
    console.error("Create teacher error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
