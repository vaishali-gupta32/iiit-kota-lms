"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Student } from "@/lib/types"

interface StudentFormProps {
  student?: Student | null
  onSaved: () => void
}

export function StudentForm({ student, onSaved }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: "", // Added name field to form data
    rollNumber: "",
    class: "",
    section: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    subjects: [] as string[],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "", // Include name in form initialization
        rollNumber: student.rollNumber || "",
        class: student.class || "",
        section: student.section || "",
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split("T")[0] : "",
        gender: student.gender || "",
        phone: student.phone || "",
        address: student.address || "",
        subjects: student.subjects || [],
      })
    }
  }, [student])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = student ? `/api/students/${student.id}` : "/api/students"
      const method = student ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: new Date(formData.dateOfBirth),
          admissionDate: new Date(),
          parentIds: [],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save student")
      }

      onSaved()
    } catch (err: any) {
      setError(err.message || "Failed to save student")
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
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter student's full name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="rollNumber">Roll Number</Label>
          <Input
            id="rollNumber"
            value={formData.rollNumber}
            onChange={(e) => handleInputChange("rollNumber", e.target.value)}
            placeholder="Enter roll number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="class">Class</Label>
          <Select value={formData.class} onValueChange={(value) => handleInputChange("class", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTech 1st Year">BTech 1st Year</SelectItem>
              <SelectItem value="BTech 2nd Year">BTech 2nd Year</SelectItem>
              <SelectItem value="BTech 3rd Year">BTech 3rd Year</SelectItem>
              <SelectItem value="BTech 4th Year">BTech 4th Year</SelectItem>
              <SelectItem value="MTech 1st Year">MTech 1st Year</SelectItem>
              <SelectItem value="MTech 2nd Year">MTech 2nd Year</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="section">Section</Label>
          <Select value={formData.section} onValueChange={(value) => handleInputChange("section", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">A</SelectItem>
              <SelectItem value="B">B</SelectItem>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="D">D</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          placeholder="Enter address"
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : student ? "Update Student" : "Add Student"}
        </Button>
      </div>
    </form>
  )
}
