"use client";

import React, { useTransition } from "react";
import { useForm, type Control, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Role } from "@prisma/client";
import { ROLES } from "@/constants/roles";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/shared/TextField";
import { SelectField } from "@/components/shared/SelectField";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import Link from "next/link";

const userFormInputSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: z.nativeEnum(ROLES),
  isActiveString: z.enum(["true", "false"]),
  password: z
    .string()
    .default("")
    .refine((val) => val === "" || val.length >= 6, {
      message: "Kata sandi harus minimal 6 karakter jika diisi",
    }),
});

type UserFormInputValues = z.infer<typeof userFormInputSchema>;

interface UserFormProps {
  readonly initialValues?: {
    readonly fullName: string;
    readonly email: string;
    readonly role: Role;
    readonly isActive: boolean;
  } | undefined;
  readonly onSubmit: (data: {
    readonly fullName: string;
    readonly email: string;
    readonly role: Role;
    readonly isActive: boolean;
    readonly password?: string | undefined;
  }) => Promise<void>;
  readonly isEdit?: boolean | undefined;
}

export function UserForm({ initialValues, onSubmit, isEdit = false }: UserFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserFormInputValues>({
    resolver: zodResolver(userFormInputSchema) as unknown as never,
    defaultValues: {
      fullName: initialValues?.fullName || "",
      email: initialValues?.email || "",
      role: initialValues?.role || ROLES.FRONT_ADMIN,
      isActiveString: initialValues?.isActive === false ? "false" : "true",
      password: "",
    },
  });

  const handleSubmit = (values: UserFormInputValues) => {
    startTransition(async () => {
      await onSubmit({
        fullName: values.fullName,
        email: values.email,
        role: values.role,
        isActive: values.isActiveString === "true",
        password: values.password === "" ? undefined : values.password,
      });
    });
  };

  const ctrl = form.control as unknown as Control<FieldValues>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit as unknown as never)} className="space-y-6 bg-card border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            control={ctrl}
            name="fullName"
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap..."
          />

          <TextField
            control={ctrl}
            name="email"
            label="Email"
            placeholder="Masukkan alamat email..."
            type="email"
          />

          <SelectField
            control={ctrl}
            name="role"
            label="Peran Pengguna"
            options={[
              { label: "Administrator", value: ROLES.ADMIN },
              { label: "Front Admin", value: ROLES.FRONT_ADMIN },
            ]}
          />

          <SelectField
            control={ctrl}
            name="isActiveString"
            label="Status Pengguna"
            options={[
              { label: "Aktif", value: "true" },
              { label: "Nonaktif", value: "false" },
            ]}
          />

          <div className="md:col-span-2">
            <TextField
              control={ctrl}
              name="password"
              label={isEdit ? "Kata Sandi Baru (Opsional)" : "Kata Sandi Awal"}
              placeholder={isEdit ? "Kosongkan jika tidak ingin diubah..." : "Masukkan kata sandi..."}
              type="password"
              description={isEdit ? "Isi kolom ini jika ingin mereset kata sandi pengguna." : "Wajib diisi minimal 6 karakter."}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
          <Link href="/dashboard/users" className={buttonVariants({ variant: "outline" })}>
            Batal
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending && <Icons.Spinner className="h-4 w-4 animate-spin mr-2" />}
            {isEdit ? "Simpan Perubahan" : "Tambah Pengguna"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export type UserFormType = typeof UserForm;
