"use server";

import { requireAdmin } from "@/lib/auth";
import { uploadFile } from "@/lib/storage/upload";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";
import crypto from "crypto";

export const uploadLogoAction = async (formData: FormData): Promise<Result<string>> => {
  try {
    await requireAdmin();

    const file = formData.get("logo") as File | null;
    if (!file) {
      return failure(new Error("File logo tidak ditemukan."));
    }

    if (file.size > 2 * 1024 * 1024) {
      return failure(new Error("Ukuran file logo maksimal 2MB."));
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      return failure(new Error("Format logo harus berupa PNG, JPEG, atau JPG."));
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["png", "jpg", "jpeg"].includes(ext)) {
      return failure(new Error("Ekstensi file logo tidak valid."));
    }

    const bucket = "foundation-assets";
    const path = `logo/${crypto.randomUUID()}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadedPath = await uploadFile(bucket, path, buffer, file.type);

    // Store prefix with bucket name for generic compatibility
    return success(`${bucket}/${uploadedPath}`);
  } catch (err) {
    return failure(err);
  }
};
export type UploadLogoActionType = typeof uploadLogoAction;
