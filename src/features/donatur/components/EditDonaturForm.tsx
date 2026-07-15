"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateDonorSchema, type UpdateDonorInput } from "../schemas/update-donatur.schema";
import { updateDonaturAction } from "@/server/actions/donatur/update-donatur";
import { DonaturForm } from "./DonaturForm";
import { type DonaturDetailDto } from "../types";
import { toast } from "sonner";

interface EditDonaturFormProps {
  readonly donatur: DonaturDetailDto;
  readonly onCompleted?: () => void;
}

export function EditDonaturForm({ donatur, onCompleted }: EditDonaturFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<UpdateDonorInput>({
    resolver: zodResolver(updateDonorSchema),
    defaultValues: {
      fullName: donatur.fullName,
      phoneNumber: donatur.phoneNumber,
      address: donatur.address,
    },
  });

  const onSubmit = async (data: UpdateDonorInput) => {
    setIsLoading(true);
    const res = await updateDonaturAction(donatur.id, data);
    setIsLoading(false);

    if (res.success) {
      toast.success("Donatur berhasil diperbarui");
      router.refresh();
      onCompleted?.();
    } else {
      toast.error(res.error.message || "Gagal memperbarui donatur");
    }
  };

  return (
    <DonaturForm
      form={form}
      onSubmit={onSubmit}
      submitText="Simpan Perubahan"
      isLoading={isLoading}
    />
  );
}
export type EditDonaturFormType = typeof EditDonaturForm;
