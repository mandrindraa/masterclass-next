import { auth } from "@/auth";
import { NavTitle } from "@/components/ui/nav-title";
import { Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const session = await auth();
  if (!session || session.user?.role !== Role.STUDENT || !session.user.id)
    redirect("/dashboard");
  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    select: { classId: true, academicYearId: true },
  });
  if (!student) redirect("/profile");
  const courses = await prisma.course.findMany({
    where: {
      teacherClassSubject: {
        classId: student.classId,
        academicYearId: student.academicYearId,
      },
    },
    include: {
      period: true,
      materials: true,
      teacherClassSubject: { include: { subject: true, teacher: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div className="space-y-8">
      <NavTitle
        h1="Course Materials"
        h2="Access course materials from your teachers"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {courses.map((course) => (
          <article
            key={course.id}
            className="rounded-lg border border-slate-800 bg-slate-900 p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-white">{course.title}</h2>
                <p className="mt-1 text-sm text-emerald-400">
                  {course.teacherClassSubject.subject.name} ·{" "}
                  {course.period.label}
                </p>
              </div>
              <span className="text-xs text-slate-500">
                {course.materials.length} file
                {course.materials.length === 1 ? "" : "s"}
              </span>
            </div>
            {course.description && (
              <p className="mt-4 text-sm text-slate-400">
                {course.description}
              </p>
            )}
            <div className="mt-4 space-y-2">
              {course.materials.map((material) => (
                <a
                  key={material.id}
                  href={material.filePath}
                  download
                  className="block rounded-md bg-slate-800 px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
                >
                  {material.fileName}
                </a>
              ))}
              {course.materials.length === 0 && (
                <p className="text-sm text-slate-500">No materials attached.</p>
              )}
            </div>
          </article>
        ))}
        {courses.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-slate-400 lg:col-span-2">
            No courses are available for your class yet.
          </div>
        )}
      </div>
    </div>
  );
}
