"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserCheck, BookOpen, Building, FileText, LayoutDashboard, GraduationCap, FileBarChart } from "lucide-react"
import { useTranslations } from "next-intl"

interface SidebarProps {
  userRole: string
  activeTab: string
  setActiveTab: (tab: string) => void
}

export function Sidebar({ userRole, activeTab, setActiveTab }: SidebarProps) {
  const t = useTranslations("navigation")
  const tRoles = useTranslations("roles")

  const menuItems = [
    { id: "overview", label: t("overview"), icon: LayoutDashboard, roles: ["admin", "teacher", "student"] },
    { id: "students", label: t("students"), icon: GraduationCap, roles: ["admin", "teacher"] },
    { id: "teachers", label: t("teachers"), icon: UserCheck, roles: ["admin"] },
    { id: "courses", label: t("courses"), icon: BookOpen, roles: ["admin", "teacher", "student"] },
    { id: "classrooms", label: t("classrooms"), icon: Building, roles: ["admin", "teacher"] },
    { id: "notes", label: t("notes"), icon: FileText, roles: ["admin", "teacher", "student"] },
    { id: "reports", label: t("reports"), icon: FileBarChart, roles: ["admin", "teacher"] },
  ]

  const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole))

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return tRoles("adminPanel")
      case "teacher":
        return tRoles("teacherPanel")
      case "student":
        return tRoles("studentPanel")
      default:
        return role
    }
  }

  return (
    <div className="bg-white w-64 shadow-lg">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800">School MS</h2>
        <p className="text-sm text-gray-600">{getRoleLabel(userRole)}</p>
      </div>
      <nav className="mt-6">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={cn(
                "w-full justify-start px-6 py-3 text-left",
                activeTab === item.id && "bg-primary/10 text-primary border-r-2 border-primary",
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
