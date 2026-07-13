// app/dashboard/surveillant/teachers/[id]/page.tsx
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role } from "@/lib/generated/prisma/client";
import { Card } from "@/components/ui/card";

export default async function TeacherDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session || session.user?.role !== Role.SURVEILLANT) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const teacher = await prisma.teacher.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, status: true, createdAt: true } },
      validator: { select: { email: true } },
      teacherClassSubjects: {
        include: { class: true, subject: true },
      },
    },
  });

  if (!teacher) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        {teacher.firstName} {teacher.lastName}
      </h1>
      <Card className="bg-slate-900 border-slate-800 p-6 space-y-2">
        <p className="text-slate-400">Email: {teacher.user.email}</p>
        <p className="text-slate-400">Phone: {teacher.phone ?? "—"}</p>
        <p className="text-slate-400">Status: {teacher.user.status}</p>
        {teacher.validator && (
          <p className="text-slate-400">Validated by: {teacher.validator.email}</p>
        )}
      </Card>
    </div>
  );
}
