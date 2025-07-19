"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"

interface TeachersManagementProps {
  userRole: string
}

export function TeachersManagement({ userRole }: TeachersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const teachers = [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      email: "sarah@school.edu",
      department: "Mathematics",
      courses: 3,
      status: "Active",
    },
    {
      id: 2,
      name: "Prof. Michael Brown",
      email: "michael@school.edu",
      department: "Physics",
      courses: 2,
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Emily Davis",
      email: "emily@school.edu",
      department: "Chemistry",
      courses: 4,
      status: "Active",
    },
    {
      id: 4,
      name: "Prof. James Miller",
      email: "james@school.edu",
      department: "Biology",
      courses: 2,
      status: "Inactive",
    },
  ]

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (userRole !== "admin") {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Access Denied</h3>
        <p className="text-muted-foreground">You don't have permission to view this page.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teachers Management</h2>
          <p className="text-muted-foreground">Manage teacher records and assignments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Directory</CardTitle>
          <CardDescription>View and manage all teaching staff</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{teacher.courses} courses</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === "Active" ? "default" : "secondary"}>{teacher.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
