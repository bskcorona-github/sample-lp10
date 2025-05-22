import { PrismaClient } from "@prisma/client";

// PrismaClientは開発中にホットリロードの際に複数のインスタンスが作成されるのを防ぐためのシングルトン
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
