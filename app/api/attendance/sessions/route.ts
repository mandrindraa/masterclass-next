import { auth } from "@/auth";
import { AttendanceSlot, Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || session.user?.role !== Role.SURVEILLANT || !session.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { classId, periodId, date, slot } = body as {
      classId?: string;
      periodId?: string;
      date?: string;
      slot?: AttendanceSlot;
    };

    if (!classId || !periodId || !date || !slot) {
      return NextResponse.json(
        { message: "Class, period, date, and slot are required" },
        { status: 400 },
      );
    }

    if (!Object.values(AttendanceSlot).includes(slot)) {
      return NextResponse.json(
        { message: "Invalid attendance slot" },
        { status: 400 },
      );
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ message: "Invalid date" }, { status: 400 });
    }

    const [schoolClass, period] = await Promise.all([
      prisma.class.findUnique({ where: { id: classId } }),
      prisma.period.findUnique({ where: { id: periodId } }),
    ]);

    if (
      !schoolClass ||
      !period ||
      schoolClass.academicYearId !== period.academicYearId
    ) {
      return NextResponse.json(
        { message: "Class or period not found" },
        { status: 404 },
      );
    }

    const attendanceSession = await prisma.attendanceSession.create({
      data: {
        classId,
        periodId,
        date: parsedDate,
        slot,
        recordedBy: session.user.id,
      },
    });

    return NextResponse.json(attendanceSession, { status: 201 });
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "A session already exists for this class, date, and slot" },
        { status: 409 },
      );
    }

    console.error("Failed to create attendance session:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
