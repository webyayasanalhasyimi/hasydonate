import { z } from "zod";

export const createDonorSchema = z.object({
  fullName: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(150, "Nama maksimal 150 karakter"),
  address: z
    .string()
    .min(5, "Alamat minimal 5 karakter"),
  phoneNumber: z
    .string()
    .regex(/^(?:\+62|62|0)8[1-9]\d{7,11}$/, "Nomor WhatsApp harus nomor Indonesia yang valid (contoh: 081234567890)"),
});

export type CreateDonorInput = z.infer<typeof createDonorSchema>;
