import { z } from "zod";
import { DONATION_TYPES } from "@/constants/donation-types";
import { PAYMENT_METHODS } from "@/constants/payment-methods";

export const createDonationSchema = z
  .object({
    donorId: z.string().uuid("Donatur tidak valid"),
    donationType: z.nativeEnum(DONATION_TYPES, {
      message: "Jenis donasi tidak valid",
    }),
    paymentMethod: z.nativeEnum(PAYMENT_METHODS, {
      message: "Metode pembayaran tidak valid",
    }),
    amount: z
      .number({ message: "Jumlah donasi harus berupa angka" })
      .positive("Jumlah donasi harus lebih besar dari 0"),
    notes: z.string().optional(),
    transferProofPath: z.string().optional(),
    transferProofFilename: z.string().optional(),
    donationDate: z.coerce.date().default(() => new Date()),
  })
  .superRefine((data, ctx) => {
    if (!data.transferProofPath || !data.transferProofFilename) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          data.paymentMethod === PAYMENT_METHODS.BANK_TRANSFER
            ? "Bukti transfer harus diunggah untuk pembayaran bank transfer"
            : "Bukti pembayaran harus diunggah untuk pembayaran tunai",
        path: ["transferProofPath"],
      });
    }
  });

export type CreateDonationInput = z.infer<typeof createDonationSchema>;
