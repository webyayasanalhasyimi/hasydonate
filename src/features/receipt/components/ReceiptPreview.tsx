"use client";

import React, { useState, useEffect } from "react";
import { type ReceiptData } from "../types";
import { PrintReceiptView, printReceipt } from "../renderers/print-renderer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatWhatsAppNumber } from "@/lib/utils/phone";
import { formatIDR } from "@/lib/utils/currency";
import { DONATION_TYPES } from "@/constants/donation-types";

// Serialized version of ReceiptData — dates come as strings across the Next.js boundary
export interface ReceiptDataSerialized extends Omit<ReceiptData, "donationDate" | "printedAt"> {
  readonly donationDate: string | Date;
  readonly printedAt: string | Date;
}

interface ReceiptPreviewProps {
  readonly data: ReceiptDataSerialized;
}

export function ReceiptPreview({ data }: ReceiptPreviewProps) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Normalize dates from string → Date so all child components receive real Date objects
  const normalizedData: ReceiptData = {
    ...data,
    donationDate: new Date(data.donationDate),
    printedAt: new Date(data.printedAt),
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const { generateReceiptPdfBlob } = await import("../renderers/pdf-renderer");
      const blob = await generateReceiptPdfBlob(normalizedData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Kwitansi-${normalizedData.receiptNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Kwitansi PDF berhasil diunduh");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("Gagal membuat atau mengunduh PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    printReceipt();
  };

  const handleShareWhatsApp = () => {
    try {
      const formattedPhone = formatWhatsAppNumber(normalizedData.donorPhone);
      const dateFormatted = normalizedData.donationDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const message = `Halo Bapak/Ibu *${normalizedData.donorName}*,

Terima kasih atas donasi Anda!
Berikut adalah tautan kwitansi resmi Anda dari *${normalizedData.foundationName}*:
${normalizedData.verificationUrl}

*Detail Donasi:*
• No. Kwitansi: _${normalizedData.receiptNumber}_
• Tanggal: _${dateFormatted}_
• Jenis Donasi: _${normalizedData.donationType}_
• ${normalizedData.donationType === DONATION_TYPES.BARANG ? `Barang: _${normalizedData.itemDescription || "-"}_` : `Jumlah: *${formatIDR(normalizedData.amount)}*`}
• Metode: _${normalizedData.paymentMethod === "CASH" ? "Tunai / Cash" : "Transfer Bank"}_
${normalizedData.notes ? `• Keterangan: _${normalizedData.notes}_\n` : ""}
Semoga menjadi berkah dan amal jariyah.`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      toast.success("Membuka WhatsApp untuk berbagi...");
    } catch {
      toast.error("Gagal membagikan ke WhatsApp");
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Icons.Spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-muted/10 p-4 border border-border rounded-xl">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <Icons.ChevronLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h3 className="font-extrabold text-foreground leading-none text-sm uppercase">
              Kwitansi {normalizedData.receiptNumber}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              Pratinjau tanda terima donasi.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handlePrint} className="flex-1 sm:flex-initial">
            <Icons.Printer className="h-4 w-4 mr-2" />
            Cetak
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading} className="flex-1 sm:flex-initial">
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
          <Button variant="secondary" size="sm" onClick={handleShareWhatsApp} className="w-full sm:w-auto">
            <Icons.Share className="h-4 w-4 mr-2" />
            Kirim WA
          </Button>
        </div>
      </div>

      {/* A5 Portrait Printable Card Wrapper */}
      <div className="flex justify-center py-4 bg-muted/20 border border-border/50 rounded-2xl overflow-x-auto">
        <Card className="shadow-lg border border-border w-full max-w-[148mm] min-h-[210mm] bg-white text-black print:shadow-none print:border-0">
          <CardContent className="p-0">
            <PrintReceiptView data={normalizedData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export type ReceiptPreviewPropsType = typeof ReceiptPreview;
