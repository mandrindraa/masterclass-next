import { auth } from "@/auth";
import { AttendanceStatus, Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || session.user?.role !== Role.SURVEILLANT) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const { sessionId, studentCode } = (await request.json()) as {
      sessionId?: string;
      studentCode?: string;
    };

    if (!sessionId || !studentCode?.trim()) {
      return NextResponse.json(
        { message: "Session and student code are required" },
        { status: 400 },
      );
    }

    const attendanceSession = await prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: { class: true },
    });

    if (!attendanceSession) {
      return NextResponse.json(
        { message: "Attendance session not found" },
        { status: 404 },
      );
    }
    if (attendanceSession.isClosed) {
      return NextResponse.json(
        { message: "This session is already closed" },
        { status: 409 },
      );
    }

    const student = await prisma.student.findUnique({
      where: { studentCode: studentCode.trim() },
    });

    if (!student || student.classId !== attendanceSession.classId) {
      return NextResponse.json(
        { message: "Student is not enrolled in this class" },
        { status: 404 },
      );
    }

    const record = await prisma.attendanceRecord.upsert({
      where: {
        attendanceSessionId_studentId: {
          attendanceSessionId: sessionId,
          studentId: student.id,
        },
      },
      update: { status: AttendanceStatus.PRESENT, scannedAt: new Date() },
      create: {
        attendanceSessionId: sessionId,
        studentId: student.id,
        status: AttendanceStatus.PRESENT,
      },
      include: {
        student: {
          select: { firstName: true, lastName: true, studentCode: true },
        },
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error("Failed to record attendance:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
