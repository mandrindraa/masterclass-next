/**
 * types/next-auth.d.ts
 * Extend NextAuth types to include role and status on session/token.
 */

import { Role, UserStatus } from "@/lib/generated/prisma";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    role: Role;
    status: UserStatus;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      role: Role;
      status: UserStatus;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: UserStatus;
  }
}
