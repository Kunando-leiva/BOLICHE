import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;

// Creamos el pool de conexiones usando 'pg'
const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter }); // <-- Le pasamos el adaptador aquí

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;