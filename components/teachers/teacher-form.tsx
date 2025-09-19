"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Teacher } from "@/lib/types"

interface TeacherFormProps {
  teacher?: Teacher | null
  onSaved: () => void
}

export function TeacherForm({ teacher, onSaved }: TeacherFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    subjects: [] as string[],
    classes: [] as string[],
    department: "",
    qualification: "",
    experience: "",
    phone: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name || "",
        employeeId: teacher.employeeId || "",
        subjects: teacher.subjects || [],
        classes: teacher.classes || [],
        department: teacher.department || "",
        qualification: teacher.qualification || "",
        experience: teacher.experience?.toString() || "",
        phone: teacher.phone || "",
        address: teacher.address || "",
      })
    }
  }, [teacher])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = teacher ? `/api/teachers/${teacher.id}` : "/api/teachers"
      const method = teacher ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          experience: Number.parseInt(formData.experience),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save teacher")
      }

      onSaved()
    } catch (err: any) {
      setError(err.message || "Failed to save teacher")
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
          placeholder="Enter teacher's full name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            id="employeeId"
            value={formData.employeeId}
            onChange={(e) => handleInputChange("employeeId", e.target.value)}
            placeholder="Enter employee ID"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Civil">Civil</SelectItem>
              <SelectItem value="AIDE">AIDE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="qualification">Qualification</Label>
          <Select value={formData.qualification} onValueChange={(value) => handleInputChange("qualification", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="M.Tech">M.Tech</SelectItem>
              <SelectItem value="M.Sc">M.Sc</SelectItem>
              <SelectItem value="M.E">M.E</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience">Experience (Years)</Label>
          <Input
            id="experience"
            type="number"
            value={formData.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            placeholder="Years of experience"
            min="0"
            required
          />
        </div>
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
          {loading ? "Saving..." : teacher ? "Update Teacher" : "Add Teacher"}
        </Button>
      </div>
    </form>
  )
}
