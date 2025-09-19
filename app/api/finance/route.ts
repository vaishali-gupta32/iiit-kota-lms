import { type NextRequest, NextResponse } from "next/server"
import { getUserFromRequest } from "@/lib/auth"
import { getDatabase, COLLECTIONS } from "@/lib/mongodb"
import type { FinanceRecord } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const year = searchParams.get("year")

    const db = await getDatabase()
    const query: any = {}

    if (type) query.type = type
    if (year) {
      const startDate = new Date(`${year}-01-01`)
      const endDate = new Date(`${year}-12-31`)
      query.date = { $gte: startDate, $lte: endDate }
    }

    const finance = await db.collection<FinanceRecord>(COLLECTIONS.FINANCE).find(query).sort({ date: -1 }).toArray()

    return NextResponse.json({ finance })
  } catch (error) {
    console.error("Get finance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request)
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const financeData = await request.json()
    const db = await getDatabase()

    const newFinance: FinanceRecord = {
      id: uuidv4(),
      ...financeData,
      date: new Date(financeData.date),
      createdBy: user.userId,
      createdAt: new Date(),
    }

    await db.collection<FinanceRecord>(COLLECTIONS.FINANCE).insertOne(newFinance)

    return NextResponse.json({ finance: newFinance }, { status: 201 })
  } catch (error) {
    console.error("Create finance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
