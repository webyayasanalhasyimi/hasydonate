import React from "react";
import { type ReceiptData } from "../../types";

export function PrintReceiptPayment({ data }: Readonly<{ data: ReceiptData }>) {
  return (
    <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1">
      <div>
        Metode Pembayaran: <span className="font-bold text-foreground">{data.paymentMethod === "CASH" ? "Tunai / Cash" : "Transfer Bank"}</span>
      </div>
      {data.statusLabel && (
        <div className="font-black text-emerald-600 uppercase border border-emerald-600/30 rounded px-1.5 py-0.5 tracking-wider bg-emerald-50 text-[9px]">
          {data.statusLabel}
        </div>
      )}
    </div>
  );
}
