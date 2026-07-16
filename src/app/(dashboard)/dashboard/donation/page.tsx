import { requireAuth } from "@/lib/auth";
import { DonationList } from "@/features/donation/components/DonationList";
import { PageContainer } from "@/components/shared";
import { Typography } from "@/components/shared/Typography";

export default async function DonationsPage() {
  await requireAuth();

  return (
    <PageContainer>
      <div className="pb-4 border-b border-border">
        <Typography variant="h2" as="h1">
          Riwayat Transaksi Donasi
        </Typography>
        <Typography variant="muted" className="mt-1">
          Daftar seluruh transaksi donasi masuk Yayasan Al-Hasyimi.
        </Typography>
      </div>
      <DonationList />
    </PageContainer>
  );
}
