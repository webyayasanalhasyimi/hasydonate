"use client";

import React from "react";
import { UserForm } from "@/features/users/components/UserForm";
import { createUserAction } from "@/server/actions/users/create-user";
import { PageContainer } from "@/components/shared";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Role } from "@prisma/client";

export default function NewUserPage() {
  const router = useRouter();

  const handleSubmit = async (data: {
    readonly fullName: string;
    readonly email: string;
    readonly role: Role;
    readonly isActive: boolean;
    readonly password?: string | undefined;
  }) => {
    const res = await createUserAction(data);
    if (res.success) {
      toast.success("Pengguna baru berhasil dibuat.");
      router.push("/dashboard/users");
      router.refresh();
    } else {
      toast.error(res.error.message || "Gagal membuat pengguna baru.");
    }
  };

  return (
    <PageContainer className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Tambah Pengguna Baru</h1>
        <p className="text-xs text-muted-foreground">Isi data formulir di bawah ini untuk mendaftarkan akun internal baru.</p>
      </div>
      <UserForm onSubmit={handleSubmit} />
    </PageContainer>
  );
}
