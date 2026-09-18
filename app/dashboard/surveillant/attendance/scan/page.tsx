import { auth } from "@/auth";
import { NavTitle } from "@/components/ui/nav-title";
import { Role } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ScannerView } from "./scanner-view";

export default async function AttendanceScanPage({
  searchParams,
}: {
  searchParams: Promise<{ sessionId?: string }>;
}) {
  const session = await auth();
  if (!session || session.user?.role !== Role.SURVEILLANT)
    redirect("/dashboard");

  const { sessionId } = await searchParams;
  if (!sessionId) redirect("/dashboard/surveillant/attendance");

  const attendanceSession = await prisma.attendanceSession.findUnique({
    where: { id: sessionId },
    include: {
      class: { select: { name: true, level: true } },
      period: { select: { label: true } },
      records: {
        orderBy: { scannedAt: "desc" },
        include: {
          student: {
            select: { firstName: true, lastName: true, studentCode: true },
          },
        },
      },
      _count: { select: { records: true } },
    },
  });

  if (!attendanceSession) redirect("/dashboard/surveillant/attendance");

  return (
    <div className="space-y-6">
      <NavTitle
        h1="Scan attendance"
        h2={`${attendanceSession.class.name} · ${attendanceSession.period.label}`}
      />
      <ScannerView
        sessionId={attendanceSession.id}
        isClosed={attendanceSession.isClosed}
        initialRecords={attendanceSession.records.map((record) => ({
          id: record.id,
          firstName: record.student.firstName,
          lastName: record.student.lastName,
          studentCode: record.student.studentCode,
          status: record.status,
        }))}
      />
    </div>
  );
}
