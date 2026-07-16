import { uploadFile } from "@/lib/storage/upload";
import crypto from "crypto";

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "pdf"];

export interface UploadedProofResult {
  readonly path: string;
  readonly filename: string;
}

/**
 * Validates a file based on size, MIME type, and extension.
 * Structured so that file signature checks can easily be appended later.
 */
export function validateTransferProofFile(options: {
  readonly name: string;
  readonly size: number;
  readonly mimeType: string;
}): void {
  // 1. Validate Size
  if (options.size > MAX_SIZE_BYTES) {
    throw new Error("Ukuran berkas melebihi batas maksimum 10 MB");
  }

  // 2. Validate MIME Type
  if (!ALLOWED_MIME_TYPES.includes(options.mimeType.toLowerCase())) {
    throw new Error("Format berkas tidak didukung. Harap unggah JPG, JPEG, PNG, atau PDF");
  }

  // 3. Validate Extension
  const parts = options.name.split(".");
  const ext = parts[parts.length - 1]?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
    throw new Error("Ekstensi berkas tidak valid. Harap gunakan berkas dengan ekstensi .jpg, .jpeg, .png, atau .pdf");
  }

  // 4. File signature placeholder
  // To be implemented: magic bytes checking of fileBuffer if needed in the future
}

/**
 * Uploads a transfer proof file to the Supabase bucket under a daily directory structure.
 */
export async function uploadTransferProof(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<UploadedProofResult> {
  // Validate metadata constraints
  validateTransferProofFile({
    name: fileName,
    size: fileBuffer.length,
    mimeType,
  });

  const parts = fileName.split(".");
  const ext = parts[parts.length - 1]?.toLowerCase() || "bin";
  const uuid = crypto.randomUUID();

  // Jakarta timezone date formatting
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const dateParts = formatter.formatToParts(new Date());
  const year = dateParts.find((p) => p.type === "year")?.value || "";
  const month = dateParts.find((p) => p.type === "month")?.value || "";
  const day = dateParts.find((p) => p.type === "day")?.value || "";

  const internalPath = `${year}/${month}/${day}/${uuid}.${ext}`;
  const bucketName = "transfer-proofs";

  const uploadedPath = await uploadFile(bucketName, internalPath, fileBuffer, mimeType);

  return {
    path: `${bucketName}/${uploadedPath}`,
    filename: fileName,
  };
}
