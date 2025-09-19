"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Eye, Users } from "lucide-react"
import type { Parent } from "@/lib/types"

export default function ParentsPage() {
  const { user } = useAuth()
  const [parents, setParents] = useState<Parent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user && ["admin", "teacher"].includes(user.role)) {
      fetchParents()
    }
  }, [user])

  const fetchParents = async () => {
    try {
      // Mock data for demonstration
      setParents([
        {
          id: "1",
          userId: "user1",
          children: ["student1", "student2"],
          occupation: "Engineer",
          phone: "+91-9876543210",
          address: "123 Main St, Kota, Rajasthan",
        },
        {
          id: "2",
          userId: "user2",
          children: ["student3"],
          occupation: "Doctor",
          phone: "+91-9876543211",
          address: "456 Oak Ave, Kota, Rajasthan",
        },
      ])
    } catch (error) {
      console.error("Failed to fetch parents:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredParents = parents.filter(
    (parent) =>
      parent.occupation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.phone?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading parents...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parents</h1>
          <p className="text-gray-600">Manage parent records and communication</p>
        </div>
        {user.role === "admin" && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Parent
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Parents ({filteredParents.length})</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search parents..."
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
                <TableHead>Parent ID</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Children</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParents.map((parent) => (
                <TableRow key={parent.id}>
                  <TableCell className="font-medium">{parent.id}</TableCell>
                  <TableCell>{parent.occupation}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{parent.children.length}</span>
                    </div>
                  </TableCell>
                  <TableCell>{parent.phone}</TableCell>
                  <TableCell className="max-w-xs truncate">{parent.address}</TableCell>
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
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
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

          {filteredParents.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No parents found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
