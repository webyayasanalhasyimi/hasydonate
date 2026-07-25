"use client";

import React, { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getProofUrlAction } from "@/server/actions/donation/get-proof-url";
import { useForm, Controller, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type DonationDetailDto } from "../types";
import { updateDonationAction } from "@/server/actions/donation/update-donation";
import { uploadTransferProofAction } from "@/server/actions/donation/upload-transfer-proof";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/lib/icons";
import { DONATION_TYPES } from "@/constants/donation-types";
import { PAYMENT_METHODS } from "@/constants/payment-methods";
import { CurrencyInput } from "./CurrencyInput";
import { DONATION_ROUTES } from "../config";
import { useEffect } from "react";
import { z } from "zod";

const clientUpdateSchema = z
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
    donationDate: z.string().min(1, "Tanggal donasi harus diisi"),
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

interface FormInput {
  donationType: "ZAKAT" | "SHADAQAH" | "SUMBANGAN_LAIN" | "BARANG";
  paymentMethod: "CASH" | "BANK_TRANSFER";
  amount: number;
  itemDescription?: string | undefined;
  notes?: string | undefined;
  transferProofPath?: string | undefined;
  transferProofFilename?: string | undefined;
  donationDate: string;
}

interface EditDonationFormProps {
  readonly donation: DonationDetailDto;
}

