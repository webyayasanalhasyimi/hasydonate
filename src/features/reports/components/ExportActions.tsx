"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { exportCsvAction } from "@/server/actions/reports/export-csv";
import { getExportDataAction } from "@/server/actions/reports/get-export-data";
import { type ReportFilterInputValues } from "../schemas/report-filter.schema";
import { ReportPdfTemplate } from "../templates/ReportPdfTemplate";
import { Icons } from "@/lib/icons";
import { toast } from "sonner";

interface ExportActionsProps {
  readonly filters: ReportFilterInputValues;
}

export function ExportActions({ filters }: ExportActionsProps) {
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportCsv = async () => {
    setIsExportingCsv(true);
    const res = await exportCsvAction(filters);
    setIsExportingCsv(false);

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

  const handleExportExcel = async () => {
    setIsExportingExcel(true);
    const res = await getExportDataAction(filters);
    setIsExportingExcel(false);

    if (res.success) {
      try {
        const XLSX = await import("xlsx");

        const headers = [
          "No. Transaksi",
          "Tanggal",
          "Donatur",
          "Jenis Donasi",
          "Metode Pembayaran",
          "Jumlah",
          "Petugas Penerima",
        ];

        const rows = res.data.map((d) => [
          d.donationNumber,
          new Date(d.donationDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          d.donorName,
          d.donationType,
          d.paymentMethod === "CASH" ? "Tunai" : "Transfer",
          d.amount,
          d.receivedByName,
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Donasi");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `Laporan_Donasi_${new Date().toISOString().split("T")[0]}.xlsx`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Laporan Excel berhasil diunduh.");
      } catch {
        toast.error("Gagal mendownload file Excel.");
      }
    } else {
      toast.error(res.error.message || "Gagal mengekspor laporan.");
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    const res = await getExportDataAction(filters);
    setIsExportingPdf(false);

    if (res.success) {
      try {
        const { pdf } = await import("../../receipt/lib/react-pdf-shim");

        const dateRangeLabel =
          filters.dateStart && filters.dateEnd
            ? `${new Date(filters.dateStart).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })} - ${new Date(filters.dateEnd).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}`
            : "30 Hari Terakhir";

        const element = React.createElement(ReportPdfTemplate, {
          data: res.data,
          dateRangeLabel,
        });

        const instance = pdf(element);
        const blob = await instance.toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `Laporan_Donasi_${new Date().toISOString().split("T")[0]}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Laporan PDF berhasil diunduh.");
      } catch (err) {
        console.error(err);
        toast.error("Gagal mendownload file PDF.");
      }
    } else {
      toast.error(res.error.message || "Gagal mengekspor laporan.");
    }
  };

  const isExportingAny = isExportingCsv || isExportingExcel || isExportingPdf;

  return (
    <div className="flex flex-wrap gap-2 items-center justify-end">
      {/* CSV Export Button */}
      <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={isExportingAny}>
        {isExportingCsv ? (
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

      {/* Excel Export Button */}
      <Button variant="outline" size="sm" onClick={handleExportExcel} disabled={isExportingAny}>
        {isExportingExcel ? (
          <>
            <Icons.Spinner className="h-4 w-4 animate-spin mr-2" />
            Mengekspor...
          </>
        ) : (
          <>
            <Icons.FileText className="h-4 w-4 mr-2 text-foreground" />
            Ekspor Excel
          </>
        )}
      </Button>

      {/* PDF Export Button */}
      <Button variant="outline" size="sm" onClick={handleExportPdf} disabled={isExportingAny}>
        {isExportingPdf ? (
          <>
            <Icons.Spinner className="h-4 w-4 animate-spin mr-2" />
            Mengekspor...
          </>
        ) : (
          <>
            <Icons.Printer className="h-4 w-4 mr-2 text-foreground" />
            Ekspor PDF
          </>
        )}
      </Button>
    </div>
  );
}
export type ExportActionsType = typeof ExportActions;
