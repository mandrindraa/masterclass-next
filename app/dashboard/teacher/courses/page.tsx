import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavTitle } from "@/components/ui/nav-title";
import { Plus } from "lucide-react";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <NavTitle h1="My Courses" h2="Manage courses and materials" />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Course
        </Button>
      </div>

      <Card className="bg-card border-border p-6">
        <p className="text-muted-foreground">
          Your courses will be displayed here
        </p>
      </Card>
    </div>
  );
}
