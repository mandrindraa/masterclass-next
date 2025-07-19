"use client";

import type React from "react";

import {
  getCurrentUser,
  getCurrentUserFromCookie,
  hasRouteAccess,
} from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface RouteGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallbackPath?: string;
}

export function RouteGuard({
  children,
  requiredRole,
  fallbackPath = "/dashboard",
}: RouteGuardProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const user = getCurrentUser() || getCurrentUserFromCookie();

      if (!user) {
        // No user found, redirect to signin
        router.push(`/auth/signin?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Check if user has access to current route
      if (!hasRouteAccess(pathname)) {
        router.push(fallbackPath);
        return;
      }

      // Check specific role requirement if provided
      if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
        router.push(fallbackPath);
        return;
      }

      setIsAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [pathname, requiredRole, fallbackPath, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Checking permissions...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
