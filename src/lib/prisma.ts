// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Prisma client generation issue
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  globalForPrisma.prisma = prisma;
}
