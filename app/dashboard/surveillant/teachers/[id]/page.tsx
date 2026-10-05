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
      <h1 className="text-3xl font-bold text-foreground">
        {teacher.firstName} {teacher.lastName}
      </h1>
      <Card className="bg-card border-border p-6 space-y-2">
        <p className="text-muted-foreground">Email: {teacher.user.email}</p>
        <p className="text-muted-foreground">Phone: {teacher.phone ?? "—"}</p>
        <p className="text-muted-foreground">Status: {teacher.user.status}</p>
        {teacher.validator && (
          <p className="text-muted-foreground">Validated by: {teacher.validator.email}</p>
        )}
      </Card>
    </div>
  );
}
