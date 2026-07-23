"use client";

import React from "react";
import { useDonationPOS } from "../context/donation-pos-context";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatIDR } from "@/lib/utils/index";
import { Badge } from "@/components/ui/badge";

export function DonationSummaryCard() {
  const {
    selectedDonor,
    donationType,
    paymentMethod,
    amount,
    transferProofPath,
  } = useDonationPOS();

  return (
    <Card className="border-primary/10 shadow-md h-full bg-muted/10">
      <CardHeader className="pb-3 border-b border-border bg-muted/20">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Ringkasan Donasi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground font-medium">Donatur</span>
            <span className="text-sm font-semibold text-foreground truncate">
              {selectedDonor ? selectedDonor.fullName : "-"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium">Jenis Donasi</span>
              <Badge variant="outline" className="w-fit">
                {donationType}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium">Metode</span>
              <Badge variant="outline" className="w-fit">
                {paymentMethod === "CASH" ? "Tunai" : "Transfer Bank"}
              </Badge>
            </div>
          </div>

          {(paymentMethod === "BANK_TRANSFER" || paymentMethod === "CASH") && (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium">
                {paymentMethod === "BANK_TRANSFER" ? "Status Bukti Transfer" : "Status Bukti Pembayaran"}
              </span>
              {transferProofPath ? (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  ✓ Berhasil Diunggah
                </span>
              ) : (
                <span className="text-xs text-destructive font-semibold flex items-center gap-1">
                  ✗ Belum Diunggah
                </span>
              )}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-dashed border-border flex flex-col gap-1">
          <span className="text-xs text-muted-foreground font-medium">Total Donasi</span>
          <span className="text-2xl font-black text-primary">{formatIDR(amount)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
