"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n";
import { LogOut, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "../ui/icon";

interface DashboardHeaderProps {
  userEmail?: string;
  role?: string;
}

export function DashboardHeader({ userEmail, role }: DashboardHeaderProps) {
  const { t } = useLanguage();

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary">
            <Icon/>
          </div>
          <span className="text-lg font-semibold">Masterclass</span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />

          {/* Profile, moved here from the sidebar bottom-left */}
          {userEmail && (
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground truncate max-w-40">
                  {userEmail}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {role?.toLowerCase()}
                </p>
              </div>
            </Link>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              signOut({ redirectTo: "/login" });
            }}
          >
            <LogOut className="h-4 w-4" data-icon="inline-start" />
            <span>{t("signOut")}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardSidebarProps {
  links: SidebarLink[];
  role: string;
}

export function DashboardSidebar({ links }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <aside
      className={`border-r border-border bg-muted/40 transition-all duration-300 ease-in-out flex flex-col h-[calc(100vh-64px)] ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Button */}
      <div className="flex items-center justify-end p-4 border-b border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-card rounded-lg transition-colors"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        {!collapsed && (
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {t("navigation")}
          </h2>
        )}
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 relative group ${
                isActive(link.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {link.icon}
              <span
                className={`text-sm font-medium transition-opacity duration-200 ${
                  collapsed ? "opacity-0 hidden" : "opacity-100"
                }`}
              >
                {link.label}
              </span>

              {/* Hover Label Tooltip */}
              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {link.label}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
