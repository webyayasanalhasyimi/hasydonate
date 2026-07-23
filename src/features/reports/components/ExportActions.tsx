"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { exportCsvAction } from "@/server/actions/reports/export-csv";
import { type ReportFilterInputValues } from "../schemas/report-filter.schema";
import { Icons } from "@/lib/icons";
import { toast } from "sonner";

interface ExportActionsProps {
  readonly filters: ReportFilterInputValues;
}

export function ExportActions({ filters }: ExportActionsProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCsv = async () => {
    setIsExporting(true);
    const res = await exportCsvAction(filters);
    setIsExporting(false);

    if (res.success) {
      try {
        const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `Laporan_Donasi_${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Laporan CSV berhasil diunduh.");
      } catch {
        toast.error("Gagal mendownload file CSV.");
      }
    } else {
      toast.error(res.error.message || "Gagal mengekspor laporan.");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center justify-end">
      {/* Active CSV Export Button */}
      <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={isExporting}>
        {isExporting ? (
          <>
            <Icons.Spinner className="h-4 w-4 animate-spin mr-2" />
            Mengekspor...
          </>
        ) : (
          <>
            <Icons.Download className="h-4 w-4 mr-2" />
            Ekspor CSV
          </>
        )}
      </Button>

      {/* Disabled Future Expansion Placeholders */}
      <Button variant="outline" size="sm" disabled>
        <Icons.FileText className="h-4 w-4 mr-2 text-muted-foreground" />
        Ekspor Excel (Mendatang)
      </Button>

      <Button variant="outline" size="sm" disabled>
        <Icons.Printer className="h-4 w-4 mr-2 text-muted-foreground" />
        Ekspor PDF (Mendatang)
      </Button>
    </div>
  );
}
export type ExportActionsType = typeof ExportActions;
