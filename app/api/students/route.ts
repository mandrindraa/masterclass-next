/**
 * app/api/students/route.ts
 * Students CRUD endpoints
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== Role.SURVEILLANT) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const academicYearId = searchParams.get("academicYearId");

    const whereClause: any = {};
    if (classId) whereClause.classId = classId;
    if (academicYearId) whereClause.academicYearId = academicYearId;

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            email: true,
            status: true,
          },
        },
        class: {
          select: {
            name: true,
            level: true,
          },
        },
        academicYear: {
          select: {
            label: true,
          },
        },
      },
      orderBy: {
        lastName: "asc",
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== Role.SURVEILLANT) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      birthDate,
      classId,
      academicYearId,
    } = body;

    if (!firstName || !lastName || !email || !classId || !academicYearId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if class and academic year exist
    const [classExists, academicYearExists] = await Promise.all([
      prisma.class.findUnique({ where: { id: classId } }),
      prisma.academicYear.findUnique({ where: { id: academicYearId } }),
    ]);

    if (!classExists || !academicYearExists) {
      return NextResponse.json(
        { message: "Class or academic year not found" },
        { status: 404 }
      );
    }

    // Generate student code: STU-YYYY-NNNNN
    const year = new Date().getFullYear();
    const lastStudent = await prisma.student.findFirst({
      where: {
        studentCode: {
          startsWith: `STU-${year}`,
        },
      },
      orderBy: {
        studentCode: "desc",
      },
    });

    let nextNumber = 1;
    if (lastStudent) {
      const match = lastStudent.studentCode.match(/STU-\d+-(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    const studentCode = `STU-${year}-${String(nextNumber).padStart(5, "0")}`;

    // Check if email already exists in User table
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Create user and student in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash: "", // Students registered by surveillant have empty password
          role: Role.STUDENT,
          status: "ACTIVE",
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          studentCode,
          birthDate: birthDate ? new Date(birthDate) : null,
          classId,
          academicYearId,
        },
        include: {
          user: {
            select: {
              email: true,
              status: true,
            },
          },
          class: {
            select: {
              name: true,
              level: true,
            },
          },
          academicYear: {
            select: {
              label: true,
            },
          },
        },
      });

      return student;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Failed to create student:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
