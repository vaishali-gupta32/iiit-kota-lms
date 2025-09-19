// Run this script to seed your MongoDB database with sample data
// Usage: node scripts/seed-database.js

const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")
const { v4: uuidv4 } = require("uuid")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://vaishali:vaishali123@iiitkota-lms.lgdfcl2.mongodb.net/?retryWrites=true&w=majority&appName=IIITKota-LMS"

const COLLECTIONS = {
  USERS: "users",
  STUDENTS: "students",
  TEACHERS: "teachers",
  PARENTS: "parents",
  ANNOUNCEMENTS: "announcements",
  EVENTS: "events",
  ATTENDANCE: "attendance",
  FINANCE: "finance",
}

const INDIAN_MALE_NAMES = [
  "Aarav Sharma",
  "Vivaan Gupta",
  "Aditya Singh",
  "Vihaan Kumar",
  "Arjun Patel",
  "Sai Reddy",
  "Reyansh Agarwal",
  "Ayaan Khan",
  "Krishna Verma",
  "Ishaan Jain",
  "Shaurya Yadav",
  "Atharv Mishra",
  "Advik Tiwari",
  "Pranav Pandey",
  "Rishabh Saxena",
  "Arnav Srivastava",
  "Kabir Chandra",
  "Virat Mehta",
  "Aryan Malhotra",
  "Rudra Bansal",
  "Shivansh Kapoor",
  "Advait Nair",
  "Kian Bhatt",
  "Rohan Joshi",
  "Darsh Iyer",
  "Veer Chopra",
  "Aarush Goyal",
  "Krish Aggarwal",
  "Yuvraj Thakur",
  "Arush Bhatia",
  "Laksh Singhal",
  "Dhruv Mittal",
  "Aadhya Rajput",
  "Vihaan Chauhan",
  "Reyansh Goel",
  "Kiaan Bajaj",
  "Aaryan Khanna",
  "Advay Sethi",
  "Ayush Arora",
  "Vedant Khurana",
  "Harsh Tandon",
  "Parth Sinha",
  "Raghav Dixit",
  "Samarth Jha",
  "Tanish Dubey",
  "Utkarsh Tripathi",
  "Varun Bhardwaj",
  "Yash Rastogi",
]

const INDIAN_FEMALE_NAMES = [
  "Saanvi Sharma",
  "Ananya Gupta",
  "Diya Singh",
  "Aadhya Kumar",
  "Kavya Patel",
  "Arya Reddy",
  "Myra Agarwal",
  "Sara Khan",
  "Anika Verma",
  "Navya Jain",
  "Kiara Yadav",
  "Prisha Mishra",
  "Aditi Tiwari",
  "Riya Pandey",
  "Siya Saxena",
  "Avni Srivastava",
  "Ishita Chandra",
  "Tara Mehta",
  "Zara Malhotra",
  "Ira Bansal",
  "Mira Kapoor",
  "Nisha Nair",
  "Pihu Bhatt",
  "Rhea Joshi",
  "Shanaya Iyer",
  "Vanya Chopra",
  "Wania Goyal",
  "Yara Aggarwal",
  "Zoya Thakur",
  "Ahana Bhatia",
  "Bhavya Singhal",
  "Charvi Mittal",
  "Divya Rajput",
  "Esha Chauhan",
  "Fatima Goel",
  "Garima Bajaj",
  "Hiya Khanna",
  "Inaya Sethi",
  "Jiya Arora",
  "Kashvi Khurana",
  "Lavanya Tandon",
  "Mahira Sinha",
  "Nayra Dixit",
  "Ojaswi Jha",
  "Palak Dubey",
  "Qiana Tripathi",
  "Radhika Bhardwaj",
  "Suhana Rastogi",
]

