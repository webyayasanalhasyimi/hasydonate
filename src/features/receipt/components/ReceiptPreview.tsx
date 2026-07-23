"use client";

import React, { useState } from "react";
import { type ReceiptData } from "../types";
import { PrintReceiptView, printReceipt } from "../renderers/print-renderer";
import { generateReceiptPdfBlob } from "../renderers/pdf-renderer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatWhatsAppNumber } from "@/lib/utils/phone";
import { formatIDR } from "@/lib/utils/currency";

interface ReceiptPreviewProps {
  readonly data: ReceiptData;
}

export function ReceiptPreview({ data }: ReceiptPreviewProps) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
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
    } catch {
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
      const formattedPhone = formatWhatsAppNumber(data.donorPhone);
      const dateFormatted = new Date(data.donationDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const message = `Halo Bapak/Ibu *${data.donorName}*,

Terima kasih atas donasi Anda!
Berikut adalah tautan kwitansi resmi Anda dari *${data.foundationName}*:
${data.verificationUrl}

*Detail Donasi:*
• No. Kwitansi: _${data.receiptNumber}_
• Tanggal: _${dateFormatted}_
• Jenis Donasi: _${data.donationType}_
• Jumlah: *${formatIDR(data.amount)}*
• Metode: _${data.paymentMethod === "CASH" ? "Tunai / Cash" : "Transfer Bank"}_
${data.notes ? `• Keterangan: _${data.notes}_\n` : ""}
Semoga menjadi berkah dan amal jariyah.`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      toast.success("Membuka WhatsApp untuk berbagi...");
    } catch {
      toast.error("Gagal membagikan ke WhatsApp");
    }
  };

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
              Kwitansi {data.receiptNumber}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              Pratinjau tanda terima donasi.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Icons.Printer className="h-4 w-4 mr-2" />
            Cetak
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={isDownloading}>
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
          <Button variant="secondary" size="sm" onClick={handleShareWhatsApp}>
            <Icons.Share className="h-4 w-4 mr-2" />
            Kirim WA
          </Button>
        </div>
      </div>

      {/* A5 Portrait Printable Card Wrapper */}
      <div className="flex justify-center py-4 bg-muted/20 border border-border/50 rounded-2xl overflow-x-auto">
        <Card className="shadow-lg border border-border w-full max-w-[148mm] min-h-[210mm] bg-white text-black print:shadow-none print:border-0">
          <CardContent className="p-0">
            <PrintReceiptView data={data} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export type ReceiptPreviewPropsType = typeof ReceiptPreview;
