"use server";

import { requireAuth } from "@/lib/auth";
import { ReportService } from "@/server/services/report.service";
import { reportFilterSchema } from "@/features/reports/schemas/report-filter.schema";
import { serializeToCsv } from "@/features/reports/lib/aggregators/csv";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

export const exportCsvAction = async (filters: unknown): Promise<Result<string>> => {
  try {
    await requireAuth();

    const parsed = reportFilterSchema.safeParse(filters);
    if (!parsed.success) {
      return failure(new Error("Validasi filter laporan untuk ekspor gagal."));
    }

    const data = await ReportService.getExportData(parsed.data);

    const headers = [
      "No. Transaksi",
      "Tanggal",
      "Donatur",
      "Jenis Donasi",
      "Metode Pembayaran",
      "Jumlah",
      "Petugas Penerima",
    ];

    const rows = data.map((d) => [
      d.donationNumber,
      new Date(d.donationDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      d.donorName,
      d.donationType,
      d.paymentMethod === "CASH" ? "Tunai" : "Transfer",
      d.amount.toString(),
      d.receivedByName,
    ]);

    const csvContent = serializeToCsv(headers, rows);
    return success(csvContent);
  } catch (err) {
    return failure(err);
  }
};
export type ExportCsvActionType = typeof exportCsvAction;
