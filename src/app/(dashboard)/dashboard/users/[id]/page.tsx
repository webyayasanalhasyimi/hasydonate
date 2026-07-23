import React from "react";
import { getUserAction } from "@/server/actions/users/get-user";
import { UserDetail } from "@/features/users/components/UserDetail";
import { PageContainer } from "@/components/shared";
import { notFound } from "next/navigation";

interface UserDetailPageProps {
  readonly params: Promise<{
    readonly id: string;
  }>;
}

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const res = await getUserAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <PageContainer>
      <UserDetail user={res.data} />
    </PageContainer>
  );
}
export type UserDetailPageType = typeof UserDetailPage;
