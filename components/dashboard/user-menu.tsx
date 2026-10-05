"use client";

import { Avatar } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/i18n";
import { LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useSyncExternalStore } from "react";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

interface UserMenuProps {
  userEmail?: string;
  role?: string;
  links: { label: string; href: string; icon: React.ReactNode }[];
}

export function UserMenu({ userEmail, role, links }: UserMenuProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const mounted = useMounted();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex size-11 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Open account menu for ${userEmail ?? "current user"}`}
      >
        <Menu className="size-5 md:hidden" aria-hidden="true" />
        <span className="max-md:hidden">
          <Avatar email={userEmail} />
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <DropdownMenuLabel className="md:hidden">Navigation</DropdownMenuLabel>
        {links.map((link) => (
          <DropdownMenuItem
            key={link.href}
            className="md:hidden"
            render={<Link href={link.href} />}
          >
            {link.icon}
            {link.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="md:hidden" />

        <DropdownMenuLabel>
          <p className="truncate text-foreground font-medium right-0">
            {userEmail}
          </p>
          <p className="capitalize right-0">{role?.toLowerCase()}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() =>
            mounted && setTheme(theme === "dark" ? "light" : "dark")
          }
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </DropdownMenuItem>

        <DropdownMenuItem render={<Link href="/profile" />}>
          <User className="h-4 w-4" />
          {t("profile")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ redirectTo: "/login" })}
          className="text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
