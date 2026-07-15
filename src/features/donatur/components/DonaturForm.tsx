import { type UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { TextField, TextareaField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { type CreateDonorInput } from "../schemas/create-donatur.schema";
import { Icons } from "@/lib/icons";

interface DonaturFormProps {
  readonly form: UseFormReturn<CreateDonorInput>;
  readonly onSubmit: (data: CreateDonorInput) => void;
  readonly submitText: string;
  readonly isLoading?: boolean;
  readonly onCancel?: () => void;
}

export function DonaturForm({
  form,
  onSubmit,
  submitText,
  isLoading = false,
  onCancel,
}: DonaturFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <TextField
          control={form.control}
          name="fullName"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap donatur"
          disabled={isLoading}
        />
        <TextField
          control={form.control}
          name="phoneNumber"
          label="Nomor WhatsApp"
          placeholder="Contoh: 081234567890"
          disabled={isLoading}
        />
        <TextareaField
          control={form.control}
          name="address"
          label="Alamat"
          placeholder="Masukkan alamat lengkap donatur"
          disabled={isLoading}
          rows={4}
        />
        <div className="flex items-center gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Batal
            </Button>
          )}
          <Button type="submit" disabled={isLoading} className="min-w-[100px]">
            {isLoading && <Icons.Spinner className="h-4 w-4 mr-2 animate-spin" />}
            {submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export type DonaturFormType = typeof DonaturForm;
