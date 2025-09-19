"use client"

import { useEffect, useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Calendar, MapPin, Clock } from "lucide-react"
import { EventForm } from "@/components/events/event-form"
import { format } from "date-fns"
import type { Event } from "@/lib/types"

export default function EventsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchEvents()
    }
  }, [user])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events")
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events)
      }
    } catch (error) {
      console.error("Failed to fetch events:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEventSaved = () => {
    fetchEvents()
    setIsFormOpen(false)
    setSelectedEvent(null)
  }

  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getTypeColor = (type: string) => {
    switch (type) {
      case "academic":
        return "bg-blue-100 text-blue-800"
      case "cultural":
        return "bg-purple-100 text-purple-800"
      case "sports":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">Discover and manage school events and activities</p>
        </div>
        {["admin", "teacher"].includes(user?.role || "") && (
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{selectedEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
                <DialogDescription>
                  {selectedEvent ? "Update event details" : "Create a new event for the school community"}
                </DialogDescription>
              </DialogHeader>
              <EventForm event={selectedEvent} onSaved={handleEventSaved} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Events ({filteredEvents.length})</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                    </div>
                    {["admin", "teacher"].includes(user?.role || "") && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event)
                            setIsFormOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(event.startDate), "MMM dd, yyyy")} -{" "}
                        {format(new Date(event.endDate), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(event.startDate), "h:mm a")} - {format(new Date(event.endDate), "h:mm a")}
                      </span>
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No events found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
