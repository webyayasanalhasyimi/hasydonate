"use client";

import React, { useState } from "react";
import { type ReceiptData } from "../types";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { toast } from "sonner";
import { printReceipt } from "../renderers/print-renderer";

interface ReceiptDownloadButtonProps {
  readonly data: ReceiptData;
}

export function ReceiptDownloadButton({ data }: ReceiptDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const { generateReceiptPdfBlob } = await import("../renderers/pdf-renderer");
      const blob = await generateReceiptPdfBlob(data);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Kwitansi-${data.receiptNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Kwitansi PDF berhasil diunduh");
    } catch (err) {
      console.error(err);
      toast.error("Gagal membuat atau mengunduh PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={printReceipt}>
        <Icons.Printer className="h-4 w-4 mr-2" />
        Cetak
      </Button>
      <Button variant="default" size="sm" onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? (
          <>
            <Icons.Spinner className="h-4 w-4 animate-spin mr-2" />
            Mengunduh...
          </>
        ) : (
          <>
            <Icons.Download className="h-4 w-4 mr-2" />
            Unduh PDF
          </>
        )}
      </Button>
    </div>
  );
}
