import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheck, BookOpen, Building, FileText, GraduationCap } from "lucide-react"

interface DashboardOverviewProps {
  userRole: string
}

export function DashboardOverview({ userRole }: DashboardOverviewProps) {
  const stats = [
    { title: "Total Students", value: "1,234", icon: GraduationCap, color: "text-blue-600" },
    { title: "Total Teachers", value: "89", icon: UserCheck, color: "text-green-600" },
    { title: "Active Courses", value: "45", icon: BookOpen, color: "text-purple-600" },
    { title: "Classrooms", value: "23", icon: Building, color: "text-orange-600" },
    { title: "Notes", value: "567", icon: FileText, color: "text-red-600" },
  ]

  const filteredStats =
    userRole === "admin"
      ? stats
      : userRole === "teacher"
        ? stats.filter((stat) => !["Total Teachers"].includes(stat.title))
        : stats.filter((stat) => ["Active Courses", "Notes"].includes(stat.title))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome to your school management dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {filteredStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New student enrolled: John Doe</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">Course "Mathematics 101" updated</p>
                  <p className="text-sm text-muted-foreground">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">New classroom assigned: Room 205</p>
                  <p className="text-sm text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userRole === "admin" && (
                <>
                  <div className="text-sm">• Add new student</div>
                  <div className="text-sm">• Create course</div>
                  <div className="text-sm">• Assign classroom</div>
                </>
              )}
              {userRole === "teacher" && (
                <>
                  <div className="text-sm">• View my students</div>
                  <div className="text-sm">• Add course notes</div>
                  <div className="text-sm">• Update grades</div>
                </>
              )}
              {userRole === "student" && (
                <>
                  <div className="text-sm">• View my courses</div>
                  <div className="text-sm">• Access notes</div>
                  <div className="text-sm">• Check schedule</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
