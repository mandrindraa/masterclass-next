import { auth } from "@/auth";
import { Role } from "@/lib/generated/prisma/client";
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
    const updated = await prisma.absenceAlert.updateMany({
      where: { id, acknowledged: false },
      data: { acknowledged: true },
    });

    if (updated.count === 0) {
      const existing = await prisma.absenceAlert.findUnique({
        where: { id },
        select: { id: true },
      });
      if (!existing) {
        return NextResponse.json(
          { message: "Alert not found" },
          { status: 404 },
        );
      }
    }

    const alert = await prisma.absenceAlert.findUnique({
      where: { id },
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

    return NextResponse.json(alert);
  } catch (error) {
    console.error("Failed to acknowledge absence alert:", error);
    return NextResponse.json(
      { message: "Unable to acknowledge absence alert" },
      { status: 500 },
    );
  }
}
