import { z } from "zod";
import { DonationType, PaymentMethod } from "@prisma/client";

export const reportFilterSchema = z.object({
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  donationType: z.nativeEnum(DonationType).optional(),
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  donorId: z.string().optional(),
  minAmount: z.number().nonnegative().optional(),
  maxAmount: z.number().nonnegative().optional(),
  searchKeyword: z.string().optional(),
  limit: z.number().int().min(1).default(10).optional(),
  cursor: z.string().optional(),
});

export type ReportFilterInputValues = z.infer<typeof reportFilterSchema>;
