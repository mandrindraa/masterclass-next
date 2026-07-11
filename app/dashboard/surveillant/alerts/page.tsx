import { Card } from "@/components/ui/card";

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Absence Alerts</h1>
        <p className="text-slate-400 mt-1">Monitor student absence alerts</p>
      </div>

      <Card className="bg-slate-900 border-slate-800 p-6">
        <p className="text-slate-400">Alerts will be displayed here</p>
      </Card>
    </div>
  );
}
