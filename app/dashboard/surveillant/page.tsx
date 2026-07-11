import { Card } from "@/components/ui/card";

export default function SurveillantDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Surveillant Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome to your school management system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Total Teachers</p>
          <p className="text-3xl font-bold text-white">0</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Total Students</p>
          <p className="text-3xl font-bold text-white">0</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Active Classes</p>
          <p className="text-3xl font-bold text-white">0</p>
        </Card>
        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400 text-sm mb-2">Pending Validations</p>
          <p className="text-3xl font-bold text-white">0</p>
        </Card>
      </div>
    </div>
  );
}
