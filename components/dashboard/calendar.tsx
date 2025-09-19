"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8)) // September 2025

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Adjust for Monday start

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date()
  const isCurrentMonth =
    currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={() => navigateMonth("prev")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold text-lg">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <Button variant="ghost" size="sm" onClick={() => navigateMonth("next")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              text-center py-2 text-sm cursor-pointer hover:bg-gray-100 rounded
              ${day === null ? "invisible" : ""}
              ${isCurrentMonth && day === today.getDate() ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
              ${day && [6, 13, 20, 27].includes(day) ? "text-red-500" : ""}
              ${day && [7, 14, 21, 28].includes(day) ? "text-red-500" : ""}
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}
