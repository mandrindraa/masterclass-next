import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await auth();
  if (!session) return redirect('/login');
  const user = await prisma.user.findUnique({ where: { id: session.user.id }, omit:{passwordHash: true} })
  console.log(user);
  return(
    <>{session?.user.id}</>
  )
}
