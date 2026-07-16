"use client";

import React from "react";
import { useDonationPOS } from "../context/donation-pos-context";
import { PaymentMethod } from "@prisma/client";
import { Icons } from "@/lib/icons";

export function PaymentMethodSection() {
  const { paymentMethod, setPaymentMethod } = useDonationPOS();

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-foreground">
        Metode Pembayaran <span className="text-destructive">*</span>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPaymentMethod(PaymentMethod.CASH)}
          className={`flex items-center justify-center gap-3 p-4 border rounded-xl font-semibold transition-all ${
            paymentMethod === PaymentMethod.CASH
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-border hover:bg-muted text-muted-foreground"
          }`}
        >
          <Icons.DollarSign className="h-5 w-5" />
          Tunai / Cash
        </button>

        <button
          type="button"
          onClick={() => setPaymentMethod(PaymentMethod.BANK_TRANSFER)}
          className={`flex items-center justify-center gap-3 p-4 border rounded-xl font-semibold transition-all ${
            paymentMethod === PaymentMethod.BANK_TRANSFER
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-border hover:bg-muted text-muted-foreground"
          }`}
        >
          <Icons.CreditCard className="h-5 w-5" />
          Transfer Bank
        </button>
      </div>
    </div>
  );
}
