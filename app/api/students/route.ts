import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/auth-server"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Check permissions
    if (user.role === "STUDENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        enrollments: {
          include: {
            course: {
              select: {
                name: true,
                code: true,
              },
            },
          },
        },
        grades: {
          include: {
            course: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error("Get students error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()
    const { name, email, password, grade, dateOfBirth, address, phone, parentEmail, parentPhone } = data

    // Create user first
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: await require("bcryptjs").hash(password, 12),
        role: "STUDENT",
      },
    })

    // Create student profile
    const student = await prisma.student.create({
      data: {
        userId: newUser.id,
        studentId: `STU${Date.now()}`,
        grade,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        address,
        phone,
        parentEmail,
        parentPhone,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error("Create student error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
