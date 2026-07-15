import { requireAuth } from "@/lib/auth";
import { DonorService } from "@/server/services/donor.service";
import { DonaturDetail } from "@/features/donatur/components/DonaturDetail";
import { PageContainer } from "@/components/shared";
import { notFound } from "next/navigation";

interface DonaturDetailPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function DonaturDetailPage({ params }: DonaturDetailPageProps) {
  await requireAuth();
  const { id } = await params;
  const donatur = await DonorService.findById(id);

  if (!donatur) {
    notFound();
  }

  return (
    <PageContainer>
      <DonaturDetail donatur={donatur} />
    </PageContainer>
  );
}
