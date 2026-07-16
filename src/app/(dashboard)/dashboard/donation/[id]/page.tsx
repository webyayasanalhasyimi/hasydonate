import { requireAuth } from "@/lib/auth";
import { DonationService } from "@/server/services/donation.service";
import { DonationDetailView } from "@/features/donation/components/DonationDetailView";
import { PageContainer } from "@/components/shared";
import { notFound } from "next/navigation";

interface DonationDetailPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function DonationDetailPage({ params }: DonationDetailPageProps) {
  await requireAuth();
  const { id } = await params;
  const donation = await DonationService.findById(id);

  if (!donation) {
    notFound();
  }

  return (
    <PageContainer>
      <DonationDetailView donation={donation} />
    </PageContainer>
  );
}