const INDIAN_TEACHER_NAMES = [
  "Dr. Rajesh Kumar",
  "Prof. Sunita Sharma",
  "Dr. Amit Singh",
  "Prof. Priya Gupta",
  "Dr. Vikram Patel",
  "Prof. Meera Reddy",
  "Dr. Suresh Agarwal",
  "Prof. Kavita Verma",
  "Dr. Manoj Jain",
  "Prof. Deepika Yadav",
  "Dr. Ravi Mishra",
  "Prof. Neha Tiwari",
  "Dr. Ashok Pandey",
  "Prof. Pooja Saxena",
  "Dr. Vinod Srivastava",
  "Prof. Rekha Chandra",
  "Dr. Sanjay Mehta",
  "Prof. Shweta Malhotra",
  "Dr. Ramesh Bansal",
  "Prof. Anjali Kapoor",
  "Dr. Mukesh Nair",
  "Prof. Sushma Bhatt",
  "Dr. Dinesh Joshi",
  "Prof. Vandana Iyer",
  "Dr. Prakash Chopra",
  "Prof. Ritu Goyal",
  "Dr. Naresh Aggarwal",
  "Prof. Seema Thakur",
  "Dr. Yogesh Bhatia",
  "Prof. Nidhi Singhal",
  "Dr. Mahesh Mittal",
  "Prof. Kiran Rajput",
  "Dr. Sunil Chauhan",
  "Prof. Asha Goel",
  "Dr. Anil Bajaj",
  "Prof. Usha Khanna",
  "Dr. Pankaj Sethi",
  "Prof. Geeta Arora",
  "Dr. Rajiv Khurana",
  "Prof. Sita Tandon",
  "Dr. Mohan Sinha",
  "Prof. Radha Dixit",
  "Dr. Gopal Jha",
  "Prof. Lata Dubey",
  "Dr. Hari Tripathi",
  "Prof. Mala Bhardwaj",
  "Dr. Shyam Rastogi",
  "Prof. Kamala Agrawal",
]

const INDIAN_PARENT_NAMES = [
  "Ramesh Kumar Sharma",
  "Sunita Devi Gupta",
  "Vijay Singh",
  "Meera Kumari Patel",
  "Suresh Reddy",
  "Kavita Agarwal",
  "Manoj Verma",
  "Deepika Jain",
  "Ravi Yadav",
  "Neha Mishra",
  "Ashok Tiwari",
  "Pooja Pandey",
  "Vinod Saxena",
  "Rekha Srivastava",
  "Sanjay Chandra",
  "Shweta Mehta",
  "Ramesh Malhotra",
  "Anjali Bansal",
  "Mukesh Kapoor",
  "Sushma Nair",
  "Dinesh Bhatt",
  "Vandana Joshi",
  "Prakash Iyer",
  "Ritu Chopra",
  "Naresh Goyal",
  "Seema Aggarwal",
  "Yogesh Thakur",
  "Nidhi Bhatia",
  "Mahesh Singhal",
  "Kiran Mittal",
]

