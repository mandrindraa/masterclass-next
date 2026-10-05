// app/dashboard/surveillant/teachers/teacher-table.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { validateTeacher, rejectTeacher } from "./actions";

type TeacherRow = {
  id: string;
  firstName: string;
  lastName: string;
  user: { email: string; status: string };
};

export function TeacherTable({
  pendingTeachers,
  otherTeachers,
}: {
  pendingTeachers: TeacherRow[];
  otherTeachers: TeacherRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();


  const renderRow = (t: TeacherRow) => (
    <TableRow
      key={t.id}
      className="border-border hover:bg-muted cursor-pointer"
      onClick={() => router.push(`/dashboard/surveillant/teachers/${t.id}`)}
    >
      <TableCell className="text-foreground font-medium">
        {t.firstName} {t.lastName}
      </TableCell>
      <TableCell className="text-muted-foreground">{t.user.email}</TableCell>
      <TableCell className="text-muted-foreground">{t.user.status}</TableCell>
      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        {t.user.status === "PENDING" && (
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => startTransition(() => validateTeacher(t.id))}
            >
              Validate
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isPending}
              onClick={() => startTransition(() => rejectTeacher(t.id))}
            >
              Reject
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-muted-foreground mb-2">
          Waiting for validation ({pendingTeachers.length})
        </h2>
        <Card className="bg-card border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-foreground">Name</TableHead>
                <TableHead className="text-foreground">Email</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingTeachers.length > 0 ? (
                pendingTeachers.map(renderRow)
              ) : (
                <TableRow className="border-border">
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    No teacher pending for validation
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-2">All teachers</h2>
        <Card className="bg-card border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-foreground">Name</TableHead>
                <TableHead className="text-foreground">Email</TableHead>
                <TableHead className="text-foreground">Status</TableHead>
                <TableHead className="text-foreground text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>{otherTeachers.map(renderRow)}</TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
