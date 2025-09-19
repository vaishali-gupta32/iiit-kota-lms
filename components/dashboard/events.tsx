"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"

interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location?: string
}

interface EventsProps {
  events: Event[]
}

export function Events({ events }: EventsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Events</CardTitle>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border-l-4 border-l-blue-500 pl-4 py-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>{format(new Date(event.startDate), "h:mm a")}</span>
                  <span>-</span>
                  <span>{format(new Date(event.endDate), "h:mm a")}</span>
                </div>
              </div>
              <span className="text-xs text-gray-500">{format(new Date(event.startDate), "dd-MM-yyyy")}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
