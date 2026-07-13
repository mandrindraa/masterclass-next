import { Card } from "@/components/ui/card";
import { NavTitle } from "@/components/ui/nav-title";

export default function GradesPage() {
  return (
    <div className="space-y-6">
      <NavTitle h1="Grades" h2="Enter and manage student grades" />

      <Card className="bg-slate-900 border-slate-800 p-6">
        <p className="text-slate-400">Grade entry system will be displayed here</p>
      </Card>
    </div>
  );
}
