"use server";

import { requireAuth } from "@/lib/auth";
import { SettingService } from "@/server/services/setting.service";
import { mapSettingsToDto } from "@/features/settings/lib/settings-mapper";
import { type FoundationSettingsDto } from "@/features/settings/types";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";
import { getSignedUrl } from "@/lib/storage/signed-url";

export const getSettingsAction = async (): Promise<Result<FoundationSettingsDto>> => {
  try {
    await requireAuth();
    const settings = await SettingService.getAll();
    const dto = mapSettingsToDto(settings);

    let logoUrl: string | undefined = undefined;
    if (dto.foundationLogoPath) {
      try {
        const parts = dto.foundationLogoPath.split("/");
        const bucket = parts[0] ?? "foundation-assets";
        const cleanPath = parts.slice(1).join("/");
        logoUrl = await getSignedUrl(bucket, cleanPath);
      } catch {
        // Silent catch for missing or invalid storage path
      }
    }

    return success({
      ...dto,
      logoUrl,
    });
  } catch (err) {
    return failure(err);
  }
};
