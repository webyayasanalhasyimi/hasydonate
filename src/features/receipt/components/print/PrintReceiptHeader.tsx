import React from "react";
import { type ReceiptData } from "../../types";

export function PrintReceiptHeader({ data }: Readonly<{ data: ReceiptData }>) {
  return (
    <div className="flex justify-between items-start border-b-2 border-primary pb-3">
      <div className="space-y-1">
        <h2 className="text-lg font-black tracking-tight text-primary leading-none uppercase">
          Kwitansi Bukti Donasi
        </h2>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
          Official Receipt
        </p>
      </div>
      <div className="text-right">
        <div className="text-xs font-black text-foreground">{data.receiptNumber}</div>
        <div className="text-[10px] text-muted-foreground">
          Tanggal: {new Date(data.donationDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
