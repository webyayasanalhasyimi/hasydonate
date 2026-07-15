"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDonorSchema, type CreateDonorInput } from "../schemas/create-donatur.schema";
import { createDonaturAction } from "@/server/actions/donatur/create-donatur";
import { DonaturForm } from "./DonaturForm";
import { DONATUR_ROUTES } from "../config";
import { toast } from "sonner";

export function CreateDonaturForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateDonorInput>({
    resolver: zodResolver(createDonorSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
    },
  });

  const onSubmit = async (data: CreateDonorInput) => {
    setIsLoading(true);
    const res = await createDonaturAction(data);
    setIsLoading(false);

    if (res.success) {
      toast.success("Donatur berhasil dibuat");
      router.push(DONATUR_ROUTES.DETAIL(res.data.id));
    } else {
      toast.error(res.error.message || "Gagal membuat donatur");
    }
  };

  return (
    <DonaturForm
      form={form}
      onSubmit={onSubmit}
      submitText="Simpan Donatur"
      isLoading={isLoading}
      onCancel={() => router.push(DONATUR_ROUTES.LIST)}
    />
  );
}
export type CreateDonaturFormType = typeof CreateDonaturForm;
