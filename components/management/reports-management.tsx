"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  exportStudentGradesToCSV,
  generateBulkReports,
  generateReportCard,
} from "@/lib/report-generator";
import type { Student } from "@/types";
import {
  BookOpen,
  Download,
  FileText,
  GraduationCap,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";

interface ReportsManagementProps {
  userRole: string;
}

export function ReportsManagement({ userRole }: ReportsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Fall 2024");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  // Mock student data with detailed academic information
  const mockStudents: Student[] = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@school.edu",
      grade: "10th Grade",
      courses: [
        {
          name: "Mathematics 101",
          grade: "A",
          percentage: 92,
          credits: 3,
          teacher: "Dr. Sarah Wilson",
        },
        {
          name: "Physics 201",
          grade: "A-",
          percentage: 88,
          credits: 4,
          teacher: "Prof. Michael Brown",
        },
        {
          name: "Chemistry 101",
          grade: "B+",
          percentage: 85,
          credits: 3,
          teacher: "Dr. Emily Davis",
        },
        {
          name: "English Literature",
          grade: "A",
          percentage: 94,
          credits: 3,
          teacher: "Ms. Jennifer Lee",
        },
      ],
      attendance: 96,
      totalCredits: 13,
      gpa: 3.7,
      comments:
        "Alice demonstrates exceptional analytical skills and consistently produces high-quality work. She actively participates in class discussions and shows great potential in STEM subjects.",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@school.edu",
      grade: "11th Grade",
      courses: [
        {
          name: "Advanced Mathematics",
          grade: "B+",
          percentage: 87,
          credits: 4,
          teacher: "Dr. Sarah Wilson",
        },
        {
          name: "Physics 301",
          grade: "B",
          percentage: 82,
          credits: 4,
          teacher: "Prof. Michael Brown",
        },
        {
          name: "Computer Science",
          grade: "A",
          percentage: 95,
          credits: 3,
          teacher: "Mr. David Chen",
        },
        {
          name: "History",
          grade: "B",
          percentage: 80,
          credits: 3,
          teacher: "Ms. Maria Rodriguez",
        },
      ],
      attendance: 92,
      totalCredits: 14,
      gpa: 3.4,
      comments:
        "Bob shows strong aptitude in technology and mathematics. He would benefit from more consistent study habits and improved time management skills.",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@school.edu",
      grade: "9th Grade",
      courses: [
        {
          name: "Algebra I",
          grade: "A-",
          percentage: 89,
          credits: 3,
          teacher: "Mrs. Lisa Thompson",
        },
        {
          name: "Biology",
          grade: "A",
          percentage: 93,
          credits: 3,
          teacher: "Dr. Robert Kim",
        },
        {
          name: "World History",
          grade: "B+",
          percentage: 86,
          credits: 3,
          teacher: "Ms. Maria Rodriguez",
        },
        {
          name: "English 9",
          grade: "A",
          percentage: 91,
          credits: 3,
          teacher: "Mr. James Wilson",
        },
      ],
      attendance: 98,
      totalCredits: 12,
      gpa: 3.8,
      comments:
        "Carol is an outstanding student with excellent attendance and study habits. She demonstrates strong leadership qualities and helps her peers succeed.",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@school.edu",
      grade: "12th Grade",
      courses: [
        {
          name: "Calculus",
          grade: "B",
          percentage: 83,
          credits: 4,
          teacher: "Dr. Sarah Wilson",
        },
        {
          name: "AP Physics",
          grade: "B-",
          percentage: 78,
          credits: 4,
          teacher: "Prof. Michael Brown",
        },
        {
          name: "Chemistry II",
          grade: "B+",
          percentage: 85,
          credits: 3,
          teacher: "Dr. Emily Davis",
        },
        {
          name: "AP Literature",
          grade: "A-",
          percentage: 88,
          credits: 3,
          teacher: "Ms. Jennifer Lee",
        },
      ],
      attendance: 89,
      totalCredits: 14,
      gpa: 3.2,
      comments:
        "David has shown steady improvement throughout the semester. He should focus on consistent attendance and seek additional help when needed to reach his full potential.",
    },
  ];

  const filteredStudents = mockStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade =
      selectedGrade === "all" || student.grade.includes(selectedGrade);
    return matchesSearch && matchesGrade;
  });

  const handleGenerateIndividualReport = async (student: Student) => {
    setGenerating(true);
    try {
      await generateReportCard(student, selectedPeriod);
      toast({
        title: "Success",
        description: `Report card generated for ${student.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report card",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateBulkReports = async () => {
    setGenerating(true);
    try {
      await generateBulkReports(filteredStudents, selectedPeriod);
      toast({
        title: "Success",
        description: `Generated ${filteredStudents.length} report cards`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate bulk reports",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleExportCSV = () => {
    exportStudentGradesToCSV(filteredStudents, selectedPeriod);
    toast({
      title: "Success",
      description: "Grade data exported to CSV",
    });
  };

  if (userRole === "student") {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Access Denied</h3>
        <p className="text-muted-foreground">
          You don't have permission to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Report Cards & Academic Reports
        </h2>
        <p className="text-muted-foreground">
          Generate comprehensive academic reports and report cards
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStudents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average GPA</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                mockStudents.reduce((sum, student) => sum + student.gpa, 0) /
                mockStudents.length
              ).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Attendance
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                mockStudents.reduce(
                  (sum, student) => sum + student.attendance,
                  0
                ) / mockStudents.length
              )}
              %
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Reports Generated
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="individual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="individual">Individual Reports</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
          <TabsTrigger value="analytics">Grade Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Report Cards</CardTitle>
              <CardDescription>
                Generate report cards for individual students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                    <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                    <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Grades</SelectItem>
                    <SelectItem value="9th">9th Grade</SelectItem>
                    <SelectItem value="10th">10th Grade</SelectItem>
                    <SelectItem value="11th">11th Grade</SelectItem>
                    <SelectItem value="12th">12th Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Grade Level</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Courses</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.name}
                      </TableCell>
                      <TableCell>{student.grade}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.gpa >= 3.5
                              ? "default"
                              : student.gpa >= 3.0
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {student.gpa}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.attendance >= 95
                              ? "default"
                              : student.attendance >= 90
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {student.attendance}%
                        </Badge>
                      </TableCell>
                      <TableCell>{student.courses.length} courses</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleGenerateIndividualReport(student)
                          }
                          disabled={generating}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          Generate PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Report Generation</CardTitle>
              <CardDescription>
                Generate multiple report cards at once
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Label>Report Period:</Label>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fall 2024">Fall 2024</SelectItem>
                      <SelectItem value="Spring 2024">Spring 2024</SelectItem>
                      <SelectItem value="Summer 2024">Summer 2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-4">
                  <Label>Grade Filter:</Label>
                  <Select
                    value={selectedGrade}
                    onValueChange={setSelectedGrade}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Grades</SelectItem>
                      <SelectItem value="9th">9th Grade</SelectItem>
                      <SelectItem value="10th">10th Grade</SelectItem>
                      <SelectItem value="11th">11th Grade</SelectItem>
                      <SelectItem value="12th">12th Grade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected Students: {filteredStudents.length}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleGenerateBulkReports}
                      disabled={generating}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {generating
                        ? "Generating..."
                        : "Generate All PDF Reports"}
                    </Button>
                    <Button variant="outline" onClick={handleExportCSV}>
                      <FileText className="mr-2 h-4 w-4" />
                      Export to CSV
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Grade Analytics</CardTitle>
              <CardDescription>
                Academic performance overview and statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">GPA Distribution</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">3.5+ (Excellent)</span>
                      <span className="text-sm font-medium">
                        {mockStudents.filter((s) => s.gpa >= 3.5).length}{" "}
                        students
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">3.0-3.4 (Good)</span>
                      <span className="text-sm font-medium">
                        {
                          mockStudents.filter(
                            (s) => s.gpa >= 3.0 && s.gpa < 3.5
                          ).length
                        }{" "}
                        students
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">
                        Below 3.0 (Needs Improvement)
                      </span>
                      <span className="text-sm font-medium">
                        {mockStudents.filter((s) => s.gpa < 3.0).length}{" "}
                        students
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Attendance Overview
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">95%+ (Excellent)</span>
                      <span className="text-sm font-medium">
                        {mockStudents.filter((s) => s.attendance >= 95).length}{" "}
                        students
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">90-94% (Good)</span>
                      <span className="text-sm font-medium">
                        {
                          mockStudents.filter(
                            (s) => s.attendance >= 90 && s.attendance < 95
                          ).length
                        }{" "}
                        students
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Below 90% (Concerning)</span>
                      <span className="text-sm font-medium">
                        {mockStudents.filter((s) => s.attendance < 90).length}{" "}
                        students
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
