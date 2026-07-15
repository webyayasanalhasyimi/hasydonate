import { prisma } from "@/lib/prisma/client";
import { type AuditLog, type Prisma } from "@prisma/client";

export const AuditLogService = {
  getById(id: string): Promise<AuditLog | null> {
    return prisma.auditLog.findUnique({ where: { id } });
  },

  create(data: Prisma.AuditLogUncheckedCreateInput): Promise<AuditLog> {
    return prisma.auditLog.create({ data });
  },
};
export type AuditLogServiceType = typeof AuditLogService;
