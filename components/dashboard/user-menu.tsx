"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon, User, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/i18n";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

interface UserMenuProps {
  userEmail?: string;
  role?: string;
}

export function UserMenu({ userEmail, role }: UserMenuProps) {
  const { theme, setTheme } = useTheme();
  const { t } = useLanguage();
  const mounted = useMounted();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
        title={userEmail}
      >
        <Avatar email={userEmail} />
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>
          <p className="truncate text-foreground font-medium">{userEmail}</p>
          <p className="capitalize">{role?.toLowerCase()}</p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => mounted && setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
