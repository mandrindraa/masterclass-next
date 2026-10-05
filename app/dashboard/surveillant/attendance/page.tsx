import { auth } from "@/auth";
import { NavTitle } from "@/components/ui/nav-title";
import { Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AttendanceForm } from "./attendance-form";

export default async function AttendancePage() {
  const session = await auth();
  if (!session || session.user?.role !== Role.SURVEILLANT)
    redirect("/dashboard");

  const [academicYear, recentSessions] = await Promise.all([
    prisma.academicYear.findFirst({
      where: { isActive: true },
      include: { periods: { orderBy: { number: "asc" } } },
    }),
    prisma.attendanceSession.findMany({
      take: 8,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      include: {
        class: { select: { name: true } },
        period: { select: { label: true } },
        _count: { select: { records: true } },
      },
    }),
  ]);

  const classes = academicYear
    ? await prisma.class.findMany({
        where: { academicYearId: academicYear.id },
        orderBy: { name: "asc" },
        select: { id: true, name: true, level: true },
      })
    : [];

  return (
    <div className="space-y-8">
      <NavTitle
        h1="Attendance"
        h2="Start a QR attendance session for a class"
      />

      <AttendanceForm
        academicYear={
          academicYear
            ? {
                id: academicYear.id,
                label: academicYear.label,
                periods: academicYear.periods.map((period) => ({
                  id: period.id,
                  label: period.label,
                })),
              }
            : null
        }
        classes={classes}
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Recent sessions</h2>
          <p className="text-sm text-muted-foreground">
            Review the attendance sessions recorded by the school.
          </p>
        </div>
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Class</th>
                <th className="px-4 py-3 font-medium">Period</th>
                <th className="px-4 py-3 font-medium">Slot</th>
                <th className="px-4 py-3 font-medium">Scanned</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentSessions.map((attendanceSession) => (
                <tr key={attendanceSession.id} className="text-foreground">
                  <td className="px-4 py-3">
                    {attendanceSession.date.toISOString().slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">{attendanceSession.class.name}</td>
                  <td className="px-4 py-3">
                    {attendanceSession.period.label}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {attendanceSession.slot.toLowerCase()}
                  </td>
                  <td className="px-4 py-3">
                    {attendanceSession._count.records}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        attendanceSession.isClosed
                          ? "text-foreground"
                          : "text-foreground"
                      }
                    >
                      {attendanceSession.isClosed ? "Closed" : "Open"}
                    </span>
                  </td>
                </tr>
              ))}
              {recentSessions.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No attendance sessions have been recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
