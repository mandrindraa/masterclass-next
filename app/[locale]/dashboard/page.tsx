"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { getCurrentUser, getCurrentUserFromCookie } from "@/lib/auth"
import { useTranslations } from "next-intl"

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
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations("common")

  useEffect(() => {
    // Try to get user from localStorage first, then from cookie
    const currentUser = getCurrentUser() || getCurrentUserFromCookie()

    if (currentUser) {
      setUser(currentUser)
    } else {
      // If no user found, redirect to signin with locale
      router.push(`/${locale}/auth/signin`)
      return
    }

    setLoading(false)
  }, [router, locale])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">{t("loading")}</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <DashboardContent userRole={user.role} user={user} />
}
