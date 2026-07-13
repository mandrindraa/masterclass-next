import { Card } from "@/components/ui/card"
import {NavTitle} from "@/components/ui/nav-title"
export default function Users() {
  return (
    <>
      <div className="space-y-6">
        <NavTitle h1="User management" h2="All users are listed below" />

        <Card className="bg-slate-900 border-slate-800 p-6">
          <p className="text-slate-400">Report cards will be displayed here</p>
        </Card>
      </div>
    </>
  )
}
