import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { db } = await connectToDatabase()

    await db
      .collection("notifications")
      .updateMany({ userId: decoded.userId, read: false }, { $set: { read: true, updatedAt: new Date() } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
