import { Card } from "@/components/ui/card";

export default function TeacherDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your courses and grades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="contrast" className="p-6">
          <p className="text-primary-foreground/70 text-sm mb-2">My Courses</p>
          <p className="text-3xl font-bold text-primary-foreground">0</p>
        </Card>
        <Card variant="contrast" className="p-6">
          <p className="text-primary-foreground/70 text-sm mb-2">Classes</p>
          <p className="text-3xl font-bold text-primary-foreground">0</p>
        </Card>
        <Card variant="contrast" className="p-6">
          <p className="text-primary-foreground/70 text-sm mb-2">Pending Grades</p>
          <p className="text-3xl font-bold text-primary-foreground">0</p>
        </Card>
      </div>
    </div>
  );
}