const INDIAN_CITIES = [
  "Kota, Rajasthan",
  "Jaipur, Rajasthan",
  "Udaipur, Rajasthan",
  "Jodhpur, Rajasthan",
  "Ajmer, Rajasthan",
  "Delhi",
  "Mumbai, Maharashtra",
  "Pune, Maharashtra",
  "Bangalore, Karnataka",
  "Chennai, Tamil Nadu",
  "Hyderabad, Telangana",
  "Kolkata, West Bengal",
  "Ahmedabad, Gujarat",
  "Surat, Gujarat",
  "Lucknow, Uttar Pradesh",
]

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db()

    console.log("Connected to MongoDB. Starting database seeding...")

    // Clear existing data
    console.log("Clearing existing data...")
    await Promise.all([
      db.collection(COLLECTIONS.USERS).deleteMany({}),
      db.collection(COLLECTIONS.STUDENTS).deleteMany({}),
      db.collection(COLLECTIONS.TEACHERS).deleteMany({}),
      db.collection(COLLECTIONS.PARENTS).deleteMany({}),
      db.collection(COLLECTIONS.ANNOUNCEMENTS).deleteMany({}),
      db.collection(COLLECTIONS.EVENTS).deleteMany({}),
      db.collection(COLLECTIONS.ATTENDANCE).deleteMany({}),
      db.collection(COLLECTIONS.FINANCE).deleteMany({}),
    ])

    console.log("Pre-hashing passwords...")
    const adminPassword = await bcrypt.hash("admin123", 12)
    const studentPassword = await bcrypt.hash("student123", 12)
    const teacherPassword = await bcrypt.hash("teacher123", 12)
    const parentPassword = await bcrypt.hash("parent123", 12)

    // Create admin user
    console.log("Creating admin user...")
    const adminId = uuidv4()

    await db.collection(COLLECTIONS.USERS).insertOne({
      id: adminId,
      email: "admin@iiitkota.ac.in",
      password: adminPassword,
      name: "Vaishali Gupta",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log("Creating sample students...")
    const students = []
    const studentUsers = []

    // Create 100 students with Indian names
    for (let i = 1; i <= 100; i++) {
      const studentId = uuidv4()
      const userId = uuidv4()
      const gender = i <= 55 ? "male" : "female" // 55% male, 45% female
      const namesList = gender === "male" ? INDIAN_MALE_NAMES : INDIAN_FEMALE_NAMES
      const studentName = namesList[Math.floor(Math.random() * namesList.length)]

      studentUsers.push({
        id: userId,
        email: `student${i}@iiitkota.ac.in`,
        password: studentPassword,
        name: studentName,
        role: "student",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      students.push({
        id: studentId,
        userId: userId,
        name: studentName, // Added name field to student records
        rollNumber: `2024${String(i).padStart(4, "0")}`,
        class: ["BTech 1st Year", "BTech 2nd Year", "BTech 3rd Year", "BTech 4th Year"][Math.floor(Math.random() * 4)],
        section: String.fromCharCode(65 + (i % 4)), // A, B, C, D
        admissionDate: new Date("2024-08-01"),
        parentIds: [],
        subjects: ["Mathematics", "Physics", "Computer Science", "Engineering Drawing", "construction"],
        dateOfBirth: new Date(
          2003 + Math.floor(Math.random() * 3),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ),
        address: `${Math.floor(Math.random() * 999) + 1}, ${INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)]}`,
        phone: `+91${9000000000 + i}`,
        gender: gender,
      })
    }

    await db.collection(COLLECTIONS.USERS).insertMany(studentUsers)
    await db.collection(COLLECTIONS.STUDENTS).insertMany(students)

    // Create sample teachers with Indian names
    console.log("Creating sample teachers...")
    const teachers = []
    const teacherUsers = []

    for (let i = 1; i <= 50; i++) {
      const teacherId = uuidv4()
      const userId = uuidv4()
      const teacherName = INDIAN_TEACHER_NAMES[Math.floor(Math.random() * INDIAN_TEACHER_NAMES.length)]

      teacherUsers.push({
        id: userId,
        email: `teacher${i}@iiitkota.ac.in`,
        password: teacherPassword,
        name: teacherName,
        role: "teacher",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      teachers.push({
        id: teacherId,
        userId: userId,
        name: teacherName, // Added name field to teacher records
        employeeId: `EMP${String(i).padStart(4, "0")}`,
        subjects: [["Mathematics"], ["Physics"], ["Computer Science"], ["construction"], ["Engineering Drawing"]][
          Math.floor(Math.random() * 5)
        ],
        classes: ["BTech 1st Year", "BTech 2nd Year", "BTech 3rd Year", "BTech 4th Year"],
        department: ["Computer Science", "Electronics", "Mechanical", "Civil", "AIDE"][
          Math.floor(Math.random() * 5)
        ],
        qualification: ["PhD", "M.Tech", "M.Sc"][Math.floor(Math.random() * 3)],
        experience: Math.floor(Math.random() * 20) + 1,
        phone: `+91${8000000000 + i}`,
        address: `${Math.floor(Math.random() * 999) + 1}, ${INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)]}`,
      })
    }

    await db.collection(COLLECTIONS.USERS).insertMany(teacherUsers)
    await db.collection(COLLECTIONS.TEACHERS).insertMany(teachers)

    console.log("Creating sample parents...")
    const parents = []
    const parentUsers = []

    for (let i = 1; i <= 30; i++) {
      const parentId = uuidv4()
      const userId = uuidv4()
      const parentName = INDIAN_PARENT_NAMES[Math.floor(Math.random() * INDIAN_PARENT_NAMES.length)]

      parentUsers.push({
        id: userId,
        email: `parent${i}@iiitkota.ac.in`,
        password: parentPassword,
        name: parentName,
        role: "parent",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      parents.push({
        id: parentId,
        userId: userId,
        name: parentName,
        children: [students[Math.floor(Math.random() * students.length)].id], // Random student as child
        occupation: ["Engineer", "Doctor", "Teacher", "Businessman", "Government Officer", "Lawyer"][
          Math.floor(Math.random() * 6)
        ],
        phone: `+91${7000000000 + i}`,
        address: `${Math.floor(Math.random() * 999) + 1}, ${INDIAN_CITIES[Math.floor(Math.random() * INDIAN_CITIES.length)]}`,
      })
    }

    await db.collection(COLLECTIONS.USERS).insertMany(parentUsers)
    await db.collection(COLLECTIONS.PARENTS).insertMany(parents)

    // Create sample announcements
    console.log("Creating announcements...")
    const announcements = [
      {
        id: uuidv4(),
        title: "Collection of Grade Sheets",
        content: "Collect even semester marksheet from office 2nd floor.",
        type: "info",
        targetRoles: ["student", "parent"],
        createdBy: adminId,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "CACS Result Out",
        content: "Check out the new CACS result on the official website.",
        type: "success",
        targetRoles: ["student", "parent"],
        createdBy: adminId,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Guest faculty assigned",
        content: "Course instructors list for the new semester has been released.",
        type: "info",
        targetRoles: ["all"],
        createdBy: adminId,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "City Buses being non-operational for 7 days",
        content:
          "Due to heavy rainfall, city buses will not be operational for the next 7 days. Please make alternate arrangements.",
        type: "warning",
        targetRoles: ["all"],
        createdBy: adminId,
        createdAt: new Date(),
      },
    ]

    await db.collection(COLLECTIONS.ANNOUNCEMENTS).insertMany(announcements)

    // Create sample events
    console.log("Creating events...")
    const events = [
      {
        id: uuidv4(),
        title: "Techknow Election",
        description: "Election of our prestigious Techknow committee.",
        startDate: new Date("2025-09-15T12:00:00"),
        endDate: new Date("2025-09-15T14:00:00"),
        location: "Main Auditorium",
        type: "academic",
        createdBy: adminId,
        createdAt: new Date(),
      },
      {
        id: uuidv4(),
        title: "Odd Semester Registration",
        description: "New semester registration for odd semester courses at room no. 214.",
        startDate: new Date("2025-09-20T10:00:00"),
        endDate: new Date("2025-09-20T17:00:00"),
        location: "Room 214",
        type: "academic",
        createdBy: adminId,
        createdAt: new Date(),
      },
    ]

    await db.collection(COLLECTIONS.EVENTS).insertMany(events)

    // Create sample attendance data
    console.log("Creating attendance records...")
    const attendanceRecords = []
    const today = new Date()

    for (let day = 0; day < 7; day++) {
      const date = new Date(today)
      date.setDate(today.getDate() - day)

      // Random attendance for each day
      const presentCount = Math.floor(Math.random() * 80) + 60
      const absentCount = Math.floor(Math.random() * 20) + 10

      for (let i = 0; i < presentCount; i++) {
        attendanceRecords.push({
          id: uuidv4(),
          studentId: students[Math.floor(Math.random() * students.length)].id,
          date: date,
          status: "present",
          markedBy: adminId,
          createdAt: new Date(),
        })
      }

      for (let i = 0; i < absentCount; i++) {
        attendanceRecords.push({
          id: uuidv4(),
          studentId: students[Math.floor(Math.random() * students.length)].id,
          date: date,
          status: "absent",
          markedBy: adminId,
          createdAt: new Date(),
        })
      }
    }

    await db.collection(COLLECTIONS.ATTENDANCE).insertMany(attendanceRecords)

    // Create sample finance data
    console.log("Creating finance records...")
    const financeRecords = []
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    months.forEach((month, index) => {
      // Income records
      financeRecords.push({
        id: uuidv4(),
        type: "income",
        amount: Math.floor(Math.random() * 5000) + 2000,
        description: `Tuition fees - ${month}`,
        category: "fees",
        date: new Date(2025, index, 15),
        createdBy: adminId,
        createdAt: new Date(),
      })

      // Expense records
      financeRecords.push({
        id: uuidv4(),
        type: "expense",
        amount: Math.floor(Math.random() * 3000) + 1000,
        description: `Operating expenses - ${month}`,
        category: "operations",
        date: new Date(2025, index, 20),
        createdBy: adminId,
        createdAt: new Date(),
      })
    })

    await db.collection(COLLECTIONS.FINANCE).insertMany(financeRecords)

    console.log("✅ Database seeded successfully!")
    console.log("📊 Sample data created:")
    console.log("   - 1 Admin user")
    console.log("   - 100 Students with Indian names")
    console.log("   - 50 Teachers with Indian names")
    console.log("   - 30 Parents with Indian names")
    console.log("   - 4 Announcements")
    console.log("   - 2 Events")
    console.log("   - Weekly attendance data")
    console.log("   - Monthly finance data")
    console.log("")
    console.log("🔑 Login credentials:")
    console.log("   Admin: admin@iiitkota.ac.in / admin123")
    console.log("   Student: student1@iiitkota.ac.in / student123")
    console.log("   Teacher: teacher1@iiitkota.ac.in / teacher123")
    console.log("   Parent: parent1@iiitkota.ac.in / parent123")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
