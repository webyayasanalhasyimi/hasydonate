"use server";

import { requireAuth } from "@/lib/auth";
import { ReportService } from "@/server/services/report.service";
import { reportFilterSchema } from "@/features/reports/schemas/report-filter.schema";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";
import { type ReportRowDto } from "@/features/reports/types";

export const getExportDataAction = async (
  filters: unknown
): Promise<Result<readonly ReportRowDto[]>> => {
  try {
    await requireAuth();

    const parsed = reportFilterSchema.safeParse(filters);
    if (!parsed.success) {
      return failure(new Error("Validasi filter laporan gagal."));
    }

    const data = await ReportService.getExportData(parsed.data);
    return success(data);
  } catch (err) {
    return failure(err);
  }
};
export type GetExportDataActionType = typeof getExportDataAction;
