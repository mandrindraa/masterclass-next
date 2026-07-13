import { Card } from "@/components/ui/card";
import { NavTitle } from "@/components/ui/nav-title";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <NavTitle h1="Absence Alerts" h2="Monitor student absence alerts" />

      <Card className="bg-slate-900 border-slate-800 p-6">
        <p className="text-slate-400">Alerts will be displayed here</p>
      </Card>
    </div>
  );
}
