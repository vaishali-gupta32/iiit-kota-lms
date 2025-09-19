import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get("conversationId")

    const { db } = await connectToDatabase()

    if (conversationId) {
      // Get messages for a specific conversation
      const messages = await db.collection("messages").find({ conversationId }).sort({ createdAt: 1 }).toArray()

      // Mark messages as read by current user
      await db.collection("messages").updateMany(
        {
          conversationId,
          senderId: { $ne: decoded.userId },
          readBy: { $ne: decoded.userId },
        },
        { $addToSet: { readBy: decoded.userId } },
      )

      return NextResponse.json({ messages })
    } else {
      // Get all conversations for the user
      const conversations = await db
        .collection("conversations")
        .find({
          "participants.userId": decoded.userId,
        })
        .sort({ updatedAt: -1 })
        .toArray()

      return NextResponse.json({ conversations })
    }
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { conversationId, recipientId, content, attachments = [] } = await request.json()

    if (!content?.trim()) {
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()

    // Get sender info
    const sender = await db.collection("users").findOne({ id: decoded.userId })
    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 })
    }

    let finalConversationId = conversationId

    // If no conversation ID provided, create or find existing conversation
    if (!conversationId && recipientId) {
      const recipient = await db.collection("users").findOne({ id: recipientId })
      if (!recipient) {
        return NextResponse.json({ error: "Recipient not found" }, { status: 404 })
      }

      // Check if conversation already exists between these users
      const existingConversation = await db.collection("conversations").findOne({
        $and: [{ "participants.userId": decoded.userId }, { "participants.userId": recipientId }],
      })

      if (existingConversation) {
        finalConversationId = existingConversation.id
      } else {
        // Create new conversation
        finalConversationId = uuidv4()
        const newConversation = {
          id: finalConversationId,
          participants: [
            {
              userId: decoded.userId,
              name: sender.name,
              role: sender.role,
            },
            {
              userId: recipientId,
              name: recipient.name,
              role: recipient.role,
            },
          ],
          unreadCount: {
            [decoded.userId]: 0,
            [recipientId]: 1,
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        await db.collection("conversations").insertOne(newConversation)
      }
    }

    // Create the message
    const messageId = uuidv4()
    const message = {
      id: messageId,
      conversationId: finalConversationId,
      senderId: decoded.userId,
      senderName: sender.name,
      senderRole: sender.role,
      content: content.trim(),
      attachments,
      readBy: [decoded.userId],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("messages").insertOne(message)

    // Update conversation with last message and unread counts
    const otherParticipants = await db
      .collection("conversations")
      .findOne({ id: finalConversationId }, { projection: { participants: 1 } })

    if (otherParticipants) {
      const unreadUpdate: Record<string, number> = {}
      otherParticipants.participants.forEach((participant: { userId: string }) => {
        if (participant.userId !== decoded.userId) {
          unreadUpdate[`unreadCount.${participant.userId}`] = 1
        }
      })

      await db.collection("conversations").updateOne(
        { id: finalConversationId },
        {
          $set: {
            lastMessage: {
              content: content.trim(),
              senderId: decoded.userId,
              senderName: sender.name,
              createdAt: new Date(),
            },
            updatedAt: new Date(),
          },
          $inc: unreadUpdate,
        },
      )
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
