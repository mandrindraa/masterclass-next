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

    let courses

    if (user.role === "STUDENT") {
      // Students can only see their enrolled courses
      courses = await prisma.course.findMany({
        where: {
          enrollments: {
            some: {
              student: {
                userId: user.id,
              },
            },
          },
        },
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
          classroom: true,
          enrollments: {
            include: {
              student: {
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
    } else if (user.role === "TEACHER") {
      // Teachers can see their assigned courses
      courses = await prisma.course.findMany({
        where: {
          teacher: {
            userId: user.id,
          },
        },
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
          classroom: true,
          enrollments: {
            include: {
              student: {
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
    } else {
      // Admins can see all courses
      courses = await prisma.course.findMany({
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
          classroom: true,
          enrollments: {
            include: {
              student: {
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
    }

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Get courses error:", error)
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
    if (!user || (user.role !== "ADMIN" && user.role !== "TEACHER")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()
    const { name, code, description, credits, semester, year, maxStudents, teacherId, classroomId } = data

    const course = await prisma.course.create({
      data: {
        name,
        code,
        description,
        credits: Number.parseInt(credits),
        semester,
        year: Number.parseInt(year),
        maxStudents: Number.parseInt(maxStudents),
        teacherId,
        classroomId: classroomId || null,
      },
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
        classroom: true,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Create course error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
