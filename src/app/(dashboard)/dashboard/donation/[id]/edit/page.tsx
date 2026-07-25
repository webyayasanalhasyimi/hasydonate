import { requireAuth } from "@/lib/auth";
import { DonationService } from "@/server/services/donation.service";
import { EditDonationForm } from "@/features/donation/components/EditDonationForm";
import { PageContainer } from "@/components/shared";
import { notFound } from "next/navigation";

interface EditDonationPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function EditDonationPage({ params }: EditDonationPageProps) {
  await requireAuth();
  const { id } = await params;
  const donation = await DonationService.findById(id);

  if (!donation) {
    notFound();
  }

  return (
    <PageContainer>
      <EditDonationForm donation={donation} />
    </PageContainer>
  );
}
