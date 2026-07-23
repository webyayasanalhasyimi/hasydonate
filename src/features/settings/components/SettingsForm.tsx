"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, type SettingsFormValues } from "../schemas/settings.schema";
import { type FoundationSettingsDto } from "../types";
import { getSettingsAction } from "@/server/actions/settings/get-settings";
import { updateSettingsAction } from "@/server/actions/settings/update-settings";
import { uploadLogoAction } from "@/server/actions/settings/upload-logo";
import { useSettingsFormWarning } from "../hooks/useSettingsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/lib/icons";
import { toast } from "sonner";

export function SettingsForm() {
  const [initialData, setInitialData] = useState<FoundationSettingsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      foundationName: "",
      foundationAddress: "",
      foundationPhone: "",
      foundationEmail: "",
      foundationWebsite: "",
      foundationLogoPath: "",
      bankName: "",
      bankAccountNumber: "",
      bankAccountName: "",
      receiptFooterMessage: "",
      receiptPreparedBy: "",
      receiptSignatureName: "",
      receiptSignaturePosition: "",
      receiptDefaultTemplate: "a5-default",
    },
  });

  const { register, handleSubmit, setValue, reset, formState: { errors, isDirty } } = form;
  
  // Custom unsaved changes interceptor
  useSettingsFormWarning(isDirty);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const res = await getSettingsAction();
      setIsLoading(false);

      if (res.success) {
        setInitialData(res.data);
        reset(res.data);
        if (res.data.logoUrl) {
          setLogoPreview(res.data.logoUrl);
        }
      } else {
        toast.error("Gagal memuat pengaturan.");
      }
    }
    loadData();
  }, [reset]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Direct pre-upload validations
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file logo maksimal 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", file);

    setIsUploading(true);
    const res = await uploadLogoAction(formData);
    setIsUploading(false);

    if (res.success) {
      setValue("foundationLogoPath", res.data, { shouldDirty: true });
      // Create local URL for instant display
      setLogoPreview(URL.createObjectURL(file));
      toast.success("Logo berhasil diunggah.");
    } else {
      toast.error(res.error.message || "Gagal mengunggah logo.");
    }
  };

  const handleRemoveLogo = () => {
    setValue("foundationLogoPath", "", { shouldDirty: true });
    setLogoPreview(null);
  };

  const onSubmit = (values: SettingsFormValues) => {
    startTransition(async () => {
      const res = await updateSettingsAction(values, initialData?.foundationLogoPath);
      if (res.success) {
        toast.success("Pengaturan berhasil disimpan.");
        // Sync states to reset dirty checks
        const nextData: FoundationSettingsDto = {
          ...values,
          ...(logoPreview ? { logoUrl: logoPreview } : {}),
        };
        setInitialData(nextData);
        reset(values);
      } else {
        toast.error(res.error.message || "Gagal menyimpan pengaturan.");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Icons.Spinner className="h-8 w-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Memuat Pengaturan...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Save Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl font-bold text-foreground">Pengaturan Yayasan</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Konfigurasi profil organisasi, bank penerima, dan stempel kwitansi.
          </p>
        </div>
        <Button type="submit" disabled={!isDirty || isPending || isUploading}>
          {isPending ? (
            <>
              <Icons.Spinner className="h-4 w-4 animate-spin mr-2" />
              Menyimpan...
            </>
          ) : (
            <>
              <Icons.Check className="h-4 w-4 mr-2" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Foundation Profile Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-border bg-muted/10">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Profil Yayasan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Nama Yayasan</label>
                  <Input {...register("foundationName")} placeholder="Nama Resmi Yayasan" />
                  {errors.foundationName && (
                    <span className="text-xs text-destructive">{errors.foundationName.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">No. Telepon / WA</label>
                  <Input {...register("foundationPhone")} placeholder="Contoh: 0878..." />
                  {errors.foundationPhone && (
                    <span className="text-xs text-destructive">{errors.foundationPhone.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Email Resmi</label>
                  <Input {...register("foundationEmail")} placeholder="info@domain.com" />
                  {errors.foundationEmail && (
                    <span className="text-xs text-destructive">{errors.foundationEmail.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Website</label>
                  <Input {...register("foundationWebsite")} placeholder="https://..." />
                  {errors.foundationWebsite && (
                    <span className="text-xs text-destructive">{errors.foundationWebsite.message}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Alamat Kantor</label>
                <Textarea {...register("foundationAddress")} placeholder="Alamat lengkap yayasan..." rows={3} />
                {errors.foundationAddress && (
                  <span className="text-xs text-destructive">{errors.foundationAddress.message}</span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bank Details Card */}
          <Card>
            <CardHeader className="pb-3 border-b border-border bg-muted/10">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Rekening Penerima
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Nama Bank</label>
                  <Input {...register("bankName")} placeholder="BSI / Mandiri / BCA" />
                  {errors.bankName && (
                    <span className="text-xs text-destructive">{errors.bankName.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Nomor Rekening</label>
                  <Input {...register("bankAccountNumber")} placeholder="Nomor rekening bank..." />
                  {errors.bankAccountNumber && (
                    <span className="text-xs text-destructive">{errors.bankAccountNumber.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Pemilik Rekening</label>
                  <Input {...register("bankAccountName")} placeholder="Nama pemilik rekening..." />
                  {errors.bankAccountName && (
                    <span className="text-xs text-destructive">{errors.bankAccountName.message}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Receipt Configurations */}
          <Card>
            <CardHeader className="pb-3 border-b border-border bg-muted/10">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Administrasi Kwitansi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Pihak Penerima (Received By)</label>
                  <Input {...register("receiptPreparedBy")} placeholder="Nama petugas penerima default" />
                  {errors.receiptPreparedBy && (
                    <span className="text-xs text-destructive">{errors.receiptPreparedBy.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Pihak Pengetahui (Approved By)</label>
                  <Input {...register("receiptSignatureName")} placeholder="Nama pejabat yayasan" />
                  {errors.receiptSignatureName && (
                    <span className="text-xs text-destructive">{errors.receiptSignatureName.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Jabatan Pengetahui (Approved By Position)</label>
                  <Input {...register("receiptSignaturePosition")} placeholder="Ketua / Kepala Yayasan" />
                  {errors.receiptSignaturePosition && (
                    <span className="text-xs text-destructive">{errors.receiptSignaturePosition.message}</span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Pesan Terima Kasih Kwitansi</label>
                <Textarea {...register("receiptFooterMessage")} placeholder="Tulis pesan apresiasi donatur..." rows={3} />
                {errors.receiptFooterMessage && (
                  <span className="text-xs text-destructive">{errors.receiptFooterMessage.message}</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Image Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3 border-b border-border bg-muted/10">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Logo Yayasan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-center">
              {logoPreview ? (
                <div className="space-y-3">
                  <div className="relative aspect-square w-full max-w-[150px] mx-auto border border-border rounded-xl overflow-hidden bg-muted/10 flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoPreview} alt="Logo Preview" className="object-contain max-h-full max-w-full" />
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleRemoveLogo}>
                      <Icons.Trash className="h-4 w-4 mr-2 text-destructive" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-muted/5">
                  <Icons.Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Unggah Logo Resmi</span>
                  <span className="text-[10px] text-muted-foreground">Format PNG/JPG/JPEG, Maks 2MB</span>
                  <label className="cursor-pointer mt-2">
                    <span className="inline-flex items-center justify-center rounded-md text-xs font-bold h-8 px-3 border border-border bg-background hover:bg-muted text-foreground transition-all">
                      Pilih File
                    </span>
                    <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleLogoUpload} className="hidden" disabled={isUploading} />
                  </label>
                  {isUploading && (
                    <span className="text-[10px] text-muted-foreground animate-pulse mt-1">Mengunggah...</span>
                  )}
                </div>
              )}
              {errors.foundationLogoPath && (
                <span className="text-xs text-destructive block mt-1">{errors.foundationLogoPath.message}</span>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
export type SettingsFormPropsType = typeof SettingsForm;
