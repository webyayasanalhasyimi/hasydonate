import { createServerSupabase } from "@/lib/supabase/server";

export async function uploadFile(
  bucket: string,
  path: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload storage error: ${error.message}`);
  }

  return data.path;
}
