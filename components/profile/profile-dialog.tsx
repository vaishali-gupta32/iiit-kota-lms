"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Save, User, Phone, Shield, Bell } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import type { UserProfile } from "@/lib/types"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user, token } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    personalInfo: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      nationality: "Indian",
      religion: "",
    },
    contactInfo: {
      phone: "",
      alternatePhone: "",
      email: "",
      alternateEmail: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    preferences: {
      language: "English",
      timezone: "Asia/Kolkata",
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
    },
    avatar: "",
  })

  useEffect(() => {
    if (open && token) {
      fetchProfile()
    }
  }, [open, token])

  const fetchProfile = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setProfile(data.profile)

        // Initialize form with existing data
        setFormData({
          name: data.user?.name || "",
          email: data.user?.email || "",
          personalInfo: {
            firstName: data.profile?.personalInfo?.firstName || "",
            lastName: data.profile?.personalInfo?.lastName || "",
            dateOfBirth: data.profile?.personalInfo?.dateOfBirth
              ? new Date(data.profile.personalInfo.dateOfBirth).toISOString().split("T")[0]
              : "",
            gender: data.profile?.personalInfo?.gender || "",
            bloodGroup: data.profile?.personalInfo?.bloodGroup || "",
            nationality: data.profile?.personalInfo?.nationality || "Indian",
            religion: data.profile?.personalInfo?.religion || "",
          },
          contactInfo: {
            phone: data.profile?.contactInfo?.phone || "",
            alternatePhone: data.profile?.contactInfo?.alternatePhone || "",
            email: data.user?.email || "",
            alternateEmail: data.profile?.contactInfo?.alternateEmail || "",
            address: data.profile?.contactInfo?.address || "",
            city: data.profile?.contactInfo?.city || "",
            state: data.profile?.contactInfo?.state || "",
            pincode: data.profile?.contactInfo?.pincode || "",
          },
          emergencyContact: {
            name: data.profile?.emergencyContact?.name || "",
            relationship: data.profile?.emergencyContact?.relationship || "",
            phone: data.profile?.emergencyContact?.phone || "",
          },
          preferences: {
            language: data.profile?.preferences?.language || "English",
            timezone: data.profile?.preferences?.timezone || "Asia/Kolkata",
            emailNotifications: data.profile?.preferences?.emailNotifications ?? true,
            smsNotifications: data.profile?.preferences?.smsNotifications ?? true,
            pushNotifications: data.profile?.preferences?.pushNotifications ?? true,
          },
          avatar: data.profile?.avatar || data.user?.avatar || "",
        })
      } else {
        setError("Failed to load profile")
      }
    } catch (error) {
      setError("Error loading profile")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess("Profile updated successfully!")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError("Failed to update profile")
      }
    } catch (error) {
      setError("Error updating profile")
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleDirectChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={formData.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {formData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.personalInfo.firstName}
                        onChange={(e) => handleInputChange("personalInfo", "firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.personalInfo.lastName}
                        onChange={(e) => handleInputChange("personalInfo", "lastName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData.personalInfo.dateOfBirth}
                        onChange={(e) => handleInputChange("personalInfo", "dateOfBirth", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.personalInfo.gender}
                        onValueChange={(value) => handleInputChange("personalInfo", "gender", value)}
                      >
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
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select
                        value={formData.personalInfo.bloodGroup}
                        onValueChange={(value) => handleInputChange("personalInfo", "bloodGroup", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={formData.personalInfo.nationality}
                        onChange={(e) => handleInputChange("personalInfo", "nationality", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Primary Phone</Label>
                      <Input
                        id="phone"
                        value={formData.contactInfo.phone}
                        onChange={(e) => handleInputChange("contactInfo", "phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alternatePhone">Alternate Phone</Label>
                      <Input
                        id="alternatePhone"
                        value={formData.contactInfo.alternatePhone}
                        onChange={(e) => handleInputChange("contactInfo", "alternatePhone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Primary Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.contactInfo.email}
                        onChange={(e) => handleInputChange("contactInfo", "email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="alternateEmail">Alternate Email</Label>
                      <Input
                        id="alternateEmail"
                        type="email"
                        value={formData.contactInfo.alternateEmail}
                        onChange={(e) => handleInputChange("contactInfo", "alternateEmail", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.contactInfo.address}
                      onChange={(e) => handleInputChange("contactInfo", "address", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.contactInfo.city}
                        onChange={(e) => handleInputChange("contactInfo", "city", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.contactInfo.state}
                        onChange={(e) => handleInputChange("contactInfo", "state", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.contactInfo.pincode}
                        onChange={(e) => handleInputChange("contactInfo", "pincode", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="emergency" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Contact Name</Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e) => handleInputChange("emergencyContact", "name", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Select
                        value={formData.emergencyContact.relationship}
                        onValueChange={(value) => handleInputChange("emergencyContact", "relationship", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Phone Number</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyContact.phone}
                        onChange={(e) => handleInputChange("emergencyContact", "phone", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Preferences & Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={formData.preferences.language}
                        onValueChange={(value) => handleInputChange("preferences", "language", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={formData.preferences.timezone}
                        onValueChange={(value) => handleInputChange("preferences", "timezone", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Preferences</h4>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={formData.preferences.emailNotifications}
                        onCheckedChange={(checked) => handleInputChange("preferences", "emailNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsNotifications">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                      </div>
                      <Switch
                        id="smsNotifications"
                        checked={formData.preferences.smsNotifications}
                        onCheckedChange={(checked) => handleInputChange("preferences", "smsNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive push notifications in browser</p>
                      </div>
                      <Switch
                        id="pushNotifications"
                        checked={formData.preferences.pushNotifications}
                        onCheckedChange={(checked) => handleInputChange("preferences", "pushNotifications", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
