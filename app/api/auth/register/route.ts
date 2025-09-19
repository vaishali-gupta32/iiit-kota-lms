import { type NextRequest, NextResponse } from "next/server"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"
import type { User } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!["admin", "teacher", "student", "parent"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const db = await getDatabase()

    // Check if user already exists
    const existingUser = await db.collection<User>(COLLECTIONS.USERS).findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const hashedPassword = await hashPassword(password)
    const userId = uuidv4()

    const newUser: User = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      role: role as User["role"],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection<User>(COLLECTIONS.USERS).insertOne(newUser)

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    })

    const response = NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      token,
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
