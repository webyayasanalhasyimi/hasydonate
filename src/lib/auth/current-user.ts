import { createServerSupabase } from "@/lib/supabase/server";
import { ProfileService } from "@/server/services/profile.service";
import { type User, type Session } from "@supabase/supabase-js";
import { type Profile } from "@prisma/client";

export interface CurrentUser {
  readonly session: Session;
  readonly user: User;
  readonly profile: Profile;
}

export const getCurrentUser = async (): Promise<CurrentUser | null> => {
  const supabase = await createServerSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user) {
    return null;
  }

  const profile = await ProfileService.getById(session.user.id);

  if (!profile || !profile.isActive) {
    return null;
  }

  return {
    session,
    user: session.user,
    profile,
  };
};
