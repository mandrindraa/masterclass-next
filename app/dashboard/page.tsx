import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role as string;

  if (role === "SURVEILLANT") {
    redirect("/dashboard/surveillant");
  } else if (role === "TEACHER") {
    redirect("/dashboard/teacher");
  } else if (role === "STUDENT") {
    redirect("/dashboard/student");
  }

  redirect("/login");
}
