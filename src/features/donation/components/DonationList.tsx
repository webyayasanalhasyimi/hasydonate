"use client";

import React, { useState, useEffect, useCallback, useTransition } from "react";
import { type ColumnDef, DataTable } from "@/components/shared/DataTable";
import { type DonationListItemDto } from "../types";
import { listDonationsAction } from "@/server/actions/donation/list-donations";
import { SearchInput } from "@/components/shared/SearchInput";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { formatIDR, formatDate } from "@/lib/utils/index";
import { DONATION_ROUTES } from "../config";
import Link from "next/link";
import { toast } from "sonner";

export function DonationList() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [items, setItems] = useState<readonly DonationListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [cursorHistory, setCursorHistory] = useState<readonly string[]>([]);
  const [, startTransition] = useTransition();

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  const fetchItems = useCallback(
    async (searchQuery: string, cursor?: string, isNavigatingBack = false) => {
      setIsLoading(true);
      const res = await listDonationsAction({
        query: searchQuery,
        cursor,
        limit: 10,
      });
      setIsLoading(false);

      if (res.success) {
        setItems(res.data.items);
        setNextCursor(res.data.nextCursor);

        if (!isNavigatingBack) {
          if (cursor) {
            setCursorHistory((prev) => [...prev, cursor]);
          } else {
            setCursorHistory([]);
          }
        }
      } else {
        toast.error(res.error.message || "Gagal memuat data donasi");
      }
    },
    []
  );

  useEffect(() => {
    startTransition(() => {
      fetchItems(debouncedQuery);
    });
  }, [debouncedQuery, fetchItems]);

  const handleNextPage = useCallback(() => {
    if (!nextCursor) return;
    fetchItems(debouncedQuery, nextCursor);
  }, [nextCursor, debouncedQuery, fetchItems]);

  const handlePreviousPage = useCallback(() => {
    const history = [...cursorHistory];
    history.pop(); // Remove current cursor
    const prevCursor = history[history.length - 1]; // Get previous page cursor
    setCursorHistory(history);
    fetchItems(debouncedQuery, prevCursor, true);
  }, [cursorHistory, debouncedQuery, fetchItems]);

  const hasPrevious = cursorHistory.length > 0;

  const columns: readonly ColumnDef<DonationListItemDto>[] = [
    {
      id: "donationNumber",
      header: "Nomor Donasi",
      className: "font-semibold text-foreground",
      render: (row) => <span>{row.donationNumber}</span>,
    },
    {
      id: "donationDate",
      header: "Tanggal",
      render: (row) => <span>{formatDate(row.donationDate)}</span>,
    },
    {
      id: "donorName",
      header: "Nama Donatur",
      render: (row) => <span>{row.donorName}</span>,
    },
    {
      id: "donationType",
      header: "Jenis",
      render: (row) => <span>{row.donationType}</span>,
    },
    {
      id: "paymentMethod",
      header: "Metode",
      render: (row) => <span>{row.paymentMethod === "CASH" ? "Tunai" : "Transfer"}</span>,
    },
    {
      id: "amount",
      header: "Jumlah",
      className: "text-right",
      render: (row) => <span className="font-semibold text-primary">{formatIDR(row.amount)}</span>,
    },
    {
      id: "receivedBy",
      header: "Petugas",
      render: (row) => <span className="text-xs text-muted-foreground">{row.receivedByName}</span>,
    },
    {
      id: "action",
      header: "Aksi",
      className: "text-right",
      render: (row) => (
        <Link
          href={DONATION_ROUTES.DETAIL(row.id)}
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <Icons.Eye className="h-4 w-4 mr-1" />
          Detail
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Cari berdasarkan nomor donasi atau nama donatur..."
          disabled={isLoading}
        />
        <Link
          href={DONATION_ROUTES.NEW}
          className={buttonVariants({ variant: "default" })}
        >
          <Icons.Plus className="h-4 w-4 mr-2" />
          POS Donasi Baru
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={items}
        isLoading={isLoading}
      />

      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={isLoading || !hasPrevious}
        >
          <Icons.ChevronLeft className="h-4 w-4 mr-1" />
          Sebelumnya
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={isLoading || !nextCursor}
        >
          Berikutnya
          <Icons.ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
