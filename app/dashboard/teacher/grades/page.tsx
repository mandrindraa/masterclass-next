import { Card } from "@/components/ui/card";

export default function GradesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Grades</h1>
        <p className="text-slate-400 mt-1">Enter and manage student grades</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 p-6">
        <p className="text-slate-400">Grade entry system will be displayed here</p>
      </Card>
    </div>
  );
}
