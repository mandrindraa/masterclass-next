import { Card } from "@/components/ui/card";
import {NavTitle} from "@/components/ui/nav-title";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <NavTitle h1="Attendance" h2="View your attendance history"/>

      <Card className="bg-slate-900 border-slate-800 p-6">
        <p className="text-slate-400">Your attendance records will be displayed here</p>
      </Card>
    </div>
  );
}
