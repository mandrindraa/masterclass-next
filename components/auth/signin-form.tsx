"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
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
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const redirectTo = searchParams.get("redirect") || `/${locale}/dashboard`;
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        // Store user data in localStorage for client-side access
        localStorage.setItem("currentUser", JSON.stringify(data.user));

        // Redirect to intended page or dashboard
        router.push(redirectTo);
        router.refresh();
      } else {
        setError(data.error || t("invalidCredentials"));
      }
    } catch (error) {
      setError(t("invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{t("signinTitle")}</CardTitle>
            <CardDescription>{t("signinSubtitle")}</CardDescription>
          </div>
          <LanguageSwitcher />
        </div>
      </CardHeader>
      <CardContent>
        {redirectTo !== `/${locale}/dashboard` && (
          <Alert className="mb-4">
            <AlertDescription>{t("redirectMessage")}</AlertDescription>
          </Alert>
        )}

        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">
            {t("demoAccounts")}
          </p>
          <div className="text-xs text-blue-700 mt-2 space-y-1">
            <div>{t("admin")}: admin@school.edu / admin123</div>
            <div>{t("teacher")}: sarah.wilson@school.edu / teacher123</div>
            <div>{t("student")}: alice.johnson@school.edu / student123</div>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={t("enterEmail")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t("enterPassword")}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t("signingIn") : t("signin")}
          </Button>

          <div className="text-center text-sm">
            {t("dontHaveAccount")}{" "}
            <Link
              href={`/${locale}/auth/signup`}
              className="text-primary hover:underline"
            >
              {t("signup")}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
