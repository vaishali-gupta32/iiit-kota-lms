import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const { db } = await connectToDatabase()

    const filter: any = { userId: decoded.userId }
    if (unreadOnly) {
      filter.read = false
    }

    // Also check for expired notifications
    filter.$or = [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: new Date() } }]

    const notifications = await db
      .collection("notifications")
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()

    const unreadCount = await db.collection("notifications").countDocuments({
      userId: decoded.userId,
      read: false,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

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

    // Only admins and teachers can create notifications
    if (!["admin", "teacher"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { userId, type, title, message, actionUrl, metadata, expiresAt } = await request.json()

    if (!userId || !type || !title || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    const notification = {
      id: uuidv4(),
      userId,
      type,
      title,
      message,
      read: false,
      actionUrl,
      metadata,
      createdAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    }

    await db.collection("notifications").insertOne(notification)

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
