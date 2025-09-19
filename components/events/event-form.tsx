"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Event } from "@/lib/types"

interface EventFormProps {
  event?: Event | null
  onSaved: () => void
}

export function EventForm({ event, onSaved }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    location: "",
    type: "academic" as "academic" | "cultural" | "sports" | "other",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (event) {
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)

      setFormData({
        title: event.title || "",
        description: event.description || "",
        startDate: startDate.toISOString().split("T")[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split("T")[0],
        endTime: endDate.toTimeString().slice(0, 5),
        location: event.location || "",
        type: event.type || "academic",
      })
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`)
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`)

      const url = event ? `/api/events/${event.id}` : "/api/events"
      const method = event ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          startDate: startDateTime,
          endDate: endDateTime,
          location: formData.location,
          type: formData.type,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save event")
      }

      onSaved()
    } catch (err: any) {
      setError(err.message || "Failed to save event")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Enter event title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter event description"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Event Type</Label>
          <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Enter location"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange("startTime", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange("endDate", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange("endTime", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
