"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Check, CheckCheck, AlertTriangle, Info, Trophy, MessageSquare, BookOpen, Users } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import type { Notification } from "@/lib/types"

export function NotificationDropdown() {
  const { token } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [token])

  const fetchNotifications = async () => {
    if (!token) return

    try {
      const response = await fetch("/api/notifications?limit=10", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    if (!token) return

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ read: true }),
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "success":
        return <Trophy className="h-4 w-4 text-green-500" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "assignment":
        return <BookOpen className="h-4 w-4 text-purple-500" />
      case "grade":
        return <Trophy className="h-4 w-4 text-yellow-500" />
      case "attendance":
        return <Users className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const notificationDate = new Date(date)
    const diffInHours = (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 168) {
      // 7 days
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return notificationDate.toLocaleDateString()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={loading} className="text-xs">
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id)
                    }
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl
                    }
                  }}
                >
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">{notification.title}</p>
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2" />}
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{formatTime(notification.createdAt)}</span>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            className="text-xs h-6 px-2"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
