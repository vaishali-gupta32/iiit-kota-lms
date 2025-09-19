"use client"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, Award } from "lucide-react"

export default function ResultsPage() {
  const { user } = useAuth()

  const results = [
    {
      id: 1,
      subject: "Mathematics",
      exam: "Mid-term Exam",
      score: 92,
      grade: "A",
      date: "2025-09-10",
      maxScore: 100,
    },
    {
      id: 2,
      subject: "Physics",
      exam: "Quiz 3",
      score: 87,
      grade: "B+",
      date: "2025-09-08",
      maxScore: 100,
    },
    {
      id: 3,
      subject: "Computer Science",
      exam: "Assignment 2",
      score: 95,
      grade: "A+",
      date: "2025-09-05",
      maxScore: 100,
    },
  ]

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-800"
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-800"
    if (grade.startsWith("C")) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Results</h1>
          <p className="text-gray-600">View academic performance and grades</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold">A-</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="text-2xl font-bold">91.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Class Rank</p>
                <p className="text-2xl font-bold">3rd</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{result.subject}</h3>
                    <Badge className={getGradeColor(result.grade)}>{result.grade}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{result.exam}</p>
                  <p className="text-xs text-gray-500">{result.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    {result.score}/{result.maxScore}
                  </p>
                  <p className="text-sm text-gray-600">{Math.round((result.score / result.maxScore) * 100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
