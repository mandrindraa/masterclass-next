import { auth } from "@/auth";
import { Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== Role.SURVEILLANT) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  try {
    const alerts = await prisma.absenceAlert.findMany({
      orderBy: { sentAt: "desc" },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            studentCode: true,
            class: { select: { name: true } },
          },
        },
        attendanceRecord: {
          select: {
            attendanceSession: {
              select: {
                date: true,
                slot: true,
                period: { select: { label: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error("Failed to fetch absence alerts:", error);
    return NextResponse.json(
      { message: "Unable to load absence alerts" },
      { status: 500 },
    );
  }
}