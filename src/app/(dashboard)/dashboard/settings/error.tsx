"use client";

import React, { useEffect } from "react";
import { PageContainer } from "@/components/shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

interface SettingsErrorProps {
  readonly error: Error & { readonly digest?: string };
  readonly reset: () => void;
}

export default function SettingsError({ error, reset }: SettingsErrorProps) {
  useEffect(() => {
    // Log target error to client analytics
    console.error("Settings route error:", error);
  }, [error]);

  return (
    <PageContainer className="flex items-center justify-center py-20">
      <div className="max-w-md w-full space-y-4 text-center">
        <Alert variant="destructive" className="text-left">
          <Icons.Error className="h-4 w-4" />
          <AlertTitle>Terjadi Kesalahan</AlertTitle>
          <AlertDescription className="mt-1">
            Gagal memuat halaman pengaturan yayasan. Pastikan Anda masuk sebagai Administrator.
          </AlertDescription>
        </Alert>
        <Button onClick={reset} className="mx-auto">
          Coba Lagi
        </Button>
      </div>
    </PageContainer>
  );
}
export type SettingsErrorPropsType = typeof SettingsError;
