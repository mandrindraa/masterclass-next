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
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const teachers = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        courses: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    })

    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Get teachers error:", error)
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
    const { name, email, password, department, qualification, experience, salary } = data

    // Create user first
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: await require("bcryptjs").hash(password, 12),
        role: "TEACHER",
      },
    })

    // Create teacher profile
    const teacher = await prisma.teacher.create({
      data: {
        userId: newUser.id,
        employeeId: `EMP${Date.now()}`,
        department,
        qualification,
        experience: experience ? Number.parseInt(experience) : null,
        salary: salary ? Number.parseFloat(salary) : null,
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

    return NextResponse.json(teacher, { status: 201 })
  } catch (error) {
    console.error("Create teacher error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
