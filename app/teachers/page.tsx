"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import type { Teacher } from "@/lib/types"

export default function TeachersPage() {
  const { user } = useAuth()
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchTeachers()
    }
  }, [user])

  const fetchTeachers = async () => {
    try {
      const response = await fetch("/api/teachers")
      if (response.ok) {
        const data = await response.json()
        setTeachers(data.teachers)
      }
    } catch (error) {
      console.error("Failed to fetch teachers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.department?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading teachers...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600">Manage teacher records and information</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Teachers ({filteredTeachers.length})</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.employeeId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{teacher.department}</Badge>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(teacher.subjects) ? teacher.subjects.join(", ") : teacher.subjects}
                  </TableCell>
                  <TableCell>{teacher.experience} years</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No teachers found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
