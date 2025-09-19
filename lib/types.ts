export interface User {
  _id?: string
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "teacher" | "student" | "parent"
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface Student {
  _id?: string
  id: string
  userId: string
  name: string // Added name field for students
  rollNumber: string
  class: string
  section: string
  admissionDate: Date
  parentIds: string[]
  subjects: string[]
  dateOfBirth: Date
  address: string
  phone: string
  gender: "male" | "female"
}

export interface Teacher {
  _id?: string
  id: string
  userId: string
  name: string // Added name field for teachers
  employeeId: string
  subjects: string[]
  classes: string[]
  department: string
  qualification: string
  experience: number
  phone: string
  address: string
}

export interface Parent {
  _id?: string
  id: string
  userId: string
  name: string // Added name field for parents
  children: string[] // student IDs
  occupation: string
  phone: string
  address: string
}

export interface Announcement {
  _id?: string
  id: string
  title: string
  content: string
  type: "info" | "warning" | "success" | "error"
  targetRoles: string[]
  createdBy: string
  createdAt: Date
  expiresAt?: Date
}

export interface Event {
  _id?: string
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  location?: string
  type: "academic" | "cultural" | "sports" | "other"
  createdBy: string
  createdAt: Date
}

export interface AttendanceRecord {
  _id?: string
  id: string
  studentId: string
  date: Date
  status: "present" | "absent" | "late"
  subject?: string
  markedBy: string
  createdAt: Date
}

export interface FinanceRecord {
  _id?: string
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: Date
  createdBy: string
  createdAt: Date
}

export interface Message {
  _id?: string
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: "admin" | "teacher" | "student" | "parent"
  content: string
  attachments?: string[]
  readBy: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Conversation {
  _id?: string
  id: string
  participants: {
    userId: string
    name: string
    role: "admin" | "teacher" | "student" | "parent"
  }[]
  lastMessage?: {
    content: string
    senderId: string
    senderName: string
    createdAt: Date
  }
  unreadCount: { [userId: string]: number }
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  _id?: string
  id: string
  userId: string
  type: "info" | "warning" | "success" | "error" | "message" | "assignment" | "grade" | "attendance"
  title: string
  message: string
  read: boolean
  actionUrl?: string
  metadata?: {
    senderId?: string
    senderName?: string
    assignmentId?: string
    gradeId?: string
    [key: string]: any
  }
  createdAt: Date
  expiresAt?: Date
}

export interface UserProfile {
  _id?: string
  id: string
  userId: string
  personalInfo: {
    firstName: string
    lastName: string
    dateOfBirth?: Date
    gender?: "male" | "female"
    bloodGroup?: string
    nationality?: string
    religion?: string
  }
  contactInfo: {
    phone: string
    alternatePhone?: string
    email: string
    alternateEmail?: string
    address: string
    city: string
    state: string
    pincode: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  preferences: {
    language: string
    timezone: string
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
  }
  avatar?: string
  createdAt: Date
  updatedAt: Date
}
