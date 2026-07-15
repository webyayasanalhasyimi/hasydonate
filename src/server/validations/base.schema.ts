import { z } from "zod";

export const uuidSchema = z.string().uuid({ message: "Invalid UUID format" });

export const phoneNumberSchema = z
  .string()
  .min(10, { message: "Phone number must be at least 10 digits" })
  .max(15, { message: "Phone number must not exceed 15 digits" })
  .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" });

export const paginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const idrAmountSchema = z.coerce
  .number()
  .positive({ message: "Amount must be greater than zero" });
export type PaginationParamsSchema = z.infer<typeof paginationParamsSchema>;
