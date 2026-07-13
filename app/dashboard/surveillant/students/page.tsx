"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { NavTitle } from "@/components/ui/nav-title";

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
  const [classes, setClasses] = useState<unknown[]>([]);
  const [academicYears, setAcademicYears] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  async function handleDeleteStudent(id: string) {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });

      if (!res.ok) throw new Error("Failed to delete student");

      setStudents(students.filter((s) => s.id !== id));
      setSuccess("Student deleted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const filteredStudents = students.filter((student) =>
    `${student.firstName} ${student.lastName} ${student.studentCode}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <NavTitle h1="Students" h2="Manage student enrollments" />
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

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Student</DialogTitle>
            <DialogDescription className="text-slate-400">
              Add a new student to the system
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-slate-300">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    placeholder="Jean"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-slate-300">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    placeholder="Rakoto"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="student@school.mg"
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate" className="text-slate-300">
                  Birth Date
                </Label>
                <Input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleFormChange}
                  className="bg-slate-800/50 border-slate-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classId" className="text-slate-300">
                  Class *
                </Label>
                <select
                  id="classId"
                  name="classId"
                  value={formData.classId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                <Label htmlFor="academicYearId" className="text-slate-300">
                  Academic Year *
                </Label>
                <select
                  id="academicYearId"
                  name="academicYearId"
                  value={formData.academicYearId}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  className="border-red-500/30 bg-red-500/10 text-red-400"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                >
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

      {success && (
        <Alert className="border-green-500/30 bg-green-500/10 text-green-400">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert
          variant="destructive"
          className="border-red-500/30 bg-red-500/10 text-red-400"
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
          className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>

      <Card className="bg-slate-900 border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-2" />
            <p className="text-slate-400">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            No students found. Create one to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-900">
                <TableHead className="text-slate-300">Name</TableHead>
                <TableHead className="text-slate-300">Student Code</TableHead>
                <TableHead className="text-slate-300">Email</TableHead>
                <TableHead className="text-slate-300">Class</TableHead>
                <TableHead className="text-slate-300">Academic Year</TableHead>
                <TableHead className="text-slate-300 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow
                  key={student.id}
                  className="border-slate-800 hover:bg-slate-800/50"
                >
                  <TableCell className="text-white font-medium">
                    {student.firstName} {student.lastName}
                  </TableCell>
                  <TableCell className="text-slate-300">
                    {student.studentCode}
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {student.user.email}
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {student.class.name}
                  </TableCell>
                  <TableCell className="text-slate-400">
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
                        onClick={() => handleDeleteStudent(student.id)}
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
