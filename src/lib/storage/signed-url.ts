import { createServerSupabase } from "@/lib/supabase/server";

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 3600
): Promise<string> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error) {
    throw new Error(`Signed URL storage error: ${error.message}`);
  }

  return data.signedUrl;
}
