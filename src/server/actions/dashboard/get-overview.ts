"use server";

import { requireAuth } from "@/lib/auth";
import { DashboardService } from "@/server/services/dashboard.service";
import { type DashboardOverviewDto } from "@/features/dashboard/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

export const getDashboardOverviewAction = async (): Promise<Result<DashboardOverviewDto>> => {
  try {
    const user = await requireAuth();
    const overview = await DashboardService.getOverview(user);
    return success(overview);
  } catch (err) {
    return failure(err);
  }
};
export type GetDashboardOverviewActionType = typeof getDashboardOverviewAction;
