"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/shared";
import { PageContainer } from "@/components/shared";

interface DonaturErrorProps {
  readonly error: Error & { readonly digest?: string };
  readonly reset: () => void;
}

export default function DonaturError({ error, reset }: DonaturErrorProps) {
  useEffect(() => {
    console.error("Donatur boundary error:", error);
  }, [error]);

  return (
    <PageContainer className="max-w-2xl pt-10">
      <ErrorAlert
        title="Terjadi Kesalahan"
        message={error.message || "Gagal memproses permintaan modul donatur."}
      />
      <div className="flex justify-center pt-6">
        <Button onClick={reset}>Coba Lagi</Button>
      </div>
    </PageContainer>
  );
}
