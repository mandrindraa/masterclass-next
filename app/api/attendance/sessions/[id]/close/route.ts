import { auth } from "@/auth";
import { AttendanceStatus, Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session || session.user?.role !== Role.SURVEILLANT) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const attendanceSession = await prisma.attendanceSession.findUnique({
      where: { id },
      include: { records: true },
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

    const missingStudents = await prisma.student.findMany({
      where: {
        classId: attendanceSession.classId,
        id: {
          notIn: attendanceSession.records.map((record) => record.studentId),
        },
      },
      select: { id: true },
    });

    const closedSession = await prisma.$transaction(async (transaction) => {
      if (missingStudents.length > 0) {
        await transaction.attendanceRecord.createMany({
          data: missingStudents.map((student) => ({
            attendanceSessionId: id,
            studentId: student.id,
            status: AttendanceStatus.ABSENT,
          })),
        });
      }

      const absentRecords = await transaction.attendanceRecord.findMany({
        where: { attendanceSessionId: id, status: AttendanceStatus.ABSENT },
        select: { id: true, studentId: true },
      });

      if (absentRecords.length > 0) {
        await transaction.absenceAlert.createMany({
          data: absentRecords.map((record) => ({
            studentId: record.studentId,
            attendanceRecordId: record.id,
          })),
          skipDuplicates: true,
        });
      }

      return transaction.attendanceSession.update({
        where: { id },
        data: { isClosed: true },
      });
    });

    return NextResponse.json(closedSession);
  } catch (error) {
    console.error("Failed to close attendance session:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
