import { UsersLayout } from "@/features/users/components/UsersLayout";
import { PageContainer } from "@/components/shared";

export default function UsersIndexPage() {
  return (
    <PageContainer>
      <UsersLayout />
    </PageContainer>
  );
}
export type UsersIndexPageType = typeof UsersIndexPage;
