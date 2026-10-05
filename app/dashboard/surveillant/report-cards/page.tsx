import { Card } from "@/components/ui/card";
import { NavTitle } from "@/components/ui/nav-title";

export default function ReportCardsPage() {
  return (
    <div className="space-y-6">
      <NavTitle h1="Report Cards" h2="Generate and download report cards" />

      <Card className="bg-card border-border p-6">
        <p className="text-muted-foreground">Report cards will be displayed here</p>
      </Card>
    </div>
  );
}
