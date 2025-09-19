"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Paperclip, MessageSquare } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import type { Message, Conversation } from "@/lib/types"

interface MessageThreadProps {
  conversation: Conversation | null
  onMessageSent: () => void
}

export function MessageThread({ conversation, onMessageSent }: MessageThreadProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (conversation && user) {
      fetchMessages()
    }
  }, [conversation, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async () => {
    if (!conversation || !user) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/messages?conversationId=${conversation.id}`)

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        throw new Error("Failed to fetch messages")
      }
    } catch (error: any) {
      console.error("Error fetching messages:", error)
      setError(error.message || "Failed to load messages")

      const otherParticipant = conversation.participants.find((p) => p.userId !== user.id)
      setMessages([
        {
          id: "1",
          content: "Hello! How can I help you today?",
          senderId: otherParticipant?.userId || "other",
          senderName: otherParticipant?.name || "Other User",
          senderRole: otherParticipant?.role || "student",
          createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
          updatedAt: new Date(Date.now() - 60 * 60 * 1000),
          readBy: [],
          conversationId: conversation.id,
        },
        {
          id: "2",
          content: "I have a question about the assignment",
          senderId: user.id,
          senderName: user.name,
          senderRole: user.role || "user",
          createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          updatedAt: new Date(Date.now() - 30 * 60 * 1000),
          readBy: [],
          conversationId: conversation.id,
        },
        {
          id: "3",
          content: "Sure, what would you like to know?",
          senderId: otherParticipant?.userId || "other",
          senderName: otherParticipant?.name || "Other User",
          senderRole: otherParticipant?.role || "student",
          createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          updatedAt: new Date(Date.now() - 15 * 60 * 1000),
          readBy: [],
          conversationId: conversation.id,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !conversation || !user || sending) return

    setSending(true)
    setError(null)

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversation.id,
          content: newMessage.trim(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessages((prev) => [...prev, data.message])
        setNewMessage("")
        onMessageSent()
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error: any) {
      console.error("Error sending message:", error)
      setError(error.message || "Failed to send message")

      const newMsg: Message = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role || "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        readBy: [],
        conversationId: conversation.id,
      }
      setMessages((prev) => [...prev, newMsg])
      setNewMessage("")
      onMessageSent()
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    const messageDate = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today"
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return messageDate.toLocaleDateString([], {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  if (!conversation) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Select a conversation to start messaging</p>
            <p className="text-sm text-gray-400 mt-2">Choose from the conversations on the left</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const otherParticipant = conversation.participants.find((p) => p.userId !== user?.id)

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>
              {otherParticipant?.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{otherParticipant?.name}</p>
            <p className="text-sm text-gray-500 font-normal capitalize">{otherParticipant?.role}</p>
          </div>
        </CardTitle>

        {error && <div className="p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">⚠️ {error}</div>}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400">Start the conversation!</p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isCurrentUser = message.senderId === user?.id
                const showDate =
                  index === 0 ||
                  new Date(messages[index - 1].createdAt).toDateString() !== new Date(message.createdAt).toDateString()

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex space-x-2 max-w-xs lg:max-w-md ${isCurrentUser ? "flex-row-reverse space-x-reverse" : ""}`}
                      >
                        {!isCurrentUser && (
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {message.senderName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-gray-500"}`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="border-t p-4">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <Button type="button" variant="outline" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={sending}
            />
            <Button type="submit" disabled={!newMessage.trim() || sending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
