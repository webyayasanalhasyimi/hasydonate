import { requireAdmin } from "@/lib/auth";
import { SettingsForm } from "@/features/settings/components/SettingsForm";
import { PageContainer } from "@/components/shared";

export default async function SettingsPage() {
  // Enforce server-side authorization: ADMIN only
  await requireAdmin();

  return (
    <PageContainer>
      <SettingsForm />
    </PageContainer>
  );
}
export type SettingsPageType = typeof SettingsPage;
