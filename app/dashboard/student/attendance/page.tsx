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
        <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/30 p-5">
          <p className="text-sm text-emerald-300">Present</p>
          <p className="mt-1 text-3xl font-semibold text-white">{present}</p>
        </div>
        <div className="rounded-lg border border-rose-900/50 bg-rose-950/30 p-5">
          <p className="text-sm text-rose-300">Absent</p>
          <p className="mt-1 text-3xl font-semibold text-white">{absent}</p>
        </div>
        <div className="rounded-lg border border-amber-900/50 bg-amber-950/30 p-5">
          <p className="text-sm text-amber-300">Late</p>
          <p className="mt-1 text-3xl font-semibold text-white">{late}</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {student.attendanceRecords.map((record) => (
              <tr key={record.id} className="text-slate-200">
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
                  className={`px-4 py-3 font-medium ${record.status === "PRESENT" ? "text-emerald-400" : record.status === "ABSENT" ? "text-rose-400" : "text-amber-400"}`}
                >
                  {record.status.toLowerCase()}
                </td>
              </tr>
            ))}
            {student.attendanceRecords.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500"
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
