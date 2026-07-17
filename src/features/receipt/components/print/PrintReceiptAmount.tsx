import React from "react";
import { type ReceiptData } from "../../types";
import { formatIDR } from "@/lib/utils/currency";

export function PrintReceiptAmount({ data }: Readonly<{ data: ReceiptData }>) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
      <div className="space-y-1">
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground block font-bold leading-none">
          Terbilang (Spelled in Words):
        </span>
        <span className="italic text-foreground text-[10px] font-semibold block leading-tight">
          &ldquo; {data.amountSpelled} &rdquo;
        </span>
      </div>
      <div className="text-right shrink-0 border-t md:border-t-0 md:border-l border-primary/20 pt-2 md:pt-0 md:pl-4 flex flex-col items-end justify-center">
        <span className="text-[8px] uppercase tracking-wider text-muted-foreground block font-bold">
          Jumlah Donasi (Amount):
        </span>
        <span className="text-xl font-black text-primary leading-tight">
          {formatIDR(data.amount)}
        </span>
      </div>
    </div>
  );
}
