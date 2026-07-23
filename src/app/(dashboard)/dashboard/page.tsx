import { DashboardLayout } from "@/features/dashboard/components/DashboardLayout";
import { PageContainer } from "@/components/shared";

export default function DashboardPage() {
  return (
    <PageContainer>
      <DashboardLayout />
    </PageContainer>
  );
}
export type DashboardPageType = typeof DashboardPage;
