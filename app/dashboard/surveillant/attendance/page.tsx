import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NavTitle } from "@/components/ui/nav-title";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <NavTitle h1="Attendance" h2="Record and manage attendance sessions" />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800 p-6">
        <p className="text-slate-400">Attendance sessions will be displayed here</p>
      </Card>
    </div>
  );
}
