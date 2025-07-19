import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@school.edu" },
    update: {},
    create: {
      email: "admin@school.edu",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  })

  // Create teacher users
  const teacherPassword = await bcrypt.hash("teacher123", 12)
  const teacher1 = await prisma.user.upsert({
    where: { email: "sarah.wilson@school.edu" },
    update: {},
    create: {
      email: "sarah.wilson@school.edu",
      name: "Dr. Sarah Wilson",
      password: teacherPassword,
      role: "TEACHER",
    },
  })

  const teacher2 = await prisma.user.upsert({
    where: { email: "michael.brown@school.edu" },
    update: {},
    create: {
      email: "michael.brown@school.edu",
      name: "Prof. Michael Brown",
      password: teacherPassword,
      role: "TEACHER",
    },
  })

  // Create teacher profiles
  const teacherProfile1 = await prisma.teacher.upsert({
    where: { userId: teacher1.id },
    update: {},
    create: {
      userId: teacher1.id,
      employeeId: "EMP001",
      department: "Mathematics",
      qualification: "PhD in Mathematics",
      experience: 10,
      salary: 75000,
    },
  })

  const teacherProfile2 = await prisma.teacher.upsert({
    where: { userId: teacher2.id },
    update: {},
    create: {
      userId: teacher2.id,
      employeeId: "EMP002",
      department: "Physics",
      qualification: "PhD in Physics",
      experience: 8,
      salary: 72000,
    },
  })

  // Create student users
  const studentPassword = await bcrypt.hash("student123", 12)
  const student1 = await prisma.user.upsert({
    where: { email: "alice.johnson@school.edu" },
    update: {},
    create: {
      email: "alice.johnson@school.edu",
      name: "Alice Johnson",
      password: studentPassword,
      role: "STUDENT",
    },
  })

  const student2 = await prisma.user.upsert({
    where: { email: "bob.smith@school.edu" },
    update: {},
    create: {
      email: "bob.smith@school.edu",
      name: "Bob Smith",
      password: studentPassword,
      role: "STUDENT",
    },
  })

  // Create student profiles
  const studentProfile1 = await prisma.student.upsert({
    where: { userId: student1.id },
    update: {},
    create: {
      userId: student1.id,
      studentId: "STU001",
      grade: "10th Grade",
      dateOfBirth: new Date("2008-05-15"),
      address: "123 Main St, City, State",
      phone: "555-0101",
      parentEmail: "parent1@email.com",
      parentPhone: "555-0102",
    },
  })

  const studentProfile2 = await prisma.student.upsert({
    where: { userId: student2.id },
    update: {},
    create: {
      userId: student2.id,
      studentId: "STU002",
      grade: "11th Grade",
      dateOfBirth: new Date("2007-08-22"),
      address: "456 Oak Ave, City, State",
      phone: "555-0201",
      parentEmail: "parent2@email.com",
      parentPhone: "555-0202",
    },
  })

  // Create classrooms
  const classroom1 = await prisma.classroom.upsert({
    where: { name: "Room 101" },
    update: {},
    create: {
      name: "Room 101",
      building: "Science Building",
      floor: 1,
      capacity: 30,
      equipment: "Projector, Whiteboard, Lab Equipment",
    },
  })

  const classroom2 = await prisma.classroom.upsert({
    where: { name: "Room 205" },
    update: {},
    create: {
      name: "Room 205",
      building: "Main Building",
      floor: 2,
      capacity: 25,
      equipment: "Smart Board, Computer, Sound System",
    },
  })

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { code: "MATH101" },
    update: {},
    create: {
      name: "Mathematics 101",
      code: "MATH101",
      description: "Introduction to Algebra and Geometry",
      credits: 3,
      semester: "Fall",
      year: 2024,
      maxStudents: 30,
      teacherId: teacherProfile1.id,
      classroomId: classroom1.id,
    },
  })

  const course2 = await prisma.course.upsert({
    where: { code: "PHYS201" },
    update: {},
    create: {
      name: "Physics 201",
      code: "PHYS201",
      description: "Classical Mechanics and Thermodynamics",
      credits: 4,
      semester: "Fall",
      year: 2024,
      maxStudents: 25,
      teacherId: teacherProfile2.id,
      classroomId: classroom2.id,
    },
  })

  // Create enrollments
  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: studentProfile1.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      studentId: studentProfile1.id,
      courseId: course1.id,
    },
  })

  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: studentProfile1.id,
        courseId: course2.id,
      },
    },
    update: {},
    create: {
      studentId: studentProfile1.id,
      courseId: course2.id,
    },
  })

  await prisma.enrollment.upsert({
    where: {
      studentId_courseId: {
        studentId: studentProfile2.id,
        courseId: course1.id,
      },
    },
    update: {},
    create: {
      studentId: studentProfile2.id,
      courseId: course1.id,
    },
  })

  // Create sample grades
  await prisma.grade.create({
    data: {
      studentId: studentProfile1.id,
      courseId: course1.id,
      teacherId: teacherProfile1.id,
      assignment: "Midterm Exam",
      points: 92,
      maxPoints: 100,
      percentage: 92,
      letterGrade: "A",
    },
  })

  await prisma.grade.create({
    data: {
      studentId: studentProfile1.id,
      courseId: course2.id,
      teacherId: teacherProfile2.id,
      assignment: "Lab Report 1",
      points: 88,
      maxPoints: 100,
      percentage: 88,
      letterGrade: "A-",
    },
  })

  // Create sample notes
  await prisma.note.create({
    data: {
      title: "Introduction to Calculus",
      content: "This note covers the basic concepts of calculus including limits, derivatives, and integrals.",
      courseId: course1.id,
      type: "LECTURE",
      isPublic: true,
    },
  })

  await prisma.note.create({
    data: {
      title: "Newton's Laws of Motion",
      content: "Comprehensive overview of Newton's three laws of motion with examples and applications.",
      courseId: course2.id,
      type: "STUDY_GUIDE",
      isPublic: true,
    },
  })

  console.log("✅ Database seeded successfully!")
  console.log("📧 Login credentials:")
  console.log("   Admin: admin@school.edu / admin123")
  console.log("   Teacher: sarah.wilson@school.edu / teacher123")
  console.log("   Teacher: michael.brown@school.edu / teacher123")
  console.log("   Student: alice.johnson@school.edu / student123")
  console.log("   Student: bob.smith@school.edu / student123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
