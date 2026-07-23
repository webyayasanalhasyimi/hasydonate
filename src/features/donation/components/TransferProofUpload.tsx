"use client";

import React, { useState, useRef } from "react";
import { useDonationPOS } from "../context/donation-pos-context";
import { uploadTransferProofAction } from "@/server/actions/donation/upload-transfer-proof";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { toast } from "sonner";

export function TransferProofUpload() {
  const {
    paymentMethod,
    transferProofPath,
    setTransferProofPath,
    transferProofFilename,
    setTransferProofFilename,
    errors,
    setErrors,
  } = useDonationPOS();

  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCash = paymentMethod === "CASH";
  const labelText = isCash ? "Bukti Pembayaran Tunai" : "Bukti Transfer";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size client-side first
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
      setTransferProofPath(res.data.path);
      setTransferProofFilename(res.data.filename);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.transferProofPath;
        return next;
      });

      // Generate local preview if it's an image
      if (file.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(file);
        setLocalPreview(objectUrl);
      } else {
        setLocalPreview(null);
      }
      toast.success(isCash ? "Bukti pembayaran berhasil diunggah" : "Bukti transfer berhasil diunggah");
    } else {
      toast.error(res.error.message || (isCash ? "Gagal mengunggah bukti pembayaran" : "Gagal mengunggah bukti transfer"));
    }
  };

  const handleRemove = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
    setTransferProofPath(null);
    setTransferProofFilename(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">
          {labelText} <span className="text-destructive">*</span>
        </label>
        {errors.transferProofPath && (
          <span className="text-xs text-destructive font-medium">{errors.transferProofPath}</span>
        )}
      </div>

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
              onClick={handleRemove}
              className="text-destructive border-destructive/20 hover:bg-destructive/10 shrink-0"
            >
              <Icons.Trash className="h-4 w-4 mr-1" />
              Ganti Berkas
            </Button>
          </div>

          {localPreview && (
            <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden border border-border bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={localPreview}
                alt={isCash ? "Pratinjau Bukti Pembayaran" : "Pratinjau Bukti Transfer"}
                className="object-contain w-full h-full"
              />
            </div>
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
            id="transfer-proof-file"
            disabled={isUploading}
          />
          <label
            htmlFor="transfer-proof-file"
            className={`flex flex-col items-center justify-center w-full h-32 px-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors ${
              isUploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Icons.Spinner className="h-8 w-8 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground font-medium">
                  {isCash ? "Mengunggah bukti pembayaran..." : "Mengunggah bukti transfer..."}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <Icons.Plus className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Pilih Berkas Bukti</span>
                <span className="text-xs text-muted-foreground">
                  JPG, JPEG, PNG, atau PDF (Maks. 10 MB)
                </span>
              </div>
            )}
          </label>
        </div>
      )}
    </div>
  );
}
export type TransferProofUploadType = typeof TransferProofUpload;
