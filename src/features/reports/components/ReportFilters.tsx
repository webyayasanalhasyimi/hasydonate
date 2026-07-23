"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type ReportFilterInputValues } from "../schemas/report-filter.schema";
import { DONATION_TYPES } from "@/constants/donation-types";
import { PAYMENT_METHODS } from "@/constants/payment-methods";

interface ReportFiltersProps {
  readonly filters: ReportFilterInputValues;
  readonly onChange: (filters: ReportFilterInputValues) => void;
  readonly onReset: () => void;
}

export function ReportFilters({ filters, onChange, onReset }: ReportFiltersProps) {
  const handleFieldChange = (key: keyof ReportFilterInputValues, value: unknown) => {
    onChange({
      ...filters,
      [key]: value === "" ? undefined : value,
    });
  };

  const selectStyle = "flex h-8 w-full rounded-lg border border-border bg-input/30 px-3 py-1 text-sm font-medium text-foreground outline-none transition-all placeholder:text-muted-foreground focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Keyword Search */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Kata Kunci</label>
          <Input
            value={filters.searchKeyword || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange("searchKeyword", e.target.value)}
            placeholder="Cari no. kwitansi / donatur..."
            className="h-8"
          />
        </div>

        {/* Date Start */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Tanggal Mulai</label>
          <input
            type="date"
            className={selectStyle}
            value={filters.dateStart || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange("dateStart", e.target.value)}
          />
        </div>

        {/* Date End */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Tanggal Akhir</label>
          <input
            type="date"
            className={selectStyle}
            value={filters.dateEnd || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange("dateEnd", e.target.value)}
          />
        </div>

        {/* Donation Type */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Jenis Donasi</label>
          <select
            value={filters.donationType || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange("donationType", e.target.value)}
            className={selectStyle}
          >
            <option value="">Semua Jenis</option>
            <option value={DONATION_TYPES.ZAKAT}>Zakat</option>
            <option value={DONATION_TYPES.SHADAQAH}>Shadaqah</option>
            <option value={DONATION_TYPES.SUMBANGAN_LAIN}>Sumbangan Lain</option>
          </select>
        </div>

        {/* Payment Method */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Metode Pembayaran</label>
          <select
            value={filters.paymentMethod || ""}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFieldChange("paymentMethod", e.target.value)}
            className={selectStyle}
          >
            <option value="">Semua Metode</option>
            <option value={PAYMENT_METHODS.CASH}>Tunai (Cash)</option>
            <option value={PAYMENT_METHODS.BANK_TRANSFER}>Transfer Bank</option>
          </select>
        </div>

        {/* Min Amount */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Minimal Jumlah (Rp)</label>
          <Input
            type="number"
            value={filters.minAmount !== undefined ? filters.minAmount : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFieldChange("minAmount", e.target.value ? parseFloat(e.target.value) : undefined)
            }
            placeholder="Min Rp"
            className="h-8"
          />
        </div>

        {/* Max Amount */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-muted-foreground uppercase">Maksimal Jumlah (Rp)</label>
          <Input
            type="number"
            value={filters.maxAmount !== undefined ? filters.maxAmount : ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFieldChange("maxAmount", e.target.value ? parseFloat(e.target.value) : undefined)
            }
            placeholder="Maks Rp"
            className="h-8"
          />
        </div>

        {/* Filter Actions */}
        <div className="flex items-end justify-end gap-2">
          <Button variant="outline" className="h-8 w-full sm:w-auto" onClick={onReset}>
            Atur Ulang
          </Button>
        </div>
      </div>
    </div>
  );
}
export type ReportFiltersType = typeof ReportFilters;
