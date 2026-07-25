import React from "react";
import { type ReceiptData } from "../../types";

export function PrintReceiptSignature({ data }: Readonly<{ data: ReceiptData }>) {
  const dateFormatted = new Date(data.donationDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-2 text-[10px]">
      <div className="text-right text-muted-foreground italic">
        Surabaya, {dateFormatted}
      </div>
      <div className="grid grid-cols-2 gap-4 pt-1 text-center">
        {/* Left: Input Staff */}
        <div className="space-y-10">
          <span className="text-muted-foreground block text-[9px] uppercase tracking-wide">Diterima Oleh (Received By):</span>
          <div>
            <div className="font-extrabold text-foreground border-b border-muted-foreground/30 pb-0.5 mx-4">
              {data.receivedBy}
            </div>
            <span className="text-[8px] text-muted-foreground block">Front Admin</span>
          </div>
        </div>

        {/* Right: Authorizer / Approved By (from Settings) */}
        <div className="space-y-10">
          <span className="text-muted-foreground block text-[9px] uppercase tracking-wide">Mengetahui (Approved By):</span>
          <div>
            <div className="font-extrabold text-foreground border-b border-muted-foreground/30 pb-0.5 mx-4">
              {data.signatureName}
            </div>
            <span className="text-[8px] text-muted-foreground block">{data.signaturePosition}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
