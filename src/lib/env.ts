import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid URL").optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be empty"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY cannot be empty"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be empty"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL must be a valid URL"),
});

const isServer = typeof window === "undefined";

const getEnv = (): z.infer<typeof serverSchema> | z.infer<typeof clientSchema> => {
  if (isServer) {
    const rawEnv = {
      DATABASE_URL: process.env.DATABASE_URL,
      DIRECT_URL: process.env.DIRECT_URL,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000",
    };

    // In local development/test, we can default SUPABASE_SERVICE_ROLE_KEY if not set,
    // but in production it must be set.
    const isProd = process.env.NODE_ENV === "production";
    if (!isProd && !rawEnv.SUPABASE_SERVICE_ROLE_KEY) {
      rawEnv.SUPABASE_SERVICE_ROLE_KEY = "development-dummy-service-role-key";
    }

    // If we're building the project (e.g. Next.js static optimization or bundling)
    // and required keys are missing, we can provide fallback values to avoid breaking the build step
    // while still failing fast at runtime.
    const isBuildStep = process.env.NEXT_PHASE === "phase-production-build";
    if (isBuildStep) {
      if (!rawEnv.DATABASE_URL) rawEnv.DATABASE_URL = "postgresql://localhost:5432/placeholder";
      if (!rawEnv.NEXT_PUBLIC_SUPABASE_URL) rawEnv.NEXT_PUBLIC_SUPABASE_URL = "https://placeholder.supabase.co";
      if (!rawEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY) rawEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY = "placeholder";
      if (!rawEnv.SUPABASE_SERVICE_ROLE_KEY) rawEnv.SUPABASE_SERVICE_ROLE_KEY = "placeholder";
    }

    const parsed = serverSchema.safeParse(rawEnv);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      console.error("❌ Environment validation failed:\n" + errorMsg);
      throw new Error("Invalid environment variables config. Check your logs above.");
    }
    return parsed.data;
  } else {
    const parsed = clientSchema.safeParse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    });
    if (!parsed.success) {
      const errorMsg = parsed.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      console.error("❌ Client environment validation failed:\n" + errorMsg);
      throw new Error("Invalid client environment variables config. Check your logs above.");
    }
    return parsed.data;
  }
};

export const env = getEnv();
export type EnvType = typeof env;
export type ServerEnvType = z.infer<typeof serverSchema>;
export type ClientEnvType = z.infer<typeof clientSchema>;

