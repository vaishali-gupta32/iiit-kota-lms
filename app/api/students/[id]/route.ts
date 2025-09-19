import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { Student } from "@/lib/types"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const studentData = await request.json()
    const db = await getDatabase()

    const updatedStudent = await db
      .collection<Student>(COLLECTIONS.STUDENTS)
      .findOneAndUpdate(
        { id: params.id },
        { $set: { ...studentData, updatedAt: new Date() } },
        { returnDocument: "after" },
      )

    if (!updatedStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ student: updatedStudent })
  } catch (error) {
    console.error("Update student error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const result = await db.collection<Student>(COLLECTIONS.STUDENTS).deleteOne({ id: params.id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Student deleted successfully" })
  } catch (error) {
    console.error("Delete student error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
