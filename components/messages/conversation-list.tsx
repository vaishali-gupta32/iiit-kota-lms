"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, MessageCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import type { Conversation } from "@/lib/types"

interface ConversationListProps {
  selectedConversationId?: string
  onSelectConversation: (conversation: Conversation) => void
  onNewMessage: () => void
}

export function ConversationList({
  selectedConversationId,
  onSelectConversation,
  onNewMessage,
}: ConversationListProps) {
  const { user, token } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (user && token) {
      fetchConversations()
    }
  }, [user, token])

  const fetchConversations = async () => {
    if (!user || !token) return

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/messages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations || [])
      } else {
        throw new Error("Failed to fetch conversations")
      }
    } catch (error: any) {
      console.error("Error fetching conversations:", error)
      setError(error.message || "Failed to load conversations")

      // Fallback sample data
      setConversations([
        {
          id: "1",
          participants: [
            { userId: user.id, name: user.name, role: user.role },
            { userId: "teacher1", name: "Dr. Sharma", role: "teacher" },
          ],
          lastMessage: {
            content: "Please submit your assignment by tomorrow",
            senderId: "teacher1",
            senderName: "Dr. Sharma",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          unreadCount: { [user.id]: 1 },
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: "2",
          participants: [
            { userId: user.id, name: user.name, role: user.role },
            { userId: "student1", name: "Rahul Kumar", role: "student" },
          ],
          lastMessage: {
            content: "Can you help me with the math problem?",
            senderId: "student1",
            senderName: "Rahul Kumar",
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          },
          unreadCount: { [user.id]: 0 },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery) return true
    const otherParticipant = conversation.participants.find((p) => p.userId !== user?.id)
    return otherParticipant?.name.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const formatTime = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      return messageDate.toLocaleDateString([], { weekday: "short" })
    } else {
      return messageDate.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Conversations
          </CardTitle>
          <Button size="sm" onClick={onNewMessage}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">⚠️ {error}</p>
            <p className="text-red-600 text-xs mt-1">Showing sample data. Please refresh to try again.</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No conversations yet</p>
              <p className="text-sm text-gray-400">Start a new conversation</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const otherParticipant = conversation.participants.find((p) => p.userId !== user?.id)
              const unreadCount = conversation.unreadCount?.[user?.id || ""] || 0
              const isSelected = conversation.id === selectedConversationId

              return (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    isSelected ? "bg-blue-50 border-blue-200" : ""
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {otherParticipant?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{otherParticipant?.name}</p>
                        <div className="flex items-center space-x-2">
                          {conversation.lastMessage && (
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.createdAt)}
                            </span>
                          )}
                          {unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage?.content || "No messages yet"}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {otherParticipant?.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
