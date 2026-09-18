import { auth } from "@/auth";
import { NavTitle } from "@/components/ui/nav-title";
import { Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function GradesPage() {
  const session = await auth();
  if (!session || session.user?.role !== Role.STUDENT || !session.user.id)
    redirect("/dashboard");
  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: {
      grades: {
        include: {
          period: true,
          teacherClassSubject: { include: { subject: true } },
        },
        orderBy: [
          { period: { number: "asc" } },
          { teacherClassSubject: { subject: { name: "asc" } } },
        ],
      },
    },
  });
  if (!student) redirect("/profile");
  const periods = Array.from(
    new Map(
      student.grades.map((grade) => [grade.period.id, grade.period]),
    ).values(),
  );
  return (
    <div className="space-y-8">
      <NavTitle h1="My Grades" h2="View your academic performance" />
      {periods.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
          Your grades will appear here once they are published.
        </div>
      ) : (
        periods.map((period) => {
          const grades = student.grades.filter(
            (grade) => grade.periodId === period.id,
          );
          const coefficientTotal = grades.reduce(
            (sum, grade) => sum + grade.teacherClassSubject.subject.coefficient,
            0,
          );
          const average = coefficientTotal
            ? grades.reduce(
                (sum, grade) =>
                  sum +
                  Number(grade.score) *
                    grade.teacherClassSubject.subject.coefficient,
                0,
              ) / coefficientTotal
            : null;
          return (
            <section key={period.id} className="space-y-3">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-semibold text-white">
                  {period.label}
                </h2>
                <span className="text-sm text-emerald-400">
                  Average:{" "}
                  {average === null ? "--" : `${average.toFixed(2)}/20`}
                </span>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Coefficient</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Weighted score</th>
                      <th className="px-4 py-3">Comment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {grades.map((grade) => (
                      <tr key={grade.id} className="text-slate-200">
                        <td className="px-4 py-3">
                          {grade.teacherClassSubject.subject.name}
                        </td>
                        <td className="px-4 py-3">
                          {grade.teacherClassSubject.subject.coefficient}
                        </td>
                        <td className="px-4 py-3">
                          {Number(grade.score).toFixed(2)}/20
                        </td>
                        <td className="px-4 py-3">
                          {(
                            Number(grade.score) *
                            grade.teacherClassSubject.subject.coefficient
                          ).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {grade.comment || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
