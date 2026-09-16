import { PrismaClient } from "@prisma/client";

/**
 * Serverless Connection Pooler Singleton for Prisma
 * Ensures a single PrismaClient instance across hot serverless lambdas on Vercel
 * to prevent database connection exhaustion and reduce cold start latency.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Always cache client on globalThis in serverless environments to reuse pool
globalForPrisma.prisma = prisma;
