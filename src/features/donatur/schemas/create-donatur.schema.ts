import { z } from "zod";

export const createDonorSchema = z.object({
  fullName: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(150, "Nama maksimal 150 karakter"),
  address: z
    .string()
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^(?:\+62|62|0)8[1-9]\d{7,11}$/.test(val),
      { message: "Nomor WhatsApp harus nomor Indonesia yang valid (contoh: 081234567890)" }
    ),
});

export type CreateDonorInput = z.infer<typeof createDonorSchema>;
