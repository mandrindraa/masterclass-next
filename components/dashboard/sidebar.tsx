"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Building,
  FileBarChart,
  FileText,
  GraduationCap,
  LayoutDashboard,
  UserCheck,
} from "lucide-react";

interface SidebarProps {
  userRole: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ userRole, activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      roles: ["admin", "teacher", "student"],
    },
    {
      id: "students",
      label: "Students",
      icon: GraduationCap,
      roles: ["admin", "teacher"],
    },
    { id: "teachers", label: "Teachers", icon: UserCheck, roles: ["admin"] },
    {
      id: "courses",
      label: "Courses",
      icon: BookOpen,
      roles: ["admin", "teacher", "student"],
    },
    {
      id: "classrooms",
      label: "Classrooms",
      icon: Building,
      roles: ["admin", "teacher"],
    },
    {
      id: "notes",
      label: "Notes",
      icon: FileText,
      roles: ["admin", "teacher", "student"],
    },
    {
      id: "reports",
      label: "Report Cards",
      icon: FileBarChart,
      roles: ["admin", "teacher"],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="bg-white w-64 shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">School MS</h2>
        <p className="text-sm text-gray-600 capitalize">{userRole} Panel</p>
      </div>
      <nav className="mt-6">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start px-6 py-3 text-left",
                activeTab === item.id &&
                  "bg-primary/10 text-primary border-r-2 border-primary"
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
