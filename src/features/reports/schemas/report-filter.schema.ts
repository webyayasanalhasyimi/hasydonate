import { z } from "zod";
import { DONATION_TYPES } from "@/constants/donation-types";
import { PAYMENT_METHODS } from "@/constants/payment-methods";

export const reportFilterSchema = z.object({
  dateStart: z.string().optional(),
  dateEnd: z.string().optional(),
  donationType: z.nativeEnum(DONATION_TYPES).optional(),
  paymentMethod: z.nativeEnum(PAYMENT_METHODS).optional(),
  donorId: z.string().optional(),
  minAmount: z.number().nonnegative().optional(),
  maxAmount: z.number().nonnegative().optional(),
  searchKeyword: z.string().optional(),
  limit: z.number().int().min(1).default(10).optional(),
  cursor: z.string().optional(),
});

export type ReportFilterInputValues = z.infer<typeof reportFilterSchema>;
