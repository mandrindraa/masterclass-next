import { auth } from "@/auth";
import { NavTitle } from "@/components/ui/nav-title";
import { Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function AttendancePage() {
  const session = await auth();
  if (!session || session.user?.role !== Role.STUDENT || !session.user.id)
    redirect("/dashboard");
  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: {
      attendanceRecords: {
        include: {
          attendanceSession: { include: { period: true, class: true } },
        },
        orderBy: { scannedAt: "desc" },
      },
    },
  });
  if (!student) redirect("/profile");
  const present = student.attendanceRecords.filter(
    (record) => record.status === "PRESENT",
  ).length;
  const absent = student.attendanceRecords.filter(
    (record) => record.status === "ABSENT",
  ).length;
  const late = student.attendanceRecords.filter(
    (record) => record.status === "LATE",
  ).length;
  return (
    <div className="space-y-8">
      <NavTitle h1="My Attendance" h2="Review your attendance history" />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-muted p-5">
          <p className="text-sm text-foreground">Present</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">
            {present}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted p-5">
          <p className="text-sm text-foreground">Absent</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">
            {absent}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted p-5">
          <p className="text-sm text-foreground">Late</p>
          <p className="mt-1 text-3xl font-semibold text-foreground">{late}</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {student.attendanceRecords.map((record) => (
              <tr key={record.id} className="text-foreground">
                <td className="px-4 py-3">
                  {record.attendanceSession.date.toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3">
                  {record.attendanceSession.class.name}
                </td>
                <td className="px-4 py-3">
                  {record.attendanceSession.period.label}
                </td>
                <td className="px-4 py-3 capitalize">
                  {record.attendanceSession.slot.toLowerCase()}
                </td>
                <td
                  className={`px-4 py-3 font-medium ${record.status === "PRESENT" ? "text-foreground" : record.status === "ABSENT" ? "text-foreground" : "text-foreground"}`}
                >
                  {record.status.toLowerCase()}
                </td>
              </tr>
            ))}
            {student.attendanceRecords.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No attendance records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
