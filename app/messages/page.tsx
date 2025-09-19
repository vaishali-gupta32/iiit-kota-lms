"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { ConversationList } from "@/components/messages/conversation-list"
import { MessageThread } from "@/components/messages/message-thread"
import { NewMessageDialog } from "@/components/messages/new-message-dialog"
import type { Conversation } from "@/lib/types"

export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
  }

  const handleMessageSent = () => {
    setRefreshKey((prev) => prev + 1)
    // Refresh conversations to update last message and unread counts
  }

  const handleNewMessage = () => {
    setShowNewMessage(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with teachers, students, and parents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="lg:col-span-1">
          <ConversationList
            key={refreshKey}
            selectedConversationId={selectedConversation?.id}
            onSelectConversation={handleConversationSelect}
            onNewMessage={handleNewMessage}
          />
        </div>

        <div className="lg:col-span-2">
          <MessageThread conversation={selectedConversation} onMessageSent={handleMessageSent} />
        </div>
      </div>

      <NewMessageDialog open={showNewMessage} onOpenChange={setShowNewMessage} onMessageSent={handleMessageSent} />
    </div>
  )
}
