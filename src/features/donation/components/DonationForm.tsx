"use client";

import React from "react";
import { useDonationPOS } from "../context/donation-pos-context";
import type { DonationType } from "@prisma/client";
import { DONATION_TYPES } from "@/constants/donation-types";
import { PAYMENT_METHODS } from "@/constants/payment-methods";
import { CurrencyInput } from "./CurrencyInput";
import { PaymentMethodSection } from "./PaymentMethodSection";
import { TransferProofUpload } from "./TransferProofUpload";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DonationForm() {
  const {
    donationType,
    setDonationType,
    paymentMethod,
    amount,
    setAmount,
    notes,
    setNotes,
    errors,
  } = useDonationPOS();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Donation Type Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Jenis Donasi <span className="text-destructive">*</span>
          </label>
          <Select
            value={donationType}
            onValueChange={(val) => setDonationType(val as DonationType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis donasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DONATION_TYPES.SHADAQAH}>Shadaqah</SelectItem>
              <SelectItem value={DONATION_TYPES.ZAKAT}>Zakat</SelectItem>
              <SelectItem value={DONATION_TYPES.SUMBANGAN_LAIN}>Sumbangan Lain</SelectItem>
            </SelectContent>
          </Select>
          {errors.donationType && (
            <span className="text-xs text-destructive font-medium">{errors.donationType}</span>
          )}
        </div>

        {/* Currency Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Jumlah Donasi <span className="text-destructive">*</span>
          </label>
          <CurrencyInput value={amount} onChange={setAmount} />
          {errors.amount && (
            <span className="text-xs text-destructive font-medium">{errors.amount}</span>
          )}
        </div>
      </div>

      {/* Payment Method Selections */}
      <PaymentMethodSection />

      {/* Dynamic Transfer Proof Upload */}
      {paymentMethod === PAYMENT_METHODS.BANK_TRANSFER && <TransferProofUpload />}

      {/* Notes Textarea */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-foreground">Keterangan / Catatan</label>
        <Textarea
          placeholder="Masukkan keterangan tambahan jika ada..."
          className="resize-none"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        {errors.notes && (
          <span className="text-xs text-destructive font-medium">{errors.notes}</span>
        )}
      </div>
    </div>
  );
}
export type DonationFormType = typeof DonationForm;
