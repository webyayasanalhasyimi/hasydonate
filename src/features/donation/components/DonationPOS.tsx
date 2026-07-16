"use client";

import React from "react";
import { DonationPOSProvider } from "../context/donation-pos-context";
import { DonaturSelector } from "./DonaturSelector";
import { DonationForm } from "./DonationForm";
import { DonationSummaryCard } from "./DonationSummaryCard";
import { DonationActions } from "./DonationActions";
import { SuccessDialog } from "./SuccessDialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/shared/Typography";

function POSLayout() {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <Typography variant="h2" as="h1">
          Transaksi Donasi Baru (POS)
        </Typography>
        <Typography variant="muted" className="mt-1">
          Input transaksi donasi masuk secara cepat menggunakan panel kasir.
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md">
            <CardHeader className="bg-muted/10 border-b border-border pb-4">
              <CardTitle className="text-base font-bold">Formulir Kasir POS</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <DonaturSelector />
              <DonationForm />
              <DonationActions />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <DonationSummaryCard />
        </div>
      </div>

      <SuccessDialog />
    </div>
  );
}

export function DonationPOS() {
  return (
    <DonationPOSProvider>
      <POSLayout />
    </DonationPOSProvider>
  );
}
