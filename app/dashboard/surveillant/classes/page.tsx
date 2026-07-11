import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ClassesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Classes</h1>
          <p className="text-slate-400 mt-1">Manage school classes</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Class
        </Button>
      </div>

      <Card className="bg-slate-900 border-slate-800 p-6">
        <p className="text-slate-400">Classes list will be displayed here</p>
      </Card>
    </div>
  );
}
