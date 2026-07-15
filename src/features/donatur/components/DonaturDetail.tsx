"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type DonaturDetailDto, type DonationHistoryDto } from "../types";
import { deleteDonaturAction } from "@/server/actions/donatur/delete-donatur";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EditDonaturForm } from "./EditDonaturForm";
import { InfoRow, KeyValueList } from "@/components/shared";
import { type ColumnDef, DataTable } from "@/components/shared/DataTable";
import { Typography } from "@/components/shared/Typography";
import { Icons } from "@/lib/icons";
import { formatIDR, formatDate } from "@/lib/utils/index";
import { DONATUR_ROUTES } from "../config";
import { toast } from "sonner";

interface DonaturDetailProps {
  readonly donatur: DonaturDetailDto;
}

export function DonaturDetail({ donatur }: DonaturDetailProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteDonaturAction(donatur.id);
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);

    if (res.success) {
      toast.success("Donatur berhasil dihapus");
      router.push(DONATUR_ROUTES.LIST);
    } else {
      toast.error(res.error.message || "Gagal menghapus donatur");
    }
  };

  const columns: ColumnDef<DonationHistoryDto>[] = [
    {
      id: "donationNumber",
      header: "Nomor Nota",
      render: (row) => <span className="font-mono">{row.donationNumber}</span>,
    },
    {
      id: "donationDate",
      header: "Tanggal",
      render: (row) => <span>{formatDate(row.donationDate)}</span>,
    },
    {
      id: "donationType",
      header: "Jenis Donasi",
      render: (row) => <span>{row.donationType}</span>,
    },
    {
      id: "paymentMethod",
      header: "Metode Pembayaran",
      render: (row) => <span>{row.paymentMethod}</span>,
    },
    {
      id: "amount",
      header: "Jumlah",
      className: "text-right",
      render: (row) => <span className="font-semibold">{formatIDR(row.amount)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Typography variant="h2" as="h1">
            Detail Donatur
          </Typography>
          <Typography variant="muted">
            Informasi lengkap profil dan riwayat donasi.
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Icons.Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Batal Edit" : "Edit Profil"}
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            <Icons.Trash className="h-4 w-4 mr-2" />
            Hapus Donatur
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profil Donatur</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <EditDonaturForm donatur={donatur} onCompleted={() => setIsEditing(false)} />
              ) : (
                <KeyValueList>
                  <InfoRow label="Nama Lengkap" value={donatur.fullName} />
                  <InfoRow label="Nomor WhatsApp" value={donatur.phoneNumber} />
                  <InfoRow label="Alamat" value={donatur.address} />
                  <InfoRow label="Total Donasi" value={formatIDR(donatur.totalDonations)} />
                  <InfoRow
                    label="Terakhir Donasi"
                    value={donatur.lastDonationAt ? formatDate(donatur.lastDonationAt) : "-"}
                  />
                  <InfoRow label="Terdaftar Pada" value={formatDate(donatur.createdAt)} />
                </KeyValueList>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Donasi</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={donatur.donations}
                emptyMessage="Belum ada riwayat donasi untuk donatur ini."
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Hapus Donatur"
        description={`Apakah Anda yakin ingin menghapus ${donatur.fullName}? Data donatur ini akan disembunyikan dari sistem.`}
        confirmText="Hapus"
        cancelText="Batal"
        isDestructive
        isLoading={isDeleting}
      />
    </div>
  );
}
export type DonaturDetailType = typeof DonaturDetail;
