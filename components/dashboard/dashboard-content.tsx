"use client";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ClassroomsManagement } from "@/components/management/classrooms-management";
import { CoursesManagement } from "@/components/management/courses-management";
import { NotesManagement } from "@/components/management/notes-management";
import { ReportsManagement } from "@/components/management/reports-management";
import { StudentsManagement } from "@/components/management/students-management";
import { TeachersManagement } from "@/components/management/teachers-management";
import { useState } from "react";

interface User {
  email: string;
  role: string;
  name: string;
  id: string;
}

interface DashboardContentProps {
  userRole: string;
  user: User;
}

export function DashboardContent({ userRole, user }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview userRole={userRole} />;
      case "students":
        return <StudentsManagement userRole={userRole} />;
      case "teachers":
        return <TeachersManagement userRole={userRole} />;
      case "courses":
        return <CoursesManagement userRole={userRole} />;
      case "classrooms":
        return <ClassroomsManagement userRole={userRole} />;
      case "notes":
        return <NotesManagement userRole={userRole} />;
      case "reports":
        return <ReportsManagement userRole={userRole} />;
      default:
        return <DashboardOverview userRole={userRole} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        userRole={userRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
