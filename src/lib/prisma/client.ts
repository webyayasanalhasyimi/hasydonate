import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = (): PrismaClient => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
