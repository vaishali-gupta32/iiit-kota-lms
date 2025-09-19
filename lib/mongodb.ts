import { MongoClient, type Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/iiit-kota-lms"

let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (db) {
    return { client, db }
  }

  try {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
    db = client.db()

    console.log("Connected to MongoDB")
    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw error
  }
}

export async function getDatabase() {
  if (!db) {
    await connectToDatabase()
  }
  return db
}

// Database collections
export const COLLECTIONS = {
  USERS: "users",
  STUDENTS: "students",
  TEACHERS: "teachers",
  PARENTS: "parents",
  SUBJECTS: "subjects",
  CLASSES: "classes",
  LESSONS: "lessons",
  ASSIGNMENTS: "assignments",
  EXAMS: "exams",
  RESULTS: "results",
  ATTENDANCE: "attendance",
  ANNOUNCEMENTS: "announcements",
  EVENTS: "events",
  MESSAGES: "messages",
  FINANCE: "finance",
} as const
