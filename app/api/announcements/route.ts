import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { Announcement } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""

    const db = await getDatabase()

    const roleQuery = {
      $or: [{ targetRoles: { $in: [user.role] } }, { targetRoles: { $in: ["all"] } }],
    }

    const expiryQuery = {
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    }

    const searchQuery = search
      ? {
          $or: [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }],
        }
      : {}

    const finalQuery = {
      $and: [roleQuery, expiryQuery, searchQuery].filter((q) => Object.keys(q).length > 0),
    }

    const [announcements, total] = await Promise.all([
      db
        .collection<Announcement>(COLLECTIONS.ANNOUNCEMENTS)
        .find(finalQuery)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      db.collection<Announcement>(COLLECTIONS.ANNOUNCEMENTS).countDocuments(finalQuery),
    ])

    return NextResponse.json({
      announcements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get announcements error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !["admin", "teacher"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const announcementData = await request.json()
    const db = await getDatabase()

    const newAnnouncement: Announcement = {
      id: uuidv4(),
      title: announcementData.title,
      content: announcementData.content,
      type: announcementData.type || "info",
      targetRoles: announcementData.targetRoles || ["all"],
      createdBy: user.userId,
      createdAt: new Date(),
      expiresAt: announcementData.expiresAt ? new Date(announcementData.expiresAt) : null,
    }

    const result = await db.collection<Announcement>(COLLECTIONS.ANNOUNCEMENTS).insertOne(newAnnouncement)

    if (!result.insertedId) {
      throw new Error("Failed to insert announcement")
    }

    return NextResponse.json({ announcement: newAnnouncement }, { status: 201 })
  } catch (error) {
    console.error("Create announcement error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
