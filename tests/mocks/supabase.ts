import { vi } from "vitest";

export const supabaseAdminMock = {
  auth: {
    admin: {
      createUser: vi.fn(),
      deleteUser: vi.fn(),
      updateUserById: vi.fn(),
    },
  },
  storage: {
    from: vi.fn(),
  },
};

vi.mock("@/lib/supabase/admin", () => ({
  createAdminSupabase: () => supabaseAdminMock,
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabase: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  }),
}));
export type SupabaseAdminMockType = typeof supabaseAdminMock;