export function EditDonationForm({ donation }: EditDonationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for loaded preview url
  const [proofPreviewUrl, setProofPreviewUrl] = useState<string | null>(null);

  // Initialize the form with existing values
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(clientUpdateSchema) as Resolver<FormInput>,
    defaultValues: {
      donationType: donation.donationType,
      paymentMethod: donation.paymentMethod,
      amount: donation.amount,
      itemDescription: donation.itemDescription ?? "",
      notes: donation.notes ?? "",
      transferProofPath: donation.transferProofPath ?? undefined,
      transferProofFilename: donation.transferProofFilename ?? undefined,
      donationDate: (donation.donationDate ? new Date(donation.donationDate).toISOString().split("T")[0] : "") as string,
    },
  });

  const selectedType = watch("donationType");
  const selectedPaymentMethod = watch("paymentMethod");
  const transferProofPath = watch("transferProofPath");
  const transferProofFilename = watch("transferProofFilename");

  const isBarang = selectedType === DONATION_TYPES.BARANG;
  const isCash = selectedPaymentMethod === PAYMENT_METHODS.CASH;

  // Local state for uploaded file preview if it is an image
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Fetch signed URL on mount for preview
  useEffect(() => {
    if (donation.transferProofPath) {
      getProofUrlAction(donation.transferProofPath).then((res) => {
        if (res.success) {
          setProofPreviewUrl(res.data);
        }
      });
    }
  }, [donation.transferProofPath]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file melebihi batas 10 MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadTransferProofAction(formData);
    setIsUploading(false);

    if (res.success) {
      setValue("transferProofPath", res.data.path);
      setValue("transferProofFilename", res.data.filename);
      
      if (file.type.startsWith("image/")) {
        setLocalPreview(URL.createObjectURL(file));
      } else {
        setLocalPreview(null);
      }
      toast.success("Bukti berhasil diunggah");
    } else {
      toast.error(res.error.message || "Gagal mengunggah bukti");
    }
  };

  const handleRemoveFile = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
    setValue("transferProofPath", undefined);
    setValue("transferProofFilename", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit: SubmitHandler<FormInput> = (values) => {
    startTransition(async () => {
      const payload = {
        ...values,
        donationDate: values.donationDate ? new Date(values.donationDate) : new Date(),
      };
      const res = await updateDonationAction(donation.id, payload);
      if (res.success) {
        toast.success("Data donasi berhasil diperbarui");
        router.push(DONATION_ROUTES.DETAIL(donation.id));
        router.refresh();
      } else {
        toast.error(res.error.message || "Gagal memperbarui data donasi");
      }
    });
  };

  const proofLabel = isBarang
    ? "Bukti Penyerahan"
    : isCash
    ? "Bukti Pembayaran Tunai"
    : "Bukti Transfer";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit Transaksi Donasi</h1>
          <p className="text-sm text-muted-foreground">Perbarui informasi donasi dan data tanda terima.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(DONATION_ROUTES.DETAIL(donation.id))}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isPending || isUploading}>
            {isPending && <Icons.Spinner className="h-4 w-4 mr-2 animate-spin" />}
            Simpan Perubahan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rincian Donasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Row 1: Date & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Tanggal Donasi</label>
                  <Controller
                    control={control}
                    name="donationDate"
                    render={({ field }) => (
                      <Input
                        type="date"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    )}
                  />
                  {errors.donationDate && (
                    <span className="text-xs text-destructive font-medium">{errors.donationDate.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Jenis Donasi</label>
                  <Controller
                    control={control}
                    name="donationType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis donasi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DONATION_TYPES.SHADAQAH}>Shadaqah</SelectItem>
                          <SelectItem value={DONATION_TYPES.ZAKAT}>Zakat</SelectItem>
                          <SelectItem value={DONATION_TYPES.SUMBANGAN_LAIN}>Sumbangan Lain</SelectItem>
                          <SelectItem value={DONATION_TYPES.BARANG}>Barang</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.donationType && (
                    <span className="text-xs text-destructive font-medium">{errors.donationType.message}</span>
                  )}
                </div>
              </div>

              {/* Row 2: Payment Method (if not Barang) & Spelled/Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {!isBarang && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Metode Pembayaran</label>
                    <Controller
                      control={control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih metode pembayaran" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={PAYMENT_METHODS.CASH}>Tunai</SelectItem>
                            <SelectItem value={PAYMENT_METHODS.BANK_TRANSFER}>Transfer Bank</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.paymentMethod && (
                      <span className="text-xs text-destructive font-medium">{errors.paymentMethod.message}</span>
                    )}
                  </div>
                )}

                {isBarang ? (
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-semibold text-foreground">Deskripsi Barang</label>
                    <Textarea
                      {...register("itemDescription")}
                      placeholder="Contoh: 10 kg beras, 5 dus air mineral..."
                      className="resize-none"
                      rows={3}
                    />
                    {errors.itemDescription && (
                      <span className="text-xs text-destructive font-medium">{errors.itemDescription.message}</span>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Jumlah Donasi</label>
                    <Controller
                      control={control}
                      name="amount"
                      render={({ field }) => (
                        <CurrencyInput value={field.value} onChange={field.onChange} />
                      )}
                    />
                    {errors.amount && (
                      <span className="text-xs text-destructive font-medium">{errors.amount.message}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Keterangan / Catatan</label>
                <Textarea
                  {...register("notes")}
                  placeholder="Masukkan keterangan tambahan jika ada..."
                  className="resize-none"
                  rows={3}
                />
                {errors.notes && (
                  <span className="text-xs text-destructive font-medium">{errors.notes.message}</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Read-Only Donatur Info */}
          <Card className="bg-muted/10 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Profil Donatur (Tidak Dapat Diubah)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block text-xs">Nama Donatur</span>
                <span className="font-semibold">{donation.donorName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Nomor WhatsApp</span>
                <span className="font-semibold">{donation.donorPhone || "-"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Alamat</span>
                <span className="font-semibold">{donation.donorAddress || "-"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Proof Upload */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{proofLabel}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {transferProofPath ? (
                <div className="flex flex-col gap-3 p-3 border border-border bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Icons.FileText className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">
                        {transferProofFilename}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-destructive border-destructive/20 hover:bg-destructive/10 shrink-0"
                    >
                      <Icons.Trash className="h-4 w-4 mr-1" />
                      Ganti
                    </Button>
                  </div>

                  {transferProofFilename?.toLowerCase().endsWith(".pdf") ? (
                    <div className="flex flex-col items-center justify-center p-4 border border-border rounded-lg bg-muted/20 text-center gap-3">
                      <Icons.FileText className="h-10 w-10 text-primary" />
                      <div className="space-y-1">
                        <span className="text-xs font-semibold block truncate max-w-[200px]">
                          {transferProofFilename}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">Dokumen PDF</span>
                      </div>
                      {(localPreview || proofPreviewUrl) && (
                        <a
                          href={localPreview || proofPreviewUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary underline"
                        >
                          Buka PDF
                        </a>
                      )}
                    </div>
                  ) : (
                    (localPreview || proofPreviewUrl) && (
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border bg-background">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={localPreview || proofPreviewUrl || ""}
                          alt="Bukti Pratinjau"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="hidden"
                    id="edit-transfer-proof-file"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="edit-transfer-proof-file"
                    className={`flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors ${
                      isUploading ? "pointer-events-none opacity-60" : ""
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Icons.Spinner className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground font-medium">Mengunggah...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Icons.Plus className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Unggah Bukti Baru</span>
                        <span className="text-xs text-muted-foreground">
                          JPG, JPEG, PNG, atau PDF (Maks. 10 MB)
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              )}
              {errors.transferProofPath && (
                <span className="text-xs text-destructive font-medium block mt-1">{errors.transferProofPath.message}</span>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
