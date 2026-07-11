/**
 * app/api/students/[id]/route.ts
 * Individual student endpoints
 */

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            status: true,
          },
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true,
          },
        },
        academicYear: {
          select: {
            id: true,
            label: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const role = session.user?.role as string;
    if (role === Role.STUDENT && session.user?.id !== student.userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Failed to fetch student:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session || session.user?.role !== Role.SURVEILLANT) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { firstName, lastName, birthDate, classId, academicYearId } = body;

    // Verify student exists
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Verify class and academic year if updating
    if (classId || academicYearId) {
      const [classExists, academicYearExists] = await Promise.all([
        classId ? prisma.class.findUnique({ where: { id: classId } }) : true,
        academicYearId
          ? prisma.academicYear.findUnique({ where: { id: academicYearId } })
          : true,
      ]);

      if (!classExists || !academicYearExists) {
        return NextResponse.json(
          { message: "Invalid class or academic year" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.student.update({
      where: { id },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(birthDate && { birthDate: new Date(birthDate) }),
        ...(classId && { classId }),
        ...(academicYearId && { academicYearId }),
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

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update student:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();

    if (!session || session.user?.role !== Role.SURVEILLANT) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    // Delete user will cascade delete student
    await prisma.user.delete({
      where: { id: student.userId },
    });

    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Failed to delete student:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
