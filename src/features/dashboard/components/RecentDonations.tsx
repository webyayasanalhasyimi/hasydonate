import React from "react";
import { type DonationListItemDto } from "@/features/donation/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatIDR } from "@/lib/utils/currency";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface RecentDonationsProps {
  readonly items: readonly DonationListItemDto[];
}

export function RecentDonations({ items }: RecentDonationsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Donasi Terbaru
        </CardTitle>
        <Link href="/dashboard/donation" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Lihat Semua
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase">No. Transaksi</th>
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase">Donatur</th>
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase">Jenis</th>
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase">Metode</th>
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase text-right">Jumlah</th>
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                  <td className="p-3 font-medium text-foreground">{item.donationNumber}</td>
                  <td className="p-3 text-foreground">{item.donorName}</td>
                  <td className="p-3 text-muted-foreground text-xs">{item.donationType}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {item.paymentMethod === "CASH" ? "Tunai" : "Transfer"}
                  </td>
                  <td className="p-3 font-bold text-foreground text-right">{formatIDR(item.amount)}</td>
                  <td className="p-3 text-center">
                    <Link href={`/dashboard/donation/${item.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-xs text-muted-foreground">
                    Belum ada transaksi donasi yang tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
export type RecentDonationsType = typeof RecentDonations;
