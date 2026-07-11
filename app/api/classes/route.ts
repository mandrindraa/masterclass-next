/**
 * app/api/classes/route.ts
 * Classes CRUD endpoints
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
    const academicYearId = searchParams.get("academicYearId");

    const whereClause: any = {};
    if (academicYearId) whereClause.academicYearId = academicYearId;

    const classes = await prisma.class.findMany({
      where: whereClause,
      include: {
        academicYear: {
          select: {
            label: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("Failed to fetch classes:", error);
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
    const { name, level, academicYearId } = body;

    if (!name || !level || !academicYearId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
    });

    if (!academicYear) {
      return NextResponse.json(
        { message: "Academic year not found" },
        { status: 404 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        level,
        academicYearId,
      },
      include: {
        academicYear: {
          select: {
            label: true,
          },
        },
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Failed to create class:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
