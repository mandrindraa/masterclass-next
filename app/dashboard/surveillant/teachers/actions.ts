// app/dashboard/surveillant/teachers/actions.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Role, UserStatus } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";

async function requireSurveillant() {
  const session = await auth();
  if (!session || session.user?.role !== Role.SURVEILLANT) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function validateTeacher(teacherId: string) {
  const session = await requireSurveillant();

  await prisma.teacher.update({
    where: { id: teacherId },
    data: {
      validatedAt: new Date(),
      validator: { connect: { id: session.user!.id } },
      user: { update: { status: UserStatus.ACTIVE } },
    },
  });

  revalidatePath("/dashboard/surveillant/teachers");
}

export async function rejectTeacher(teacherId: string) {
  await requireSurveillant();

  await prisma.teacher.update({
    where: { id: teacherId },
    data: {
      user: { update: { status: UserStatus.SUSPENDED } },
    },
  });

  revalidatePath("/dashboard/surveillant/teachers");
}
