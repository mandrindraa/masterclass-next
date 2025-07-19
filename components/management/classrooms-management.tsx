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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, MapPin, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

interface ClassroomsManagementProps {
  userRole: string;
}

export function ClassroomsManagement({ userRole }: ClassroomsManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data
  const classrooms = [
    {
      id: 1,
      name: "Room 101",
      building: "Science Building",
      capacity: 30,
      equipment: "Projector, Whiteboard",
      status: "Available",
    },
    {
      id: 2,
      name: "Room 205",
      building: "Main Building",
      capacity: 25,
      equipment: "Smart Board, Computer",
      status: "Occupied",
    },
    {
      id: 3,
      name: "Lab A",
      building: "Science Building",
      capacity: 20,
      equipment: "Lab Equipment, Fume Hood",
      status: "Available",
    },
    {
      id: 4,
      name: "Room 301",
      building: "Arts Building",
      capacity: 35,
      equipment: "Projector, Sound System",
      status: "Maintenance",
    },
  ];

  const filteredClassrooms = classrooms.filter(
    (classroom) =>
      classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.equipment.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Classrooms Management
          </h2>
          <p className="text-muted-foreground">
            Manage classroom assignments and resources
          </p>
        </div>
        {userRole === "admin" && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Classroom
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Classroom Directory</CardTitle>
          <CardDescription>
            View and manage all available classrooms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search classrooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Name</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Status</TableHead>
                {userRole === "admin" && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClassrooms.map((classroom) => (
                <TableRow key={classroom.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {classroom.name}
                    </div>
                  </TableCell>
                  <TableCell>{classroom.building}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{classroom.capacity} seats</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {classroom.equipment}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        classroom.status === "Available"
                          ? "default"
                          : classroom.status === "Occupied"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {classroom.status}
                    </Badge>
                  </TableCell>
                  {userRole === "admin" && (
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
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
