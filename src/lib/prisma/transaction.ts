import { prisma } from "./client";
import { type Prisma } from "@prisma/client";

export function runTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(callback);
}
