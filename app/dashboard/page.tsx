"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

interface User {
  email: string
  role: string
  name: string
  id: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (currentUser) {
      setUser(JSON.parse(currentUser))
    } else {
      router.push("/auth/signin")
    }
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <DashboardContent userRole={user.role} user={user} />
}
