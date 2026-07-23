import React from "react";
import { type ReportRowDto } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatIDR } from "@/lib/utils/currency";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface DonationTableProps {
  readonly rows: readonly ReportRowDto[];
  readonly nextCursor?: string | undefined;
  readonly onLoadMore: () => void;
  readonly loadingMore: boolean;
}

export function DonationTable({ rows, nextCursor, onLoadMore, loadingMore }: DonationTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Daftar Rincian Donasi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase">No. Transaksi</th>
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase">Tanggal</th>
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase">Donatur</th>
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase">Kategori</th>
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase">Metode</th>
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase text-right">Jumlah</th>
                <th className="p-3 text-xs font-bold text-muted-foreground uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                  <td className="p-3 font-medium text-foreground">{row.donationNumber}</td>
                  <td className="p-3 text-foreground">
                    {new Date(row.donationDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-3 text-foreground">{row.donorName}</td>
                  <td className="p-3 text-muted-foreground text-xs">{row.donationType}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {row.paymentMethod === "CASH" ? "Tunai" : "Transfer"}
                  </td>
                  <td className="p-3 font-bold text-foreground text-right">{formatIDR(row.amount)}</td>
                  <td className="p-3 text-center space-x-1 whitespace-nowrap">
                    <Link
                      href={`/dashboard/donation/${row.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Detail
                    </Link>
                    <Link
                      href={`/dashboard/receipt/${row.id}`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      Kwitansi
                    </Link>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-xs text-muted-foreground">
                    Tidak ditemukan data donasi yang cocok dengan filter yang ditentukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Load More Pagination Trigger */}
        {nextCursor && (
          <div className="flex justify-center p-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={onLoadMore} disabled={loadingMore}>
              {loadingMore ? "Memuat..." : "Muat Lebih Banyak"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
export type DonationTableType = typeof DonationTable;
