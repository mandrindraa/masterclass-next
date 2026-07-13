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
      className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
      onClick={() => router.push(`/dashboard/surveillant/teachers/${t.id}`)}
    >
      <TableCell className="text-white font-medium">
        {t.firstName} {t.lastName}
      </TableCell>
      <TableCell className="text-slate-400">{t.user.email}</TableCell>
      <TableCell className="text-slate-400">{t.user.status}</TableCell>
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
        <h2 className="text-lg font-semibold text-slate-400 mb-2">
          Waiting for validation ({pendingTeachers.length})
        </h2>
        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingTeachers.length > 0 ? (
                pendingTeachers.map(renderRow)
              ) : (
                <TableRow className="border-slate-800">
                  <TableCell colSpan={4} className="text-center text-slate-400 py-6">
                    No teacher pending for validation
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-white mb-2">All teachers</h2>
        <Card className="bg-slate-900 border-slate-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800">
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Status</TableHead>
                <TableHead className="text-slate-300 text-right" />
              </TableRow>
            </TableHeader>
            <TableBody>{otherTeachers.map(renderRow)}</TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
