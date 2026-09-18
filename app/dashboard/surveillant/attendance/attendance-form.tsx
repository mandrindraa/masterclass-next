"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CalendarDays, Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AttendanceFormProps {
  academicYear: {
    id: string;
    label: string;
    periods: Array<{ id: string; label: string }>;
  } | null;
  classes: Array<{ id: string; name: string; level: string }>;
}

export function AttendanceForm({ academicYear, classes }: AttendanceFormProps) {
  const router = useRouter();
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [periodId, setPeriodId] = useState(academicYear?.periods[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [slot, setSlot] = useState("MORNING");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function startSession(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/attendance/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, periodId, date, slot }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Unable to start session");
      router.push(
        `/dashboard/surveillant/attendance/scan?sessionId=${data.id}`,
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to start session",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-slate-800 bg-slate-900 p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-md bg-emerald-500/10 p-2 text-emerald-400">
          <CalendarDays className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold text-white">Start a session</h2>
          <p className="text-sm text-slate-400">
            {academicYear
              ? `Active academic year: ${academicYear.label}`
              : "Create an active academic year first."}
          </p>
        </div>
      </div>
      {!academicYear || classes.length === 0 ? (
        <p className="text-sm text-amber-400">
          An active academic year and at least one class are required.
        </p>
      ) : (
        <form onSubmit={startSession} className="grid gap-4 md:grid-cols-4">
          <label className="space-y-2 text-sm text-slate-300">
            Class
            <select
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-white"
            >
              {classes.map((schoolClass) => (
                <option key={schoolClass.id} value={schoolClass.id}>
                  {schoolClass.name} · {schoolClass.level}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Period
            <select
              value={periodId}
              onChange={(event) => setPeriodId(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-white"
            >
              {academicYear.periods.map((period) => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Date
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-white"
              required
            />
          </label>
          <label className="space-y-2 text-sm text-slate-300">
            Slot
            <select
              value={slot}
              onChange={(event) => setSlot(event.target.value)}
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 text-white"
            >
              <option value="MORNING">Morning</option>
              <option value="AFTERNOON">Afternoon</option>
            </select>
          </label>
          <div className="flex items-center gap-4 md:col-span-4">
            <p role="alert" className="text-sm text-rose-400">
              {error}
            </p>
            <Button
              type="submit"
              disabled={isSubmitting || !classId || !periodId}
              className="ml-auto"
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-2 h-4 w-4" />
              )}
              Open scanner
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
