import { ReportsLayout } from "@/features/reports/components/ReportsLayout";
import { PageContainer } from "@/components/shared";

export default function ReportsPage() {
  return (
    <PageContainer>
      <ReportsLayout />
    </PageContainer>
  );
}
export type ReportsPageType = typeof ReportsPage;
