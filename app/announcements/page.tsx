"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Search, Plus, Edit, Trash2, Megaphone } from "lucide-react"
import { AnnouncementForm } from "@/components/announcements/announcement-form"
import { CardSkeleton } from "@/components/ui/loading-skeleton"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import type { Announcement } from "@/lib/types"

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteAnnouncement, setDeleteAnnouncement] = useState<Announcement | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  })

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchAnnouncements(1, query)
    }, 300),
    [],
  )

  useEffect(() => {
    if (user) {
      fetchAnnouncements()
    }
  }, [user])

  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  const fetchAnnouncements = async (page = 1, search = searchQuery) => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
      })

      const response = await fetch(`/api/announcements?${params}`)
      if (response.ok) {
        const data = await response.json()
        setAnnouncements(data.announcements)
        setPagination(data.pagination)
      } else {
        throw new Error("Failed to fetch announcements")
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAnnouncementSaved = () => {
    fetchAnnouncements(pagination.page)
    setIsFormOpen(false)
    setSelectedAnnouncement(null)
    toast({
      title: "Success",
      description: selectedAnnouncement ? "Announcement updated successfully" : "Announcement created successfully",
    })
  }

  const handleDeleteAnnouncement = async () => {
    if (!deleteAnnouncement) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/announcements/${deleteAnnouncement.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchAnnouncements(pagination.page)
        toast({
          title: "Success",
          description: "Announcement deleted successfully",
        })
      } else {
        throw new Error("Failed to delete announcement")
      }
    } catch (error) {
      console.error("Delete announcement error:", error)
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
      setDeleteAnnouncement(null)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  if (loading && announcements.length === 0) {
    return (
      <div className="p-6">
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600">Stay updated with important school announcements</p>
        </div>
        {["admin", "teacher"].includes(user?.role || "") && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedAnnouncement ? "Edit Announcement" : "Create New Announcement"}</DialogTitle>
                <DialogDescription>
                  {selectedAnnouncement
                    ? "Update announcement details"
                    : "Create a new announcement to share with the school community"}
                </DialogDescription>
              </DialogHeader>
              <AnnouncementForm announcement={selectedAnnouncement} onSaved={handleAnnouncementSaved} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Announcements ({pagination.total})</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search announcements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className={`border-l-4 ${getTypeColor(announcement.type)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Megaphone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{announcement.title}</h3>
                          <Badge className={getTypeColor(announcement.type)}>{announcement.type}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{announcement.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Posted: {format(new Date(announcement.createdAt), "MMM dd, yyyy")}</span>
                          <span>Target: {announcement.targetRoles.join(", ")}</span>
                          {announcement.expiresAt && (
                            <span>Expires: {format(new Date(announcement.expiresAt), "MMM dd, yyyy")}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {["admin", "teacher"].includes(user?.role || "") && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedAnnouncement(announcement)
                            setIsFormOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteAnnouncement(announcement)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {announcements.length === 0 && !loading && (
            <div className="text-center py-8">
              <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No announcements found</p>
            </div>
          )}

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} announcements
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchAnnouncements(pagination.page - 1)}
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
                  onClick={() => fetchAnnouncements(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteAnnouncement} onOpenChange={() => setDeleteAnnouncement(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteAnnouncement?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAnnouncement} disabled={deleting}>
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
