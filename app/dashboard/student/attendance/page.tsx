import { Card } from "@/components/ui/card";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Attendance</h1>
        <p className="text-slate-400 mt-1">View your attendance history</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 p-6">
        <p className="text-slate-400">Your attendance records will be displayed here</p>
      </Card>
    </div>
  );
}
