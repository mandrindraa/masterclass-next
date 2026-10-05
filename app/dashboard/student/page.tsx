import { auth } from "@/auth";
import { Card } from "@/components/ui/card";
import { NavTitle } from "@/components/ui/nav-title";
import { Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function StudentDashboard() {
  const session = await auth();
  if (!session || session.user?.role !== Role.STUDENT || !session.user.id)
    redirect("/dashboard");

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: {
      class: true,
      academicYear: { include: { periods: { orderBy: { number: "asc" } } } },
      grades: {
        include: { teacherClassSubject: { include: { subject: true } } },
      },
      attendanceRecords: { select: { status: true } },
    },
  });

  if (!student) redirect("/profile");

  const totalCoefficient = student.grades.reduce(
    (sum, grade) => sum + grade.teacherClassSubject.subject.coefficient,
    0,
  );
  const weightedTotal = student.grades.reduce(
    (sum, grade) =>
      sum + Number(grade.score) * grade.teacherClassSubject.subject.coefficient,
    0,
  );
  const average = totalCoefficient ? weightedTotal / totalCoefficient : null;
  const attended = student.attendanceRecords.filter(
    (record) => record.status !== "ABSENT",
  ).length;
  const attendanceRate = student.attendanceRecords.length
    ? Math.round((attended / student.attendanceRecords.length) * 100)
    : null;

  return (
    <div className="space-y-8">
      <NavTitle
        h1={`Welcome, ${student.firstName}`}
        h2={`${student.class.name} · ${student.academicYear.label}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="contrast" className="p-6">
          <p className="text-primary-foreground/70 text-sm mb-2">General Average</p>
          <p className="text-3xl font-bold text-primary-foreground">
            {average === null ? "--" : `${average.toFixed(2)}/20`}
          </p>
        </Card>
        <Card variant="contrast" className="p-6">
          <p className="text-primary-foreground/70 text-sm mb-2">Current Period</p>
          <p className="text-3xl font-bold text-primary-foreground">
            {student.academicYear.periods[0]?.label ?? "--"}
          </p>
        </Card>
        <Card variant="contrast" className="p-6">
          <p className="text-primary-foreground/70 text-sm mb-2">Attendance</p>
          <p className="text-3xl font-bold text-primary-foreground">
            {attendanceRate === null ? "--" : `${attendanceRate}%`}
          </p>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Grade summary</h2>
          <Link
            href="/dashboard/student/grades"
            className="text-sm text-foreground hover:text-foreground"
          >
            View all grades
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {student.grades.slice(0, 6).map((grade) => (
            <Card key={grade.id} className="border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-foreground">
                    {grade.teacherClassSubject.subject.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Coefficient {grade.teacherClassSubject.subject.coefficient}
                  </p>
                </div>
                <p className="font-semibold text-foreground">
                  {Number(grade.score).toFixed(2)}/20
                </p>
              </div>
            </Card>
          ))}
          {student.grades.length === 0 && (
            <Card className="border-border bg-card p-5 text-sm text-muted-foreground">
              Grades will appear here once your teachers publish them.
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
