import { Card } from "@/components/ui/card";

export default function StudentDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
        <p className="text-slate-400 mt-1">View your grades and courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">General Average</p>
          <p className="text-3xl font-bold text-white">--</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Current Rank</p>
          <p className="text-3xl font-bold text-white">--</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Attendance</p>
          <p className="text-3xl font-bold text-white">--%</p>
        </Card>
      </div>
    </div>
  );
}
