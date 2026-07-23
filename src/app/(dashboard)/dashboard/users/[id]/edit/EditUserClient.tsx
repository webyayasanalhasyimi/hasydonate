"use client";

import React from "react";
import { UserForm } from "@/features/users/components/UserForm";
import { updateUserAction } from "@/server/actions/users/update-user";
import { type UserDetailDto } from "@/features/users/types";
import { PageContainer } from "@/components/shared";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Role } from "@prisma/client";

interface EditUserClientProps {
  readonly user: UserDetailDto;
}

export function EditUserClient({ user }: EditUserClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: {
    readonly fullName: string;
    readonly email: string;
    readonly role: Role;
    readonly isActive: boolean;
    readonly password?: string | undefined;
  }) => {
    const res = await updateUserAction(user.id, data);
    if (res.success) {
      toast.success("Data pengguna berhasil diperbarui.");
      router.push(`/dashboard/users/${user.id}`);
      router.refresh();
    } else {
      toast.error(res.error.message || "Gagal memperbarui pengguna.");
    }
  };

  return (
    <PageContainer className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Ubah Data Pengguna</h1>
        <p className="text-xs text-muted-foreground">Perbarui profil, peran, status, atau atur ulang kata sandi pengguna.</p>
      </div>
      <UserForm initialValues={user} onSubmit={handleSubmit} isEdit />
    </PageContainer>
  );
}
export type EditUserClientType = typeof EditUserClient;
