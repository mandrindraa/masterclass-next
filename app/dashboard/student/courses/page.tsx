import { Card } from "@/components/ui/card";
import {NavTitle} from "@/components/ui/nav-title";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <NavTitle h1="Course Materials" h2="Access course materials from your teachers"/>

      <Card className="bg-slate-900 border-slate-800 p-6">
        <p className="text-slate-400">Course materials will be displayed here</p>
      </Card>
    </div>
  );
}
