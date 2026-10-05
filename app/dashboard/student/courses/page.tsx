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
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-semibold text-foreground">{course.title}</h2>
                <p className="mt-1 text-sm text-foreground">
                  {course.teacherClassSubject.subject.name} ·{" "}
                  {course.period.label}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                {course.materials.length} file
                {course.materials.length === 1 ? "" : "s"}
              </span>
            </div>
            {course.description && (
              <p className="mt-4 text-sm text-muted-foreground">
                {course.description}
              </p>
            )}
            <div className="mt-4 space-y-2">
              {course.materials.map((material) => (
                <a
                  key={material.id}
                  href={material.filePath}
                  download
                  className="block rounded-md bg-muted px-3 py-2 text-sm text-foreground hover:bg-accent"
                >
                  {material.fileName}
                </a>
              ))}
              {course.materials.length === 0 && (
                <p className="text-sm text-muted-foreground">No materials attached.</p>
              )}
            </div>
          </article>
        ))}
        {courses.length === 0 && (
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground lg:col-span-2">
            No courses are available for your class yet.
          </div>
        )}
      </div>
    </div>
  );
}
