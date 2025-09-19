"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react"
import { StudentForm } from "@/components/students/student-form"
import { TableSkeleton } from "@/components/ui/loading-skeleton"
import { useToast } from "@/hooks/use-toast"
import type { Student } from "@/lib/types"

export default function StudentsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  })

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchStudents(1, query)
    }, 300),
    [],
  )

  useEffect(() => {
    if (user && ["admin", "teacher"].includes(user.role)) {
      fetchStudents()
    }
  }, [user])

  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  const fetchStudents = async (page = 1, search = searchQuery) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
      })

      const response = await fetch(`/api/students?${params}`)
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Failed to fetch students:", error)
      toast({
        title: "Error",
        description: "Failed to fetch students",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStudentSaved = () => {
    fetchStudents(pagination.page)
    setIsFormOpen(false)
    setSelectedStudent(null)
    toast({
      title: "Success",
      description: selectedStudent ? "Student updated successfully" : "Student added successfully",
    })
  }

  const handleDeleteStudent = async () => {
    if (!deleteStudent) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/students/${deleteStudent.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchStudents(pagination.page)
        toast({
          title: "Success",
          description: "Student deleted successfully",
        })
      } else {
        throw new Error("Failed to delete student")
      }
    } catch (error) {
      console.error("Delete student error:", error)
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteStudent(null)
    }
  }

  // Memoized filtered students for better performance
  const displayStudents = useMemo(() => students, [students])

  if (!user || !["admin", "teacher"].includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  if (loading && students.length === 0) {
    return (
      <div className="p-6">
        <TableSkeleton />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage student records and information</p>
        </div>
        {user.role === "admin" && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedStudent ? "Edit Student" : "Add New Student"}</DialogTitle>
                <DialogDescription>
                  {selectedStudent ? "Update student information" : "Enter student details to add them to the system"}
                </DialogDescription>
              </DialogHeader>
              <StudentForm student={selectedStudent} onSaved={handleStudentSaved} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Students ({pagination.total})</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search students..."
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
                <TableHead>Name</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.section}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{student.gender}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {user.role === "admin" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedStudent(student)
                              setIsFormOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteStudent(student)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {displayStudents.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-500">No students found</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} students
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchStudents(pagination.page - 1)}
                  disabled={pagination.page === 1 || loading}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchStudents(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteStudent} onOpenChange={() => setDeleteStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deleteStudent?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStudent} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }) as T
}
