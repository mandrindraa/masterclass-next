import { Card } from "@/components/ui/card"
import {NavTitle} from "@/components/ui/nav-title"
import { PaginationComponent } from "@/components/ui/pagination"
import { PAGE_SIZE } from "@/constants"
import { Role } from "@/lib/generated/prisma/enums"
import prisma from "@/lib/prisma"
export default async function Users({ searchParams
  }:{
    readonly searchParams: Promise<{ page?: number }>;
  }) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const [counts, users] = await Promise.all([
    prisma.user.count({ where: { role: { not: Role.SURVEILLANT } } }),
    prisma.user.findMany({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      where: {
        role: { not: Role.SURVEILLANT }
      }
    })
  ]);
  const totalPages = Math.ceil(counts / PAGE_SIZE);
  return (
    <>
      <div className="space-y-6">
        <NavTitle h1="User management" h2="Manage registered users" />

        <Card className="bg-slate-900 border-slate-800 p-6">
          {
            users.map(function (u) {
              return (
                <div key={u.id}>
                  <p className="text-white"> test </p>
                </div>
              )
            })
          }
        </Card>
        <PaginationComponent basePath="/dashboard/surveillant/users" page={page} totalPages={totalPages} />
      </div>
    </>
  )
}
