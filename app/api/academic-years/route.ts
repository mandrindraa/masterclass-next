/**
 * app/api/academic-years/route.ts
 * Academic Years CRUD endpoints
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

    const years = await prisma.academicYear.findMany({
      orderBy: {
        label: "desc",
      },
    });

    return NextResponse.json(years);
  } catch (error) {
    console.error("Failed to fetch academic years:", error);
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
    const { label, periodType, startDate, endDate, isActive } = body;

    if (!label || !periodType || !startDate || !endDate) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const periodCount = periodType === "BIMESTER" ? 2 : 3;

    const newYear = await prisma.academicYear.create({
      data: {
        label,
        periodType,
        periodCount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive ?? false,
      },
    });

    return NextResponse.json(newYear, { status: 201 });
  } catch (error) {
    console.error("Failed to create academic year:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
