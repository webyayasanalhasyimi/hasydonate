"use server";

import { requireAuth } from "@/lib/auth";
import { uploadTransferProof } from "@/features/donation/lib/upload-proof";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";
import { ValidationError } from "@/lib/errors";

export const uploadTransferProofAction = async (
  formData: FormData
): Promise<
  Result<{
    readonly path: string;
    readonly filename: string;
  }>
> => {
  try {
    await requireAuth();
    
    const file = formData.get("file") as File | null;
    if (!file) {
      throw new ValidationError("Berkas bukti transfer tidak ditemukan");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadTransferProof(
      fileBuffer,
      file.name,
      file.type
    );

    return success(uploadResult);
  } catch (err) {
    return failure(err);
  }
};
