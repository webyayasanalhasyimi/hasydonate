"use client";

import React from "react";
import { useDonationPOS } from "../context/donation-pos-context";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatIDR, formatDate } from "@/lib/utils/index";
import { Icons } from "@/lib/icons";
import { DONATION_ROUTES } from "../config";
import { toast } from "sonner";

export function SuccessDialog() {
  const { isSuccessOpen, setIsSuccessOpen, createdDonation, resetPOS } = useDonationPOS();
  const router = useRouter();

  if (!createdDonation) return null;

  const handleNewDonation = () => {
    resetPOS();
    setIsSuccessOpen(false);
  };

  const handleViewDetail = () => {
    setIsSuccessOpen(false);
    resetPOS();
    router.push(DONATION_ROUTES.DETAIL(createdDonation.id));
  };

  const handlePrintPlaceholder = () => {
    toast.info("Fitur cetak kwitansi akan diimplementasikan pada fase berikutnya.");
  };

  return (
    <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/50">
            <Icons.Check className="h-6 w-6 text-emerald-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Donasi Berhasil Disimpan
          </DialogTitle>
          <DialogDescription>
            Transaksi donasi telah tercatat ke dalam sistem dengan rincian berikut:
          </DialogDescription>
        </DialogHeader>

        <div className="border border-border rounded-xl p-4 bg-muted/20 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Nomor Donasi</span>
            <span className="font-bold text-foreground">{createdDonation.donationNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Nama Donatur</span>
            <span className="font-semibold text-foreground">{createdDonation.donorName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Jenis Donasi</span>
            <span className="font-semibold text-foreground">{createdDonation.donationType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Metode</span>
            <span className="font-semibold text-foreground">
              {createdDonation.paymentMethod === "CASH" ? "Tunai" : "Transfer Bank"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Tanggal Transaksi</span>
            <span className="font-semibold text-foreground">
              {formatDate(createdDonation.donationDate)}
            </span>
          </div>
          <div className="pt-3 border-t border-dashed border-border flex justify-between items-center">
            <span className="text-sm text-muted-foreground font-bold">Total Donasi</span>
            <span className="text-xl font-black text-primary">
              {formatIDR(createdDonation.amount)}
            </span>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button variant="outline" onClick={handleViewDetail} className="w-full sm:w-auto">
            <Icons.Eye className="h-4 w-4 mr-2" />
            Detail Donasi
          </Button>
          <Button variant="secondary" onClick={handlePrintPlaceholder} className="w-full sm:w-auto">
            <Icons.Printer className="h-4 w-4 mr-2" />
            Cetak Kwitansi
          </Button>
          <Button onClick={handleNewDonation} className="w-full sm:w-auto">
            <Icons.Plus className="h-4 w-4 mr-2" />
            Transaksi Baru
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export type SuccessDialogType = typeof SuccessDialog;
