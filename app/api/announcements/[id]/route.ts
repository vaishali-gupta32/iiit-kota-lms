import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { Announcement } from "@/lib/types"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !["admin", "teacher"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const announcementData = await request.json()
    const db = await getDatabase()

    const updatedAnnouncement = await db
      .collection<Announcement>(COLLECTIONS.ANNOUNCEMENTS)
      .findOneAndUpdate(
        { id: params.id },
        { $set: { ...announcementData, updatedAt: new Date() } },
        { returnDocument: "after" },
      )

    if (!updatedAnnouncement) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    return NextResponse.json({ announcement: updatedAnnouncement })
  } catch (error) {
    console.error("Update announcement error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !["admin", "teacher"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const result = await db.collection<Announcement>(COLLECTIONS.ANNOUNCEMENTS).deleteOne({ id: params.id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Announcement deleted successfully" })
  } catch (error) {
    console.error("Delete announcement error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
