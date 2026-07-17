import React from "react";
import { type ReceiptData } from "../../types";

export function PrintReceiptDonation({ data }: Readonly<{ data: ReceiptData }>) {
  return (
    <div className="border border-border rounded-lg overflow-hidden text-[10px]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted/40 border-b border-border text-[9px] uppercase font-bold text-muted-foreground">
            <th className="p-2 w-1/3">Jenis Donasi</th>
            <th className="p-2 w-2/3">Keterangan / Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-foreground">
            <td className="p-2 font-bold uppercase">{data.donationType}</td>
            <td className="p-2 text-muted-foreground truncate">{data.notes || "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
