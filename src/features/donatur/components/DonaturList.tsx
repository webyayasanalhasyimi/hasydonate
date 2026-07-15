"use client";

import { useDonaturSearch } from "../hooks/useDonaturSearch";
import { type ColumnDef, DataTable } from "@/components/shared/DataTable";
import { type DonaturListItemDto } from "../types";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button, buttonVariants } from "@/components/ui/button";
import { DONATUR_ROUTES } from "../config";
import Link from "next/link";
import { Icons } from "@/lib/icons";
import { formatIDR, formatDate } from "@/lib/utils/index";
import { Typography } from "@/components/shared/Typography";

export function DonaturList() {
  const {
    query,
    setQuery,
    items,
    isLoading,
    nextCursor,
    hasPrevious,
    handleNextPage,
    handlePreviousPage,
  } = useDonaturSearch(10);

  const columns: ColumnDef<DonaturListItemDto>[] = [
    {
      id: "fullName",
      header: "Nama",
      render: (row) => (
        <Link
          href={DONATUR_ROUTES.DETAIL(row.id)}
          className="font-semibold text-primary hover:underline"
        >
          {row.fullName}
        </Link>
      ),
    },
    {
      id: "address",
      header: "Alamat",
      render: (row) => (
        <span className="text-muted-foreground line-clamp-1 max-w-[250px]">{row.address}</span>
      ),
    },
    {
      id: "phoneNumber",
      header: "WhatsApp",
      render: (row) => <span>{row.phoneNumber}</span>,
    },
    {
      id: "totalDonations",
      header: "Total Donasi",
      render: (row) => <span>{formatIDR(row.totalDonations)}</span>,
    },
    {
      id: "lastDonationAt",
      header: "Terakhir Berdonasi",
      render: (row) => (
        <span>{row.lastDonationAt ? formatDate(row.lastDonationAt) : "-"}</span>
      ),
    },
    {
      id: "action",
      header: "Aksi",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={DONATUR_ROUTES.DETAIL(row.id)}
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <Icons.Edit className="h-4 w-4 mr-1" />
            Detail
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari nama atau nomor WhatsApp..."
          disabled={isLoading}
        />
        <Link
          href={DONATUR_ROUTES.NEW}
          className={buttonVariants({ variant: "default" })}
        >
          <Icons.Plus className="h-4 w-4 mr-2" />
          Tambah Donatur
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
        emptyMessage="Tidak ada data donatur yang ditemukan."
      />

      {(hasPrevious || nextCursor) && (
        <div className="flex items-center justify-between pt-2">
          <Typography variant="caption">Menampilkan data halaman</Typography>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={!hasPrevious || isLoading}
            >
              <Icons.ChevronLeft className="h-4 w-4 mr-1" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={!nextCursor || isLoading}
            >
              Berikutnya
              <Icons.ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
export type DonaturListType = typeof DonaturList;
