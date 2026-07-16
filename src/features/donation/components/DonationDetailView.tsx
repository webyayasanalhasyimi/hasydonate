"use client";

import React, { useState, useEffect } from "react";
import { type DonationDetailDto } from "../types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { InfoRow, KeyValueList } from "@/components/shared";
import { Typography } from "@/components/shared/Typography";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { formatIDR, formatDate } from "@/lib/utils/index";
import { getProofUrlAction } from "@/server/actions/donation/get-proof-url";
import { useRouter } from "next/navigation";
import { DONATION_ROUTES } from "../config";
import { toast } from "sonner";

interface DonationDetailViewProps {
  readonly donation: DonationDetailDto;
}

export function DonationDetailView({ donation }: DonationDetailViewProps) {
  const router = useRouter();
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  useEffect(() => {
    if (donation.transferProofPath) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoadingUrl(true);
      getProofUrlAction(donation.transferProofPath)
        .then((res) => {
          if (res.success) {
            setProofUrl(res.data);
          } else {
            toast.error("Gagal memuat pratinjau bukti transfer");
          }
        })
        .finally(() => {
          setIsLoadingUrl(false);
        });
    }
  }, [donation.transferProofPath]);

  const handlePrintPlaceholder = () => {
    toast.info("Fitur cetak kwitansi akan diimplementasikan pada fase berikutnya.");
  };

  const isPdf = donation.transferProofFilename?.toLowerCase().endsWith(".pdf");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Typography variant="h2" as="h1">
            Detail Transaksi Donasi
          </Typography>
          <Typography variant="muted">
            Rincian lengkap data donasi dan administrasi tanda terima.
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => router.push(DONATION_ROUTES.LIST)}>
            <Icons.ChevronLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <Button onClick={handlePrintPlaceholder}>
            <Icons.Printer className="h-4 w-4 mr-2" />
            Cetak Kwitansi
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns - Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donation Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Rincian Donasi</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueList>
                <InfoRow label="Nomor Donasi" value={donation.donationNumber} />
                <InfoRow label="Tanggal Transaksi" value={formatDate(donation.donationDate)} />
                <InfoRow label="Jenis Donasi" value={donation.donationType} />
                <InfoRow label="Metode Pembayaran" value={donation.paymentMethod === "CASH" ? "Tunai" : "Transfer Bank"} />
                <InfoRow label="Jumlah Donasi" value={formatIDR(donation.amount)} className="text-primary font-bold text-lg" />
                <InfoRow label="Petugas Penerima" value={donation.receivedByName} />
                <InfoRow label="Waktu Pencatatan" value={formatDate(donation.createdAt)} />
                <InfoRow label="Catatan / Keterangan" value={donation.notes || "-"} />
              </KeyValueList>
            </CardContent>
          </Card>

          {/* Donatur Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Profil Donatur</CardTitle>
            </CardHeader>
            <CardContent>
              <KeyValueList>
                <InfoRow label="Nama Lengkap" value={donation.donorName} />
                <InfoRow label="Nomor WhatsApp" value={donation.donorPhone} />
                <InfoRow label="Alamat" value={donation.donorAddress} />
              </KeyValueList>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Transfer Proof */}
        {donation.paymentMethod === "BANK_TRANSFER" && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Bukti Transfer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingUrl ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Icons.Spinner className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Memuat bukti...</span>
                  </div>
                ) : proofUrl ? (
                  isPdf ? (
                    <div className="flex flex-col items-center justify-center p-4 border border-border rounded-lg bg-muted/20 text-center gap-3">
                      <Icons.FileText className="h-10 w-10 text-primary" />
                      <div className="space-y-1">
                        <span className="text-xs font-semibold block truncate max-w-[200px]">
                          {donation.transferProofFilename}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">Dokumen PDF</span>
                      </div>
                      <a
                        href={proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({ variant: "outline", size: "sm" })}
                      >
                        <Icons.Eye className="h-4 w-4 mr-2" />
                        Buka PDF
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-border bg-black/5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={proofUrl}
                          alt="Bukti Transfer"
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <a
                        href={proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}
                      >
                        <Icons.Download className="h-4 w-4 mr-2" />
                        Buka Gambar Penuh
                      </a>
                    </div>
                  )
                ) : (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    Bukti transfer tidak dapat dimuat
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
