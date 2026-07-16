import { z } from "zod";
import { DonationType, PaymentMethod } from "@prisma/client";

export const createDonationSchema = z
  .object({
    donorId: z.string().uuid("Donatur tidak valid"),
    donationType: z.nativeEnum(DonationType, {
      message: "Jenis donasi tidak valid",
    }),
    paymentMethod: z.nativeEnum(PaymentMethod, {
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
  .refine(
    (data) => {
      if (data.paymentMethod === PaymentMethod.BANK_TRANSFER) {
        return !!data.transferProofPath && !!data.transferProofFilename;
      }
      return true;
    },
    {
      message: "Bukti transfer harus diunggah untuk pembayaran bank transfer",
      path: ["transferProofPath"],
    }
  );

export type CreateDonationInput = z.infer<typeof createDonationSchema>;
