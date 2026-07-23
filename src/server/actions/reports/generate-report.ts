"use server";

import { requireAuth } from "@/lib/auth";
import { ReportService } from "@/server/services/report.service";
import { reportFilterSchema } from "@/features/reports/schemas/report-filter.schema";
import { type ReportResultDto } from "@/features/reports/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

export const generateReportAction = async (filters: unknown): Promise<Result<ReportResultDto>> => {
  try {
    await requireAuth();
    
    const parsed = reportFilterSchema.safeParse(filters);
    if (!parsed.success) {
      return failure(new Error("Validasi filter laporan gagal."));
    }

    const report = await ReportService.generateReport(parsed.data);
    return success(report);
  } catch (err) {
    return failure(err);
  }
};
export type GenerateReportActionType = typeof generateReportAction;
