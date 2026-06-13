/**
 * app/api/auth/register/route.ts
 * Teacher self-registration endpoint.
 * Creates a User with role=TEACHER and status=PENDING.
 */

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role, UserStatus } from "@/lib/generated/prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, firstName, lastName, phone } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role: Role.TEACHER,
          status: UserStatus.PENDING,
        },
      });

      await tx.teacher.create({
        data: {
          userId: user.id,
          firstName,
          lastName,
          phone: phone ?? null,
        },
      });
    });

    return NextResponse.json(
      { message: "Registration successful. Your account is pending validation." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
