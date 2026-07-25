"use client";

import React, { useState } from "react";
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
import { toast } from "sonner";
import { uploadLogoAction } from "@/server/actions/settings/upload-logo";

const userFormInputSchema = z.object({
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: z.nativeEnum(ROLES),
  isActiveString: z.enum(["true", "false"]),
  signaturePath: z.string().optional().nullable(),
  password: z
    .string()
    .default("")
    .refine((val) => val === "" || val.length >= 8, {
      message: "Kata sandi harus minimal 8 karakter jika diisi",
    }),
});

type UserFormInputValues = z.infer<typeof userFormInputSchema>;

interface UserFormProps {
  readonly initialValues?: {
    readonly fullName: string;
    readonly email: string;
    readonly role: Role;
    readonly isActive: boolean;
    readonly signaturePath?: string | null | undefined;
    readonly signatureUrl?: string | null | undefined;
  } | undefined;
  readonly onSubmit: (data: {
    readonly fullName: string;
    readonly email: string;
    readonly role: Role;
    readonly isActive: boolean;
    readonly signaturePath?: string | null | undefined;
    readonly password?: string | undefined;
  }) => Promise<void>;
  readonly isEdit?: boolean | undefined;
}

export function UserForm({ initialValues, onSubmit, isEdit = false }: UserFormProps) {
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(initialValues?.signatureUrl || null);

  const form = useForm<UserFormInputValues>({
    resolver: zodResolver(userFormInputSchema) as unknown as never,
    defaultValues: {
      fullName: initialValues?.fullName || "",
      email: initialValues?.email || "",
      role: initialValues?.role || ROLES.FRONT_ADMIN,
      isActiveString: initialValues?.isActive === false ? "false" : "true",
      signaturePath: initialValues?.signaturePath || "",
      password: "",
    },
  });

  const handleSubmit = async (values: UserFormInputValues) => {
    try {
      setIsPending(true);
      await onSubmit({
        fullName: values.fullName,
        email: values.email,
        role: values.role,
        isActive: values.isActiveString === "true",
        signaturePath: values.signaturePath || null,
        password: values.password === "" ? undefined : values.password,
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleSignatureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file stempel tanda tangan maksimal 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("logo", file);

    setIsUploading(true);
    const res = await uploadLogoAction(formData);
    setIsUploading(false);

    if (res.success) {
      form.setValue("signaturePath", res.data);
      setSignaturePreview(URL.createObjectURL(file));
      toast.success("Tanda tangan berhasil diunggah.");
    } else {
      toast.error(res.error.message || "Gagal mengunggah tanda tangan.");
    }
  };

  const handleRemoveSignature = () => {
    form.setValue("signaturePath", "");
    setSignaturePreview(null);
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
              description={isEdit ? "Isi kolom ini jika ingin mereset kata sandi pengguna." : "Wajib diisi minimal 8 karakter."}
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-bold text-foreground">Tanda Tangan Petugas (Received By)</label>
            <div className="border border-border rounded-xl p-4 bg-muted/10">
              {signaturePreview ? (
                <div className="flex items-center gap-4">
                  <div className="relative aspect-video w-[150px] border border-border rounded-lg overflow-hidden bg-background flex items-center justify-center p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={signaturePreview} alt="Signature Preview" className="object-contain max-h-full max-w-full" />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleRemoveSignature}>
                    <Icons.Trash className="h-4 w-4 mr-2 text-destructive" />
                    Hapus Tanda Tangan
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 gap-2 border-2 border-dashed border-border rounded-lg bg-background">
                  <Icons.Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Pilih file tanda tangan stempel (PNG/JPG, Maks 2MB)</span>
                  <label className="cursor-pointer mt-1">
                    <span className="inline-flex items-center justify-center rounded-md text-xs font-bold h-8 px-3 border border-border bg-background hover:bg-muted text-foreground transition-all">
                      Pilih File
                    </span>
                    <input type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleSignatureUpload} className="hidden" disabled={isUploading} />
                  </label>
                  {isUploading && (
                    <span className="text-[10px] text-muted-foreground animate-pulse mt-1">Mengunggah...</span>
                  )}
                </div>
              )}
            </div>
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
