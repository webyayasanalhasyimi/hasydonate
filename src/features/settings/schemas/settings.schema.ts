import { z } from "zod";

export const settingsSchema = z.object({
  foundationName: z.string().min(2, "Nama Yayasan harus diisi minimal 2 karakter"),
  foundationAddress: z.string().min(5, "Alamat harus diisi minimal 5 karakter"),
  foundationPhone: z.string().regex(/^\+?[0-9]{10,15}$/, "Nomor telepon tidak valid (10-15 digit)"),
  foundationEmail: z.string().email("Format email tidak valid"),
  foundationWebsite: z.string().url("Format website URL tidak valid (harus diawali http:// atau https://)"),
  foundationLogoPath: z.string(),
  
  bankName: z.string().min(2, "Nama Bank harus diisi"),
  bankAccountNumber: z.string().regex(/^[0-9]+$/, "Nomor rekening harus berupa angka saja"),
  bankAccountName: z.string().min(2, "Nama pemilik rekening harus diisi"),
  
  receiptFooterMessage: z.string().min(5, "Pesan terima kasih kwitansi minimal 5 karakter"),
  receiptPreparedBy: z.string().min(2, "Nama pembuat kwitansi minimal 2 karakter"),
  receiptSignatureName: z.string().min(2, "Nama penanggung jawab kwitansi minimal 2 karakter"),
  receiptSignaturePosition: z.string().min(2, "Jabatan penanggung jawab minimal 2 karakter"),
  receiptDefaultTemplate: z.string().min(2, "Pilih template default"),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;
