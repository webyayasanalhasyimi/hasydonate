import { requireAuth } from "@/lib/auth";
import { DonationPOS } from "@/features/donation/components/DonationPOS";
import { PageContainer } from "@/components/shared";

export default async function NewDonationPage() {
  await requireAuth();

  return (
    <PageContainer>
      <DonationPOS />
    </PageContainer>
  );
}
