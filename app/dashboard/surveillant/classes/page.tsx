"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavTitle } from "@/components/ui/nav-title";
import { AlertCircle, Loader2, Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface AcademicYearOption {
  id: string;
  label: string;
  isActive: boolean;
}

interface SchoolClass {
  id: string;
  name: string;
  level: string;
  academicYear: { label: string };
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearOption[]>([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [academicYearId, setAcademicYearId] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [classesResponse, yearsResponse] = await Promise.all([
          fetch("/api/classes"),
          fetch("/api/academic-years"),
        ]);
        if (!classesResponse.ok || !yearsResponse.ok) {
          throw new Error("Unable to load classes and academic years.");
        }

        const [classData, yearData]: [SchoolClass[], AcademicYearOption[]] =
          await Promise.all([classesResponse.json(), yearsResponse.json()]);
        if (!cancelled) {
          setClasses(classData);
          setAcademicYears(yearData);
          setAcademicYearId(
            yearData.find((year) => year.isActive)?.id ?? yearData[0]?.id ?? "",
          );
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load classes.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  async function createClass(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          level: level.trim(),
          academicYearId,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? "Unable to create class.");
      }

      setClasses((current) =>
        [...current, data as SchoolClass].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      );
      setSuccess(`${name.trim()} created successfully.`);
      setName("");
      setLevel("");
      setIsCreateOpen(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to create class.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <NavTitle h1="Classes" h2="Manage school classes" />
        <Button
          type="button"
          disabled={academicYears.length === 0}
          onClick={() => {
            setError("");
            setIsCreateOpen(true);
          }}
        >
          <Plus className="size-4" aria-hidden="true" />
          Create Class
        </Button>
      </div>

      {error && !isCreateOpen && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {academicYears.length === 0 && !isLoading ? (
        <Card className="items-center gap-2 p-6 text-center">
          <p className="font-medium text-foreground">
            Create an academic year first
          </p>
          <p className="text-sm text-muted-foreground">
            Every class must belong to an academic year before it can be
            created.
          </p>
        </Card>
      ) : isLoading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          Loading classes
        </div>
      ) : classes.length === 0 ? (
        <Card className="items-center gap-2 p-8 text-center">
          <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Users className="size-5" aria-hidden="true" />
          </div>
          <p className="font-medium text-foreground">No classes yet</p>
          <p className="text-sm text-muted-foreground">
            Create the first class to start enrolling students.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {classes.map((schoolClass) => (
            <Card key={schoolClass.id} className="gap-2 p-4">
              <h2 className="font-semibold text-foreground">
                {schoolClass.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {schoolClass.level} <span aria-hidden="true">·</span>{" "}
                {schoolClass.academicYear.label}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={isCreateOpen}
        onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) setError("");
        }}
      >
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Create class</DialogTitle>
            <DialogDescription>
              Add a class to an academic year.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createClass} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="class-name">Class name</Label>
              <Input
                id="class-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Terminale A"
                autoComplete="off"
                required
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-level">Level</Label>
              <Input
                id="class-level"
                value={level}
                onChange={(event) => setLevel(event.target.value)}
                placeholder="Terminale"
                autoComplete="off"
                required
                maxLength={80}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class-academic-year">Academic year</Label>
              <select
                id="class-academic-year"
                value={academicYearId}
                onChange={(event) => setAcademicYearId(event.target.value)}
                required
                className="h-11 w-full rounded-lg border border-input bg-muted px-3 text-base text-foreground md:text-sm"
              >
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.label}
                    {year.isActive ? " (Active)" : ""}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || !academicYearId}>
                {isSaving && (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                )}
                Create Class
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
