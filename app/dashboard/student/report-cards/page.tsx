import { auth } from "@/auth";
import { NavTitle } from "@/components/ui/nav-title";
import { Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ReportCardsPage() {
  const session = await auth();
  if (!session || session.user?.role !== Role.STUDENT || !session.user.id)
    redirect("/dashboard");
  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: {
      class: { include: { classSubjects: true } },
      academicYear: { include: { periods: { orderBy: { number: "asc" } } } },
      grades: {
        include: {
          period: true,
          teacherClassSubject: { include: { subject: true } },
        },
      },
      attendanceRecords: { where: { status: "ABSENT" } },
    },
  });
  if (!student) redirect("/profile");
  const classmates = await prisma.student.findMany({
    where: { classId: student.classId },
    include: {
      grades: {
        include: { teacherClassSubject: { include: { subject: true } } },
      },
    },
  });
  const periodCards = student.academicYear.periods.map((period) => {
    const grades = student.grades.filter(
      (grade) => grade.periodId === period.id,
    );
    const complete =
      student.class.classSubjects.length > 0 &&
      grades.length >= student.class.classSubjects.length;
    const coefficientTotal = grades.reduce(
      (sum, grade) => sum + grade.teacherClassSubject.subject.coefficient,
      0,
    );
    const average = coefficientTotal
      ? grades.reduce(
          (sum, grade) =>
            sum +
            Number(grade.score) * grade.teacherClassSubject.subject.coefficient,
          0,
        ) / coefficientTotal
      : null;
    const classAverages = classmates
      .map((classmate) => {
        const classmateGrades = classmate.grades.filter(
          (grade) => grade.periodId === period.id,
        );
        const total = classmateGrades.reduce(
          (sum, grade) => sum + grade.teacherClassSubject.subject.coefficient,
          0,
        );
        return total
          ? classmateGrades.reduce(
              (sum, grade) =>
                sum +
                Number(grade.score) *
                  grade.teacherClassSubject.subject.coefficient,
              0,
            ) / total
          : null;
      })
      .filter((value): value is number => value !== null)
      .sort((left, right) => right - left);
    const rank =
      average === null
        ? null
        : classAverages.findIndex((value) => value <= average) + 1;
    return { period, complete, average, rank };
  });
  return (
    <div className="space-y-8">
      <NavTitle
        h1="Report Cards"
        h2="Review your period results and class standing"
      />
      <div className="space-y-4">
        {periodCards.map(({ period, complete, average, rank }) => (
          <section
            key={period.id}
            className="rounded-lg border border-border bg-card p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">{period.label}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {complete
                    ? "All grades are entered for this period."
                    : "Your report card is not ready yet."}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm ${complete ? "bg-primary/10 text-foreground" : "bg-muted text-foreground"}`}
              >
                {complete ? "Ready" : "Incomplete"}
              </span>
            </div>
            {complete && (
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Period average</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {average?.toFixed(2)}/20
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class rank</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {rank ? `#${rank}` : "--"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Absences</p>
                  <p className="mt-1 text-2xl font-semibold text-foreground">
                    {student.attendanceRecords.length}
                  </p>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
