// Simple authentication utilities for demo purposes
export interface User {
  email: string
  role: string
  name: string
  id: string
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("currentUser")
  return userStr ? JSON.parse(userStr) : null
}

export const signOut = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}

export const hasRole = (requiredRole: string): boolean => {
  const user = getCurrentUser()
  if (!user) return false

  // Admin has access to everything
  if (user.role === "admin") return true

  return user.role === requiredRole
}
