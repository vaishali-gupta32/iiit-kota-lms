"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface GenderChartProps {
  maleCount: number
  femaleCount: number
}

export function GenderChart({ maleCount, femaleCount }: GenderChartProps) {
  const data = [
    { name: "Boys", value: maleCount, color: "#60A5FA" },
    { name: "Girls", value: femaleCount, color: "#F87171" },
  ]

  const total = maleCount + femaleCount

  return (
    <div className="relative w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-500">{maleCount.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Boys (55%)</div>
          <div className="mt-2">
            <div className="text-2xl font-bold text-red-400">{femaleCount.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Girls (45%)</div>
          </div>
        </div>
      </div>
    </div>
  )
}
