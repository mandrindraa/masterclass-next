// app/dashboard/surveillant/teachers/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Role, UserStatus } from "@/lib/generated/prisma/client";
import { TeacherTable } from "./teacher-table";
import { TeacherPagination } from "./teacher-pagination";

const PAGE_SIZE = 10;

export default async function TeachersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session || session.user?.role !== Role.SURVEILLANT) {
    redirect("/dashboard");
  }

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const teacherInclude = {
    user: { select: { email: true, status: true, createdAt: true } },
    validator: { select: { email: true } },
  } as const;

  const [pendingTeachers, otherTeachers, totalOthers] = await Promise.all([
    prisma.teacher.findMany({
      where: { user: { status: UserStatus.PENDING } },
      include: teacherInclude,
      orderBy: { user: { createdAt: "desc" } },
    }),
    prisma.teacher.findMany({
      where: { user: { status: { not: UserStatus.PENDING } } },
      include: teacherInclude,
      orderBy: { user: { createdAt: "desc" } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.teacher.count({
      where: { user: { status: { not: UserStatus.PENDING } } },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalOthers / PAGE_SIZE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Teachers</h1>
        <p className="text-slate-400 mt-1">Manage and validate teacher accounts</p>
      </div>

      <TeacherTable pendingTeachers={pendingTeachers} otherTeachers={otherTeachers} />

      <TeacherPagination
        page={page}
        totalPages={totalPages}
        basePath="/dashboard/surveillant/teachers"
      />
    </div>
  );
}
