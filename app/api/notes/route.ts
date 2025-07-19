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

    let notes

    if (user.role === "STUDENT") {
      // Students can only see public notes from their enrolled courses
      notes = await prisma.note.findMany({
        where: {
          isPublic: true,
          course: {
            enrollments: {
              some: {
                student: {
                  userId: user.id,
                },
              },
            },
          },
        },
        include: {
          course: {
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
        orderBy: {
          createdAt: "desc",
        },
      })
    } else if (user.role === "TEACHER") {
      // Teachers can see all notes from their courses
      notes = await prisma.note.findMany({
        where: {
          course: {
            teacher: {
              userId: user.id,
            },
          },
        },
        include: {
          course: {
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
        orderBy: {
          createdAt: "desc",
        },
      })
    } else {
      // Admins can see all notes
      notes = await prisma.note.findMany({
        include: {
          course: {
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
        orderBy: {
          createdAt: "desc",
        },
      })
    }

    return NextResponse.json(notes)
  } catch (error) {
    console.error("Get notes error:", error)
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
    const { title, content, courseId, type, isPublic } = data

    // Verify teacher can only create notes for their courses
    if (user.role === "TEACHER") {
      const course = await prisma.course.findFirst({
        where: {
          id: courseId,
          teacher: {
            userId: user.id,
          },
        },
      })

      if (!course) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        courseId,
        type,
        isPublic: isPublic !== undefined ? isPublic : true,
      },
      include: {
        course: {
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

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("Create note error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
