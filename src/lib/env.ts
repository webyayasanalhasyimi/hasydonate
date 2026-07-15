import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default(""),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const isServer = typeof window === "undefined";

const getEnv = (): z.infer<typeof serverSchema> | z.infer<typeof clientSchema> => {
  if (isServer) {
    const parsed = serverSchema.safeParse(process.env);
    if (!parsed.success) {
      console.error("❌ Invalid server environment variables:", parsed.error.format());
      throw new Error("Invalid environment variables");
    }
    return parsed.data;
  } else {
    const parsed = clientSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
    if (!parsed.success) {
      console.error("❌ Invalid client environment variables:", parsed.error.format());
      throw new Error("Invalid environment variables");
    }
    return parsed.data;
  }
};

export const env = getEnv();
export type EnvType = typeof env;
export type ServerEnvType = z.infer<typeof serverSchema>;
export type ClientEnvType = z.infer<typeof clientSchema>;
