/**
 * @module auth
 * @description NextAuth v5 configuration with Credentials provider.
 * JWT strategy with RBAC support.
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/domain/validators";
import { createAuditLog } from "@/lib/security/audit-logger";

declare module "next-auth" {
  interface User {
    role: string;
    profileType: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      profileType: string;
    };
  }
}

declare module "next-auth" {
  interface JWT {
    id: string;
    role: string;
    profileType: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            passwordHash: true,
            role: true,
            profileType: true,
          },
        });

        if (!user) {
          await createAuditLog({
            action: "SECURITY_FAILURE",
            details: `Failed login attempt for email: ${email}`,
          });
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          await createAuditLog({
            userId: user.id,
            action: "SECURITY_FAILURE",
            details: "Invalid password",
          });
          return null;
        }

        await createAuditLog({
          userId: user.id,
          action: "LOGIN",
          details: "Successful login",
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          profileType: user.profileType,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.profileType = user.profileType;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.profileType = token.profileType as string;
      }
      return session;
    },
  },

  trustHost: true,
});
