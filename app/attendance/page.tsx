"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Filter } from "lucide-react"
import { format } from "date-fns"
import type { AttendanceRecord } from "@/lib/types"

export default function AttendancePage() {
  const { user } = useAuth()
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))

  useEffect(() => {
    if (user) {
      fetchAttendance()
    }
  }, [user, selectedDate])

  const fetchAttendance = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedDate) params.append("date", selectedDate)

      const response = await fetch(`/api/attendance?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAttendance(data.attendance)
      }
    } catch (error) {
      console.error("Failed to fetch attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>
      case "absent":
        return <Badge className="bg-red-100 text-red-800">Absent</Badge>
      case "late":
        return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading attendance...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600">Track and manage student attendance</p>
        </div>
        {["admin", "teacher"].includes(user?.role || "") && (
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendance Records</CardTitle>
            <div className="flex items-center gap-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40"
              />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Marked By</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{format(new Date(record.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="font-medium">{record.studentId}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>{record.subject || "General"}</TableCell>
                  <TableCell>{record.markedBy}</TableCell>
                  <TableCell>{format(new Date(record.createdAt), "HH:mm")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {attendance.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No attendance records found for the selected date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
