import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import type { NextRequest } from "next/server"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "teacher" | "student" | "parent"
  studentId?: string
  teacherId?: string
  parentId?: string
}

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export function generateToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization")
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7)
  }

  // Also check cookies
  const token = request.cookies.get("auth-token")?.value
  return token || null
}

export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request)
  if (!token) return null

  return verifyToken(token)
}
