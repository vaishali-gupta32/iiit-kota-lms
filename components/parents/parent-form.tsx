"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Parent } from "@/lib/types"

interface ParentFormProps {
  parent?: Parent | null
  onSaved: () => void
}

export function ParentForm({ parent, onSaved }: ParentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    occupation: "",
    phone: "",
    address: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (parent) {
      setFormData({
        name: parent.name || "",
        occupation: parent.occupation || "",
        phone: parent.phone || "",
        address: parent.address || "",
      })
    }
  }, [parent])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const url = parent ? `/api/parents/${parent.id}` : "/api/parents"
      const method = parent ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          children: [], // Will be linked separately
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save parent")
      }

      onSaved()
    } catch (err: any) {
      setError(err.message || "Failed to save parent")
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
          placeholder="Enter parent's full name"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Select value={formData.occupation} onValueChange={(value) => handleInputChange("occupation", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select occupation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Engineer">Engineer</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Teacher">Teacher</SelectItem>
              <SelectItem value="Businessman">Businessman</SelectItem>
              <SelectItem value="Government Officer">Government Officer</SelectItem>
              <SelectItem value="Lawyer">Lawyer</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
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
          {loading ? "Saving..." : parent ? "Update Parent" : "Add Parent"}
        </Button>
      </div>
    </form>
  )
}
