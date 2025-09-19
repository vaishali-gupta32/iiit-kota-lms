import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

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
    const query = searchParams.get("q")
    const role = searchParams.get("role")

    if (!query || query.length < 2) {
      return NextResponse.json({ users: [] })
    }

    const { db } = await connectToDatabase()

    const searchFilter = {
      id: { $ne: decoded.userId }, // Exclude current user
      $or: [{ name: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
    }

    if (role && role !== "all") {
      searchFilter.role = role
    }

    const users = await db
      .collection("users")
      .find(searchFilter, {
        projection: { id: 1, name: 1, email: 1, role: 1, avatar: 1 },
      })
      .limit(10)
      .toArray()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error searching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
