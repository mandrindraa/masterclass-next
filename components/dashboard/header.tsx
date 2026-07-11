"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

export function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary">
            <svg
              className="size-6 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold">School Management</span>
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
}

export function DashboardSidebar({ links, role }: DashboardSidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-muted/40 p-6">
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Navigation
        </h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
            >
              {link.icon}
              <span className="text-sm font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
          Role
        </p>
        <p className="text-sm text-muted-foreground capitalize">{role.toLowerCase()}</p>
      </div>
    </aside>
  );
}
