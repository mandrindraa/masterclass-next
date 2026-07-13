import { Card } from "@/components/ui/card";
import { NavTitle } from "@/components/ui/nav-title";
import prisma from "@/lib/prisma";

const stats = async () => {
  return {
    totalTeachers: await prisma.teacher.count(),
    totalStudents: await prisma.student.count(),
    activeClasses: await prisma.class.count(),
    pendingValidations: await prisma.user.count({ where: { status: "PENDING" } }),
  }
}

export default async function SurveillantDashboard() {
  const data = await stats();
  return (
    <div className="space-y-8">
      <NavTitle h1="Surveillant Dashboard" h2="Welcome to your school management system" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Total Teachers</p>
          <p className="text-3xl font-bold text-white">{data.totalTeachers}</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Total Students</p>
          <p className="text-3xl font-bold text-white">{data.totalStudents}</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Active Classes</p>
          <p className="text-3xl font-bold text-white">{data.activeClasses}</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Pending Validations</p>
          <p className="text-3xl font-bold text-white">{data.pendingValidations}</p>
        </Card>
      </div>
    </div>
  );
}
