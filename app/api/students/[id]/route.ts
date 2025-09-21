import { type NextRequest, NextResponse } from "next/server";
import { getDatabase, COLLECTIONS } from "@/lib/mongodb";
import type { Student } from "@/lib/types";

// Keep this, it's still good practice for dynamic API routes.
export const dynamic = 'force-dynamic';

// The props is a single object, and params is a Promise within it.
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Await the params promise to get the actual object
    const params = await props.params;
    
    // 2. Now you can safely access the id
    const { id } = params;

    const db = await getDatabase();

    // Find the student
    const student = await db
      .collection<Student>(COLLECTIONS.STUDENTS)
      .findOne({ id: id });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // ... (rest of your code for stats, events, grades) ...
    const stats = {
      totalSubjects: 6,
      completedAssignments: 24,
      pendingAssignments: 3,
      averageGrade: 85,
      attendancePercentage: 92,
    };
    // ... (upcomingEvents, recentGrades) ...
    const upcomingEvents = [
      { id: 1, title: "Mathematics Exam", date: "2025-09-20", type: "exam" },
      // ...
    ];
    const recentGrades = [
       { id: 1, subject: "Mathematics", assignment: "Quiz 3", grade: "A", score: 92 },
       // ...
    ];


    return NextResponse.json({ stats, upcomingEvents, recentGrades });

  } catch (error) {
    console.error("Fetch student error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}