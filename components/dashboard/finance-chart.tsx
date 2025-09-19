"use client"

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface FinanceChartProps {
  data: Array<{
    month: string
    income: number
    expense: number
  }>
}

export function FinanceChart({ data }: FinanceChartProps) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#60A5FA"
            strokeWidth={3}
            dot={{ fill: "#60A5FA", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#A78BFA"
            strokeWidth={3}
            dot={{ fill: "#A78BFA", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
