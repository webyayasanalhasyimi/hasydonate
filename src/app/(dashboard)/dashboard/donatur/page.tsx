import { requireAuth } from "@/lib/auth";
import { DonaturList } from "@/features/donatur/components/DonaturList";
import { PageContainer } from "@/components/shared";
import { Typography } from "@/components/shared/Typography";

export default async function DonaturListPage() {
  await requireAuth();

  return (
    <PageContainer>
      <div className="pb-4 border-b border-border">
        <Typography variant="h2" as="h1">
          Daftar Donatur
        </Typography>
        <Typography variant="muted" className="mt-1">
          Kelola data profil donatur tetap dan umum Yayasan Al-Hasyimi.
        </Typography>
      </div>
      <DonaturList />
    </PageContainer>
  );
}
