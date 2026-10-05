import { auth } from "@/auth";
import {
  DashboardHeader,
  DashboardSidebar,
} from "@/components/dashboard/header";
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  UserRoundCogIcon,
  Users,
} from "lucide-react";
import { redirect } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role as string;
  let navLinks: Array<{ label: string; href: string; icon: React.ReactNode }> =
    [];

  if (role === "SURVEILLANT") {
    navLinks = [
      {
        label: "Overview",
        href: "/dashboard/surveillant",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        label: "Teachers",
        href: "/dashboard/surveillant/teachers",
        icon: <Users className="h-5 w-5" />,
      },
      {
        label: "Students",
        href: "/dashboard/surveillant/students",
        icon: <GraduationCap className="h-5 w-5" />,
      },
      {
        label: "Classes",
        href: "/dashboard/surveillant/classes",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        label: "Attendance",
        href: "/dashboard/surveillant/attendance",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        label: "Alerts",
        href: "/dashboard/surveillant/alerts",
        icon: <AlertCircle className="h-5 w-5" />,
      },
      {
        label: "Report Cards",
        href: "/dashboard/surveillant/report-cards",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        label: "Users",
        href: "/dashboard/surveillant/users",
        icon: <UserRoundCogIcon className="h-5 w-5" />,
      },
    ];
  } else if (role === "TEACHER") {
    navLinks = [
      {
        label: "Overview",
        href: "/dashboard/teacher",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        label: "Courses",
        href: "/dashboard/teacher/courses",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        label: "Grades",
        href: "/dashboard/teacher/grades",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        label: "Report Cards",
        href: "/dashboard/teacher/report-cards",
        icon: <FileText className="h-5 w-5" />,
      },
    ];
  } else if (role === "STUDENT") {
    navLinks = [
      {
        label: "Overview",
        href: "/dashboard/student",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        label: "Grades",
        href: "/dashboard/student/grades",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        label: "Courses",
        href: "/dashboard/student/courses",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        label: "Attendance",
        href: "/dashboard/student/attendance",
        icon: <AlertCircle className="h-5 w-5" />,
      },
      {
        label: "My QR Code",
        href: "/dashboard/student/qr-code",
        icon: <Briefcase className="h-5 w-5" />,
      },
      {
        label: "Report Cards",
        href: "/dashboard/student/report-cards",
        icon: <FileText className="h-5 w-5" />,
      },
    ];
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <DashboardHeader
        userEmail={session.user?.email}
        role={role}
        links={navLinks}
      />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar links={navLinks} role={role} />
        <main className="min-w-0 flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
