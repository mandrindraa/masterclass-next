"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NavTitle } from "@/components/ui/nav-title";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertCircle,
    FileDown,
    FileEdit,
    Loader2,
    Pencil,
    Plus,
    Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentCode: string;
  birthDate: string | null;
  user: {
    email: string;
    status: string;
  };
  class: {
    name: string;
    level: string;
  };
  academicYear: {
    label: string;
  };
}

interface CreateStudentForm {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  classId: string;
  academicYearId: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Custom delete confirmation state
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<CreateStudentForm>({
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    classId: "",
    academicYearId: "",
  });

  // Fetch students, classes, and academic years
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [studentsRes, classesRes, yearsRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/classes"),
        fetch("/api/academic-years"),
      ]);

      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(Array.isArray(data) ? data : []);
      }

      if (classesRes.ok) {
        const data = await classesRes.json();
        setClasses(Array.isArray(data) ? data : []);
      }

      if (yearsRes.ok) {
        const data = await yearsRes.json();
        setAcademicYears(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateStudent(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.classId ||
      !formData.academicYearId
    ) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create student");
      }

      const newStudent = await res.json();
      setStudents([...students, newStudent]);
      setSuccess("Student created successfully!");
      setShowCreateDialog(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  }

  // Opens the custom confirmation modal instead of window.confirm()
  function requestDeleteStudent(student: Student) {
    setError("");
    setSuccess("");
    setStudentToDelete(student);
  }

  // Runs the actual delete once the user confirms in the modal
  async function confirmDeleteStudent() {
    if (!studentToDelete) return;
    const id = studentToDelete.id;

    setIsDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });

      if (!res.ok) {
        let message = "Failed to delete student";
        try {
          const data = await res.json();
          message = data?.message || message;
        } catch {
          // response body wasn't JSON, keep default message
        }
        throw new Error(message);
      }

      setStudents((prev) => prev.filter((s) => s.id !== id));
      setSuccess("Student deleted successfully!");
      setStudentToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsDeleting(false);
    }
  }

  function resetForm() {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      birthDate: "",
      classId: "",
      academicYearId: "",
    });
    setSelectedStudent(null);
  }

  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName} ${student.studentCode}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
        <NavTitle h1="Students" h2="Manage student enrollments" />
        <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap sm:justify-end">
          <Button>
            <FileDown className="h-4 w-4" />
            Download template file
          </Button>
          <Button>
            <FileEdit className="h-4 w-4" />
            Import from file
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setShowCreateDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Create New Student
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Add a new student to the system
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleFormChange}
                  placeholder="Jean"
                  className="bg-muted border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleFormChange}
                  placeholder="Rakoto"
                  className="bg-muted border-input text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                placeholder="student@school.mg"
                className="bg-muted border-input text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-foreground">
                Birth Date
              </Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleFormChange}
                className="bg-muted border-input text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId" className="text-foreground">
                Class *
              </Label>
              <select
                id="classId"
                name="classId"
                value={formData.classId}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-muted border border-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.level})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="academicYearId" className="text-foreground">
                Academic Year *
              </Label>
              <select
                id="academicYearId"
                name="academicYearId"
                value={formData.academicYearId}
                onChange={handleFormChange}
                className="w-full px-3 py-2 bg-muted border border-input text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select academic year</option>
                {academicYears.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="border-border bg-muted text-foreground"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Create Student
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Custom delete confirmation modal, replaces window.confirm() */}
      <Dialog
        open={!!studentToDelete}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setStudentToDelete(null);
        }}
      >
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Delete Student
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {studentToDelete && (
                <>
                  Are you sure you want to delete{" "}
                  <span className="text-foreground font-medium">
                    {studentToDelete.firstName} {studentToDelete.lastName}
                  </span>
                  ? This action cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <Alert
              variant="destructive"
              className="border-border bg-muted text-foreground"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={confirmDeleteStudent}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setStudentToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {success && (
        <Alert className="border-border bg-muted text-foreground">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && !studentToDelete && (
        <Alert
          variant="destructive"
          className="border-border bg-muted text-foreground"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div>
        <Input
          placeholder="Search students by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-muted border-input text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <Card className="bg-card border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-muted-foreground">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No students found. Create one to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-card">
                <TableHead className="text-foreground">Name</TableHead>
                <TableHead className="text-foreground">Student Code</TableHead>
                <TableHead className="text-foreground">Email</TableHead>
                <TableHead className="text-foreground">Class</TableHead>
                <TableHead className="text-foreground">Academic Year</TableHead>
                <TableHead className="text-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  className="border-border hover:bg-muted"
                >
                  <TableCell className="text-foreground font-medium">
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell className="text-foreground">
                    {student.studentCode}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.user.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.class.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.academicYear.label}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student);
                        }}
                        disabled
                        title="Edit coming soon"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => requestDeleteStudent(student)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
