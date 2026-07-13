"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/icon";

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary">
            <Icon />
          </div>
          <span className="text-lg font-semibold">Masterclass</span>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              signOut({ redirectTo: "/login" });
            }}
          >
            <LogOut className="h-4 w-4" data-icon="inline-start" />
            <span>Sign out</span>
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
  userEmail?: string;
}

export function DashboardSidebar({ links, role, userEmail }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

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
            Navigation
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

      {/* User Profile Section */}
      <Link
        href="/profile"
        className="p-4 border-t border-border hover:bg-card/50 transition-colors"
      >
        {!collapsed && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Profile
              </p>
            </div>
            <p className="text-sm font-medium text-foreground truncate">
              {userEmail || "User"}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {role.toLowerCase()}
            </p>
          </>
        )}
        {collapsed && (
          <div className="flex flex-col items-center gap-2">
            <div
              className="text-xs font-semibold text-muted-foreground uppercase text-center"
              title={`${userEmail} - ${role.toLowerCase()}`}
            >
              {role.slice(0, 1)}
            </div>
          </div>
        )}
      </Link>
    </aside>
  );
}
