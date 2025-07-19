"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAuthCookie } from "@/lib/auth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  // Mock users for demo
  const mockUsers = [
    {
      email: "admin@school.edu",
      password: "admin123",
      role: "admin",
      name: "Admin User",
    },
    {
      email: "teacher@school.edu",
      password: "teacher123",
      role: "teacher",
      name: "John Teacher",
    },
    {
      email: "student@school.edu",
      password: "student123",
      role: "student",
      name: "Jane Student",
    },
  ];

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const userData = { ...user, id: Date.now().toString() };

      // Set authentication cookie and localStorage
      setAuthCookie(userData);

      // Redirect to intended page or dashboard
      router.push(redirectTo);
      router.refresh();
    } else {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {redirectTo !== "/dashboard" && (
          <Alert className="mb-4">
            <AlertDescription>
              You need to sign in to access that page. You'll be redirected
              after signing in.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Demo Accounts:</p>
          <div className="text-xs text-blue-700 mt-2 space-y-1">
            <div>Admin: admin@school.edu / admin123</div>
            <div>Teacher: teacher@school.edu / teacher123</div>
            <div>Student: student@school.edu / student123</div>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center text-sm">
            {"Don't have an account? "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
