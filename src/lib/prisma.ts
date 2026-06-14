/**
 * @module lib/prisma
 * @description Singleton Prisma client with hot-reload protection for Next.js development.
 * Prevents multiple PrismaClient instances during HMR.
 */

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
