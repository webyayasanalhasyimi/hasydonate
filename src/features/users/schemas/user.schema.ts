import { z } from "zod";
import { Role } from "@prisma/client";

export const userFormSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: z.nativeEnum(Role),
  isActive: z.boolean().default(true),
  password: z
    .string()
    .default("")
    .refine((val) => val === "" || val.length >= 6, {
      message: "Kata sandi harus minimal 6 karakter jika diisi",
    }),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
