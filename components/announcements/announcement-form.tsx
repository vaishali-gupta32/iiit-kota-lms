"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Announcement } from "@/lib/types"

interface AnnouncementFormProps {
  announcement?: Announcement | null
  onSaved: () => void
}

export function AnnouncementForm({ announcement, onSaved }: AnnouncementFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info" as "info" | "warning" | "success" | "error",
    targetRoles: [] as string[],
    expiresAt: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const roleOptions = [
    { id: "admin", label: "Admin" },
    { id: "teacher", label: "Teachers" },
    { id: "student", label: "Students" },
    { id: "parent", label: "Parents" },
    { id: "all", label: "All Users" },
  ]

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || "",
        content: announcement.content || "",
        type: announcement.type || "info",
        targetRoles: announcement.targetRoles || [],
        expiresAt: announcement.expiresAt ? new Date(announcement.expiresAt).toISOString().split("T")[0] : "",
      })
    }
  }, [announcement])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = announcement ? `/api/announcements/${announcement.id}` : "/api/announcements"
      const method = announcement ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save announcement")
      }

      onSaved()
    } catch (err: any) {
      setError(err.message || "Failed to save announcement")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleRoleChange = (roleId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      targetRoles: checked ? [...prev.targetRoles, roleId] : prev.targetRoles.filter((role) => role !== roleId),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Enter announcement title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => handleInputChange("content", e.target.value)}
          placeholder="Enter announcement content"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt">Expires At (Optional)</Label>
          <Input
            id="expiresAt"
            type="date"
            value={formData.expiresAt}
            onChange={(e) => handleInputChange("expiresAt", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Target Audience</Label>
        <div className="grid grid-cols-2 gap-4">
          {roleOptions.map((role) => (
            <div key={role.id} className="flex items-center space-x-2">
              <Checkbox
                id={role.id}
                checked={formData.targetRoles.includes(role.id)}
                onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
              />
              <Label htmlFor={role.id} className="text-sm font-normal">
                {role.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : announcement ? "Update Announcement" : "Create Announcement"}
        </Button>
      </div>
    </form>
  )
}
