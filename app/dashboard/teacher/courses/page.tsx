import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NavTitle } from "@/components/ui/nav-title";

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <NavTitle h1="My Courses" h2="Manage courses and materials" />
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Course
        </Button>
      </div>

      <Card className="bg-card border-border p-6">
        <p className="text-muted-foreground">Your courses will be displayed here</p>
      </Card>
    </div>
  );
}
