"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, Users } from "lucide-react"

interface CoursesManagementProps {
  userRole: string
}

export function CoursesManagement({ userRole }: CoursesManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const courses = [
    {
      id: 1,
      name: "Mathematics 101",
      code: "MATH101",
      teacher: "Dr. Sarah Wilson",
      students: 25,
      credits: 3,
      status: "Active",
    },
    {
      id: 2,
      name: "Physics 201",
      code: "PHYS201",
      teacher: "Prof. Michael Brown",
      students: 18,
      credits: 4,
      status: "Active",
    },
    {
      id: 3,
      name: "Chemistry 101",
      code: "CHEM101",
      teacher: "Dr. Emily Davis",
      students: 22,
      credits: 3,
      status: "Active",
    },
    {
      id: 4,
      name: "Biology 101",
      code: "BIOL101",
      teacher: "Prof. James Miller",
      students: 20,
      credits: 3,
      status: "Inactive",
    },
  ]

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Courses Management</h2>
          <p className="text-muted-foreground">Manage course catalog and assignments</p>
        </div>
        {(userRole === "admin" || userRole === "teacher") && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Catalog</CardTitle>
          <CardDescription>View and manage all available courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Status</TableHead>
                {(userRole === "admin" || userRole === "teacher") && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{course.code}</Badge>
                  </TableCell>
                  <TableCell>{course.teacher}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="mr-1 h-4 w-4" />
                      {course.students}
                    </div>
                  </TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>
                    <Badge variant={course.status === "Active" ? "default" : "secondary"}>{course.status}</Badge>
                  </TableCell>
                  {(userRole === "admin" || userRole === "teacher") && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {userRole === "admin" && (
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
