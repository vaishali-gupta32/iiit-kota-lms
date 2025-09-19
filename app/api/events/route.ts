import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { Event } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const events = await db.collection<Event>(COLLECTIONS.EVENTS).find({}).sort({ startDate: 1 }).toArray()

    return NextResponse.json({ events })
  } catch (error) {
    console.error("Get events error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || !["admin", "teacher"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const eventData = await request.json()
    const db = await getDatabase()

    const newEvent: Event = {
      id: uuidv4(),
      ...eventData,
      startDate: new Date(eventData.startDate),
      endDate: new Date(eventData.endDate),
      createdBy: user.userId,
      createdAt: new Date(),
    }

    await db.collection<Event>(COLLECTIONS.EVENTS).insertOne(newEvent)

    return NextResponse.json({ event: newEvent }, { status: 201 })
  } catch (error) {
    console.error("Create event error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
