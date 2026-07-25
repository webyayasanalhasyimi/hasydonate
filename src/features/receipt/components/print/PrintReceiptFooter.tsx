import React from "react";
import { type ReceiptData } from "../../types";

export function PrintReceiptFooter({ data }: Readonly<{ data: ReceiptData }>) {
  return (
    <div className="border-t border-dashed border-border pt-3 space-y-3 text-[9px] text-muted-foreground text-center">
      {/* Thank You Message */}
      <p className="italic text-foreground leading-normal px-2">
        {data.thankYouMessage}
      </p>

      {/* Security placeholders & QR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-1 border-t border-border/50 text-left">
        <div className="space-y-0.5">
          <div>
            Kode Verifikasi: <span className="font-bold text-foreground font-mono">{data.verificationCode}</span>
          </div>
          <div>
            Tautan Verifikasi: <a href={data.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline font-mono truncate block max-w-[250px]">{data.verificationUrl}</a>
          </div>
        </div>
        {data.verificationUrl && (
          <div className="flex items-center gap-2 border border-border rounded p-1 bg-white shrink-0">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data.verificationUrl ?? "")}`}
              alt="QR Code"
              className="h-8 w-8 object-contain"
            />
            <div className="text-[7px] leading-tight text-muted-foreground">
              Scan untuk<br />Verifikasi
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
