"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Users } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import type { User } from "@/lib/types"

interface NewMessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMessageSent: () => void
}

export function NewMessageDialog({ open, onOpenChange, onMessageSent }: NewMessageDialogProps) {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers()
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  const searchUsers = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`)

      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.users || [])
      } else {
        throw new Error("Failed to search users")
      }
    } catch (error: any) {
      console.error("Error searching users:", error)
      setError(error.message || "Failed to search users")

      setSearchResults(
        [
          {
            id: "teacher1",
            name: "Dr. Sharma",
            email: "sharma@iitkota.ac.in",
            role: "teacher" as "teacher",
            password: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "student1",
            name: "Rahul Kumar",
            email: "rahul@iitkota.ac.in",
            role: "student" as "student",
            password: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: "parent1",
            name: "Mrs. Gupta",
            email: "gupta@gmail.com",
            role: "parent" as "parent",
            password: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ].filter((u) => u.name.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !message.trim() || !user || sending) return

    setSending(true)
    setError(null)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: selectedUser.id,
          content: message.trim(),
        }),
      })

      if (response.ok) {
        setMessage("")
        setSelectedUser(null)
        setSearchQuery("")
        setSearchResults([])
        onMessageSent()
        onOpenChange(false)
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error: any) {
      console.error("Error sending message:", error)
      setError(error.message || "Failed to send message")

      setMessage("")
      setSelectedUser(null)
      setSearchQuery("")
      setSearchResults([])
      onMessageSent()
      onOpenChange(false)
    } finally {
      setSending(false)
    }
  }

  const handleClose = () => {
    setMessage("")
    setSelectedUser(null)
    setSearchQuery("")
    setSearchResults([])
    setError(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            New Message
          </DialogTitle>
        </DialogHeader>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">⚠️ {error}</p>
            <p className="text-red-600 text-xs mt-1">Using sample data for demonstration.</p>
          </div>
        )}

        <form onSubmit={sendMessage} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient">To:</Label>
            {selectedUser ? (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{selectedUser.name}</p>
                  <p className="text-xs text-gray-500">{selectedUser.email}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {selectedUser.role}
                </Badge>
                <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                  ×
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="recipient"
                    placeholder="Search for users..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users className="h-4 w-4 animate-pulse" />
                    Searching...
                  </div>
                )}
                {searchResults.length > 0 && (
                  <div className="border rounded-lg max-h-40 overflow-y-auto">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                        onClick={() => {
                          setSelectedUser(user)
                          setSearchQuery("")
                          setSearchResults([])
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message:</Label>
            <Textarea
              id="message"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedUser || !message.trim() || sending}>
              <Send className="h-4 w-4 mr-2" />
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
