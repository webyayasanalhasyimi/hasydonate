import { createServerSupabase } from "@/lib/supabase/server";

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const supabase = await createServerSupabase();
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Delete storage error: ${error.message}`);
  }
}
