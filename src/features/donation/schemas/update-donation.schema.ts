import { z } from "zod";
import { DONATION_TYPES } from "@/constants/donation-types";
import { PAYMENT_METHODS } from "@/constants/payment-methods";

export const updateDonationSchema = z
  .object({
    donationType: z.nativeEnum(DONATION_TYPES, {
      message: "Jenis donasi tidak valid",
    }),
    paymentMethod: z.nativeEnum(PAYMENT_METHODS, {
      message: "Metode pembayaran tidak valid",
    }),
    amount: z
      .number({ message: "Jumlah donasi harus berupa angka" })
      .min(0, "Jumlah donasi tidak boleh negatif"),
    itemDescription: z.string().optional(),
    notes: z.string().optional(),
    transferProofPath: z.string().optional(),
    transferProofFilename: z.string().optional(),
    donationDate: z.date(),
  })
  .superRefine((data, ctx) => {
    if (data.donationType === DONATION_TYPES.BARANG) {
      if (!data.itemDescription || data.itemDescription.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Deskripsi barang harus diisi untuk donasi barang",
          path: ["itemDescription"],
        });
      }
    } else {
      if (data.amount <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Jumlah donasi harus lebih besar dari 0",
          path: ["amount"],
        });
      }
    }

    if (!data.transferProofPath || !data.transferProofFilename) {
      let message = "Bukti pembayaran harus diunggah untuk pembayaran tunai";
      if (data.donationType === DONATION_TYPES.BARANG) {
        message = "Bukti penyerahan harus diunggah untuk donasi barang";
      } else if (data.paymentMethod === PAYMENT_METHODS.BANK_TRANSFER) {
        message = "Bukti transfer harus diunggah untuk pembayaran bank transfer";
      }

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
        path: ["transferProofPath"],
      });
    }
  });

export type UpdateDonationInput = z.infer<typeof updateDonationSchema>;
