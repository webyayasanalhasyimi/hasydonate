import React from "react";
import { type ReceiptData } from "../../types";

export function PrintReceiptDonatur({ data }: Readonly<{ data: ReceiptData }>) {
  return (
    <div className="bg-muted/10 border border-border rounded-lg p-3 space-y-1.5 text-[10px]">
      <div className="font-extrabold text-foreground uppercase tracking-widest text-[9px] text-muted-foreground">
        Telah Diterima Dari (Donor Details):
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="text-muted-foreground font-medium">Nama Donatur</div>
        <div className="col-span-2 font-bold text-foreground truncate">{data.donorName}</div>

        <div className="text-muted-foreground font-medium">No. WhatsApp</div>
        <div className="col-span-2 text-foreground">{data.donorPhone}</div>

        <div className="text-muted-foreground font-medium">Alamat</div>
        <div className="col-span-2 text-foreground truncate">{data.donorAddress}</div>
      </div>
    </div>
  );
}
