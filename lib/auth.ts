// Enhanced authentication utilities with cookie management and locale support
export interface User {
  email: string
  role: string
  name: string
  id: string
}

// Set authentication cookie
export const setAuthCookie = (user: User) => {
  if (typeof window !== "undefined") {
    const userData = JSON.stringify(user)
    const encodedData = encodeURIComponent(userData)

    // Set cookie with expiration (7 days)
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + 7)

    document.cookie = `auth-token=${encodedData}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`

    // Also store in localStorage for client-side access
    localStorage.setItem("currentUser", userData)
  }
}

// Remove authentication cookie
export const removeAuthCookie = () => {
  if (typeof window !== "undefined") {
    document.cookie = "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict"
    localStorage.removeItem("currentUser")
  }
}

// Get current user from localStorage (client-side)
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  return userStr ? JSON.parse(userStr) : null
}

// Get current user from cookie (server-side compatible)
export const getCurrentUserFromCookie = (): User | null => {
  if (typeof window === "undefined") return null

  const cookies = document.cookie.split(";")
  const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth-token="))

  if (!authCookie) return null

  try {
    const tokenValue = authCookie.split("=")[1]
    const userData = JSON.parse(decodeURIComponent(tokenValue))
    return userData
  } catch (error) {
    return null
  }
}

export const signOut = () => {
  removeAuthCookie()
}

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null || getCurrentUserFromCookie() !== null
}

export const hasRole = (requiredRole: string): boolean => {
  const user = getCurrentUser() || getCurrentUserFromCookie()
  if (!user) return false

  // Admin has access to everything
  if (user.role === "admin") return true

  return user.role === requiredRole
}

// Check if user has access to specific route
export const hasRouteAccess = (route: string): boolean => {
  const user = getCurrentUser() || getCurrentUserFromCookie()
  if (!user) return false

  const roleBasedRoutes = {
    admin: ["/dashboard", "/students", "/teachers", "/courses", "/classrooms", "/notes", "/reports"],
    teacher: ["/dashboard", "/students", "/courses", "/classrooms", "/notes", "/reports"],
    student: ["/dashboard", "/courses", "/notes"],
  }

  const allowedRoutes = roleBasedRoutes[user.role as keyof typeof roleBasedRoutes] || []
  return allowedRoutes.some((allowedRoute) => route.startsWith(allowedRoute))
}

// Get current locale from pathname
export const getCurrentLocale = (): string => {
  if (typeof window === "undefined") return "en"

  const pathname = window.location.pathname
  const locale = pathname.split("/")[1]
  return ["en", "fr"].includes(locale) ? locale : "en"
}

// Redirect with locale preservation
export const redirectWithLocale = (path: string): string => {
  const locale = getCurrentLocale()
  return `/${locale}${path}`
}
