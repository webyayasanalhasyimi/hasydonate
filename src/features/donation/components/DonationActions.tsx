"use client";

import React from "react";
import { useDonationPOS } from "../context/donation-pos-context";
import { createDonationAction } from "@/server/actions/donation/create-donation";
import { createDonationSchema } from "../schemas/create-donation.schema";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { toast } from "sonner";

export function DonationActions() {
  const {
    selectedDonor,
    donationType,
    paymentMethod,
    amount,
    notes,
    transferProofPath,
    transferProofFilename,
    donationDate,
    isSubmitting,
    setIsSubmitting,
    setCreatedDonation,
    setIsSuccessOpen,
    setErrors,
    resetPOS,
  } = useDonationPOS();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const input = {
      donorId: selectedDonor?.id,
      donationType,
      paymentMethod,
      amount,
      notes: notes.trim() || undefined,
      transferProofPath: transferProofPath || undefined,
      transferProofFilename: transferProofFilename || undefined,
      donationDate,
    };

    const parsed = createDonationSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((err) => {
        const path = err.path[0];
        if (typeof path === "string") {
          fieldErrors[path] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Mohon periksa kembali input formulir donasi");
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    const res = await createDonationAction(parsed.data);
    setIsSubmitting(false);

    if (res.success) {
      setCreatedDonation(res.data);
      setIsSuccessOpen(true);
      toast.success("Donasi berhasil dicatat");
    } else {
      toast.error(res.error.message || "Gagal mencatat donasi");
    }
  };

  return (
    <div className="flex items-center gap-3 pt-4 border-t border-border">
      <Button
        type="button"
        variant="outline"
        onClick={resetPOS}
        disabled={isSubmitting}
        className="w-1/3"
      >
        Reset Form
      </Button>
      <Button
        type="submit"
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedDonor || amount <= 0}
        className="w-2/3"
      >
        {isSubmitting ? (
          <>
            <Icons.Spinner className="h-4 w-4 animate-spin mr-2" />
            Memproses...
          </>
        ) : (
          <>
            <Icons.Plus className="h-4 w-4 mr-2" />
            Simpan Donasi
          </>
        )}
      </Button>
    </div>
  );
}
export type DonationActionsType = typeof DonationActions;
