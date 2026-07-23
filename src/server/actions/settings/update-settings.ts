"use server";

import { requireAdmin } from "@/lib/auth";
import { SettingService } from "@/server/services/setting.service";
import { settingsSchema } from "@/features/settings/schemas/settings.schema";
import { mapDtoToRecord } from "@/features/settings/lib/settings-mapper";
import { deleteFile } from "@/lib/storage/delete";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";
import { type FoundationSettingsDto } from "@/features/settings/types";

export const updateSettingsAction = async (
  values: unknown,
  oldLogoPath?: string
): Promise<Result<readonly unknown[]>> => {
  try {
    const user = await requireAdmin();

    const parsed = settingsSchema.safeParse(values);
    if (!parsed.success) {
      return failure(new Error("Validasi formulir pengaturan gagal."));
    }

    const updates = mapDtoToRecord(parsed.data as FoundationSettingsDto);

    // Run transactional updates
    const result = await SettingService.updateMany(updates, user.profile.id);

    // Logo replacement: delete the old logo from storage if path changed
    const newLogoPath = parsed.data.foundationLogoPath;
    if (oldLogoPath && newLogoPath && oldLogoPath !== newLogoPath) {
      try {
        const parts = oldLogoPath.split("/");
        const bucket = parts[0] ?? "foundation-assets";
        const cleanPath = parts.slice(1).join("/");
        await deleteFile(bucket, cleanPath);
      } catch {
        // Fail silently on old file deletion to avoid interrupting page success
      }
    }

    return success(result);
  } catch (err) {
    // Cleanup: If database update fails, delete the newly uploaded logo (if any)
    const dataObj = values as Record<string, unknown> | null;
    const newLogo = dataObj?.foundationLogoPath as string | null;
    if (newLogo && newLogo !== oldLogoPath) {
      try {
        const parts = newLogo.split("/");
        const bucket = parts[0] ?? "foundation-assets";
        const cleanPath = parts.slice(1).join("/");
        await deleteFile(bucket, cleanPath);
      } catch {
        // Fail silently on cleanup
      }
    }
    return failure(err);
  }
};
