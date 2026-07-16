"use server";

import { requireAuth } from "@/lib/auth";
import { getSignedUrl } from "@/lib/storage/signed-url";
import { type Result } from "@/types/action";
import { success, failure } from "../action-result";

export const getProofUrlAction = async (path: string): Promise<Result<string>> => {
  try {
    await requireAuth();
    const bucket = "transfer-proofs";
    // Strip bucket name prefix if included in path
    const cleanPath = path.startsWith(`${bucket}/`) ? path.slice(bucket.length + 1) : path;
    const url = await getSignedUrl(bucket, cleanPath);
    return success(url);
  } catch (err) {
    return failure(err);
  }
};
