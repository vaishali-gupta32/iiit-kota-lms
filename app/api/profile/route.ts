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

    const { db } = await connectToDatabase()

    // Get user basic info
    const user = await db.collection("users").findOne({ id: decoded.userId })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get user profile
    const profile = await db.collection("profiles").findOne({ userId: decoded.userId })

    return NextResponse.json({ user, profile })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const profileData = await request.json()
    const { db } = await connectToDatabase()

    // Update user basic info if provided
    if (profileData.name || profileData.email) {
      await db.collection("users").updateOne(
        { id: decoded.userId },
        {
          $set: {
            ...(profileData.name && { name: profileData.name }),
            ...(profileData.email && { email: profileData.email }),
            updatedAt: new Date(),
          },
        },
      )
    }

    // Update or create profile
    const profileUpdate = {
      userId: decoded.userId,
      personalInfo: profileData.personalInfo || {},
      contactInfo: profileData.contactInfo || {},
      emergencyContact: profileData.emergencyContact || {},
      preferences: profileData.preferences || {},
      avatar: profileData.avatar,
      updatedAt: new Date(),
    }

    const existingProfile = await db.collection("profiles").findOne({ userId: decoded.userId })

    if (existingProfile) {
      await db.collection("profiles").updateOne({ userId: decoded.userId }, { $set: profileUpdate })
    } else {
      await db.collection("profiles").insertOne({
        id: uuidv4(),
        ...profileUpdate,
        createdAt: new Date(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
