"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface AttendanceChartProps {
  data: Array<{
    day: string
    present: number
    absent: number
  }>
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
          <Bar dataKey="present" fill="#FCD34D" radius={[4, 4, 0, 0]} />
          <Bar dataKey="absent" fill="#60A5FA" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
