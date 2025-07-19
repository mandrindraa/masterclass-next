"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2, FileText, Download } from "lucide-react"

interface NotesManagementProps {
  userRole: string
}

export function NotesManagement({ userRole }: NotesManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const notes = [
    {
      id: 1,
      title: "Introduction to Calculus",
      course: "Mathematics 101",
      author: "Dr. Sarah Wilson",
      date: "2024-01-15",
      type: "Lecture",
      status: "Published",
    },
    {
      id: 2,
      title: "Newton's Laws of Motion",
      course: "Physics 201",
      author: "Prof. Michael Brown",
      date: "2024-01-14",
      type: "Study Guide",
      status: "Published",
    },
    {
      id: 3,
      title: "Chemical Bonding Basics",
      course: "Chemistry 101",
      author: "Dr. Emily Davis",
      date: "2024-01-13",
      type: "Lecture",
      status: "Draft",
    },
    {
      id: 4,
      title: "Cell Structure and Function",
      course: "Biology 101",
      author: "Prof. James Miller",
      date: "2024-01-12",
      type: "Assignment",
      status: "Published",
    },
  ]

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.author.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notes Management</h2>
          <p className="text-muted-foreground">Manage course notes and study materials</p>
        </div>
        {(userRole === "admin" || userRole === "teacher") && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Notes Library</CardTitle>
          <CardDescription>Access and manage all course materials and notes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotes.map((note) => (
                <TableRow key={note.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      {note.title}
                    </div>
                  </TableCell>
                  <TableCell>{note.course}</TableCell>
                  <TableCell>{note.author}</TableCell>
                  <TableCell>{note.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{note.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={note.status === "Published" ? "default" : "secondary"}>{note.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {(userRole === "admin" || userRole === "teacher") && (
                        <>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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
