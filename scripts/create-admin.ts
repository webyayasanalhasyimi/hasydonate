import { prisma } from "../src/lib/prisma/client";
import { createAdminSupabase } from "../src/lib/supabase/admin";
import { Role } from "@prisma/client";

// Run with: npx tsx scripts/create-admin.ts <email> <password> <fullName>

async function main() {
  const args = process.argv.slice(2);
  const [email, password, fullName] = args;

  if (!email || !password || !fullName) {
    console.error("Usage: npx tsx scripts/create-admin.ts <email> <password> <fullName>");
    process.exit(1);
  }

  console.log(`Starting admin user creation for: ${email}`);

  const supabase = createAdminSupabase();

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    console.error("❌ Failed to create user in Supabase Auth:", authError?.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`✓ User created in Supabase Auth with ID: ${userId}`);

  // 2. Create profile in DB
  try {
    const profile = await prisma.profile.create({
      data: {
        id: userId,
        fullName,
        email,
        role: Role.ADMIN,
        isActive: true,
      },
    });

    console.log(`✓ Profile record created in database:`, profile);
    console.log("🎉 First ADMIN account successfully created!");
  } catch (dbError: unknown) {
    const errorMsg = dbError instanceof Error ? dbError.message : String(dbError);
    console.error("❌ Failed to create profile record in database:", errorMsg);
    // Cleanup auth user to allow retrying
    await supabase.auth.admin.deleteUser(userId);
    console.log("Rollback: Deleted auth user.");
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error("Unexpected error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
