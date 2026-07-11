import { Card } from "@/components/ui/card";

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Teacher Dashboard</h1>
        <p className="text-slate-400 mt-1">Manage your courses and grades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">My Courses</p>
          <p className="text-3xl font-bold text-white">0</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Classes</p>
          <p className="text-3xl font-bold text-white">0</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Pending Grades</p>
          <p className="text-3xl font-bold text-white">0</p>
        </Card>
      </div>
    </div>
  );
}
