"use client";

import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/lib/i18n";
import { PanelLeftClose } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "../ui/icon";
import { UserMenu } from "./user-menu";

interface DashboardHeaderProps {
  userEmail?: string;
  role?: string;
  links: SidebarLink[];
}

interface SidebarLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function DashboardHeader({
  userEmail,
  role,
  links,
}: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="flex min-h-16 items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center size-10 rounded-lg bg-primary">
            <Icon />
          </div>
          <span className="text-lg font-semibold">Masterclass</span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          <UserMenu userEmail={userEmail} role={role} links={links} />
        </div>
      </div>
    </header>
  );
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
      className={`hidden h-full shrink-0 flex-col border-r border-border bg-muted/40 transition-all duration-300 ease-in-out md:flex ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse Button */}
      <div className="flex items-center justify-end border-b border-border p-2 md:p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex size-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          aria-expanded={!collapsed}
          type="button"
        >
          <PanelLeftClose
            className={`h-5 w-5 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-2 md:p-4">
        {!collapsed && (
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground max-md:hidden">
            {t("navigation")}
          </h2>
        )}
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              href={link.href}
              className={`group relative flex items-center justify-center gap-3 rounded-lg px-2 py-3 transition-all duration-200 md:justify-start md:px-4 ${
                isActive(link.href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              {link.icon}
              <span
                className={`text-sm font-medium transition-opacity duration-200 ${
                  collapsed ? "hidden opacity-0" : "opacity-100 max-md:hidden"
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
