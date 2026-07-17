import React from "react";
import { type ReceiptData } from "../../types";

export function PrintReceiptFoundation({ data }: Readonly<{ data: ReceiptData }>) {
  return (
    <div className="grid grid-cols-2 gap-4 text-[10px] text-muted-foreground pt-2">
      <div className="space-y-0.5">
        <div className="font-extrabold text-foreground uppercase tracking-wider text-xs">
          {data.foundationName}
        </div>
        <div>{data.foundationAddress}</div>
        <div>Telp: {data.foundationPhone}</div>
      </div>
      <div className="text-right space-y-0.5 border-l border-border pl-4">
        <div className="font-semibold text-foreground">Informasi Transfer Bank:</div>
        <div>Bank {data.bankName}</div>
        <div>No. Rek: <span className="font-bold text-foreground">{data.bankAccountNumber}</span></div>
        <div className="truncate">a.n. {data.bankAccountName}</div>
      </div>
    </div>
  );
}
