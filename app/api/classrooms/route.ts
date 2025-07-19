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

    // Students cannot access classroom management
    if (user.role === "STUDENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const classrooms = await prisma.classroom.findMany({
      include: {
        courses: {
          include: {
            teacher: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return NextResponse.json(classrooms)
  } catch (error) {
    console.error("Get classrooms error:", error)
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
    const { name, building, floor, capacity, equipment } = data

    const classroom = await prisma.classroom.create({
      data: {
        name,
        building,
        floor: floor ? Number.parseInt(floor) : null,
        capacity: Number.parseInt(capacity),
        equipment,
      },
    })

    return NextResponse.json(classroom, { status: 201 })
  } catch (error) {
    console.error("Create classroom error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
