"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { type DonationType, type PaymentMethod } from "@prisma/client";
import { type DonaturListItemDto } from "@/features/donatur/types";
import { type DonationDetailDto } from "../types";

interface DonationPOSContextType {
  readonly selectedDonor: DonaturListItemDto | null;
  readonly setSelectedDonor: (donor: DonaturListItemDto | null) => void;
  readonly donationType: DonationType;
  readonly setDonationType: (type: DonationType) => void;
  readonly paymentMethod: PaymentMethod;
  readonly setPaymentMethod: (method: PaymentMethod) => void;
  readonly amount: number;
  readonly setAmount: (amount: number) => void;
  readonly notes: string;
  readonly setNotes: (notes: string) => void;
  readonly transferProofPath: string | null;
  readonly setTransferProofPath: (path: string | null) => void;
  readonly transferProofFilename: string | null;
  readonly setTransferProofFilename: (filename: string | null) => void;
  readonly donationDate: Date;
  readonly setDonationDate: (date: Date) => void;
  readonly isSubmitting: boolean;
  readonly setIsSubmitting: (submitting: boolean) => void;
  readonly isSuccessOpen: boolean;
  readonly setIsSuccessOpen: (open: boolean) => void;
  readonly createdDonation: DonationDetailDto | null;
  readonly setCreatedDonation: (donation: DonationDetailDto | null) => void;
  readonly isDirty: boolean;
  readonly errors: Record<string, string>;
  readonly setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  readonly resetPOS: () => void;
}

const DonationPOSContext = createContext<DonationPOSContextType | undefined>(undefined);

export function DonationPOSProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [selectedDonor, setSelectedDonor] = useState<DonaturListItemDto | null>(null);
  const [donationType, setDonationType] = useState<DonationType>("SHADAQAH");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [transferProofPath, setTransferProofPath] = useState<string | null>(null);
  const [transferProofFilename, setTransferProofFilename] = useState<string | null>(null);
  const [donationDate, setDonationDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [createdDonation, setCreatedDonation] = useState<DonationDetailDto | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Compute isDirty dynamically instead of using state and useEffect
  const isDirty =
    !!selectedDonor ||
    amount > 0 ||
    notes.trim().length > 0 ||
    !!transferProofPath;

  const handleSetPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  const resetPOS = () => {
    setSelectedDonor(null);
    setDonationType("SHADAQAH");
    setPaymentMethod("CASH");
    setAmount(0);
    setNotes("");
    setTransferProofPath(null);
    setTransferProofFilename(null);
    setDonationDate(new Date());
    setErrors({});
  };

  return (
    <DonationPOSContext.Provider
      value={{
        selectedDonor,
        setSelectedDonor,
        donationType,
        setDonationType,
        paymentMethod,
        setPaymentMethod: handleSetPaymentMethod,
        amount,
        setAmount,
        notes,
        setNotes,
        transferProofPath,
        setTransferProofPath,
        transferProofFilename,
        setTransferProofFilename,
        donationDate,
        setDonationDate,
        isSubmitting,
        setIsSubmitting,
        isSuccessOpen,
        setIsSuccessOpen,
        createdDonation,
        setCreatedDonation,
        isDirty,
        errors,
        setErrors,
        resetPOS,
      }}
    >
      {children}
    </DonationPOSContext.Provider>
  );
}

export function useDonationPOS() {
  const context = useContext(DonationPOSContext);
  if (!context) {
    throw new Error("useDonationPOS must be used within a DonationPOSProvider");
  }
  return context;
}
