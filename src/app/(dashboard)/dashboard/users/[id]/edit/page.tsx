import React from "react";
import { getUserAction } from "@/server/actions/users/get-user";
import { EditUserClient } from "./EditUserClient";
import { notFound } from "next/navigation";

interface EditUserPageProps {
  readonly params: Promise<{
    readonly id: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const res = await getUserAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return <EditUserClient user={res.data} />;
}
export type EditUserPageType = typeof EditUserPage;
