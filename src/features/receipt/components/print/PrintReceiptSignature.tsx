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
        <div className="flex flex-col justify-between h-20">
          <span className="text-muted-foreground block text-[9px] uppercase tracking-wide">Diterima Oleh (Received By):</span>
          <div className="flex flex-col items-center justify-center flex-1 h-10 my-1">
            {data.receivedBySignatureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.receivedBySignatureUrl} alt="Signature" className="h-8 object-contain" />
            ) : (
              <div className="h-8" />
            )}
          </div>
          <div>
            <div className="font-extrabold text-foreground border-b border-muted-foreground/30 pb-0.5 mx-4">
              {data.receivedBy}
            </div>
            <span className="text-[8px] text-muted-foreground block">Front Admin</span>
          </div>
        </div>

        {/* Right: Authorizer / Approved By (from Settings) */}
        <div className="flex flex-col justify-between h-20">
          <span className="text-muted-foreground block text-[9px] uppercase tracking-wide">Mengetahui (Approved By):</span>
          <div className="relative flex flex-col items-center justify-center flex-1 h-10 my-1">
            {data.approvedByStampUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.approvedByStampUrl}
                alt="Stamp"
                className="absolute left-[10%] top-1/2 -translate-y-1/2 h-14 w-14 object-contain opacity-80 pointer-events-none z-10"
              />
            )}
            {data.approvedBySignatureUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.approvedBySignatureUrl} alt="Signature" className="h-8 object-contain relative z-0" />
            ) : (
              <div className="h-8" />
            )}
          </div>
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
