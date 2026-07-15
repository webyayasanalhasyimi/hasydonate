import { createServerSupabase } from "@/lib/supabase/server";
import { ProfileService } from "./profile.service";
import { type LoginInput } from "@/features/auth/schemas/login.schema";
import { ValidationError, NotFoundError } from "@/lib/errors";
import { type User } from "@supabase/supabase-js";

export const AuthService = {
  async login({ email, password }: LoginInput): Promise<User> {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new ValidationError("Invalid email or password.");
    }

    const userId = data.user.id;
    const profile = await ProfileService.getById(userId);

    if (!profile) {
      await supabase.auth.signOut();
      throw new NotFoundError("Profile not found. Please contact administrator.");
    }

    if (!profile.isActive) {
      await supabase.auth.signOut();
      throw new ValidationError("Your account has been disabled. Please contact administrator.");
    }

    return data.user;
  },

  async logout(): Promise<void> {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  },
};
export type AuthServiceType = typeof AuthService;
