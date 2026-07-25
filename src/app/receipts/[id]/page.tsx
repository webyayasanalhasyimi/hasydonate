import { getPublicReceiptAction } from "@/server/actions/receipt/generate-receipt";
import { PrintReceiptView } from "@/features/receipt/renderers/print-renderer";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/lib/icons";
import Link from "next/link";
import { ReceiptDownloadButton } from "@/features/receipt/components/ReceiptDownloadButton";

interface PublicReceiptPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function PublicReceiptPage({ params }: PublicReceiptPageProps) {
  const { id } = await params;
  const res = await getPublicReceiptAction(id);

  if (!res.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
        <div className="max-w-xl w-full space-y-4">
          <Alert variant="destructive">
            <Icons.Error className="h-4 w-4" />
            <AlertTitle>Kwitansi Tidak Ditemukan</AlertTitle>
            <AlertDescription className="mt-1">
              {res.error.message || "Tautan kwitansi tidak valid atau kwitansi tidak ditemukan."}
            </AlertDescription>
          </Alert>
          <div className="text-center">
            <Link
              href="/"
              className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <Icons.ChevronLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const receiptData = res.data;

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-50/50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-12 px-4 flex flex-col items-center justify-center relative">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-[148mm] space-y-6 relative z-10 print:p-0 print:my-0">
        {/* Actions panel (hidden during printing) */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-4 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl print:hidden shadow-xs">
          <div>
            <h3 className="font-extrabold text-foreground leading-none text-sm uppercase">
              Verifikasi Kwitansi
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              Kwitansi Resmi Donasi Yayasan Al-Hasyimi
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ReceiptDownloadButton data={receiptData} />
          </div>
        </div>

        {/* Printable Card Wrapper */}
        <div className="flex justify-center p-0 print:p-0">
          <Card className="shadow-xl border border-zinc-200/80 dark:border-zinc-800/80 w-full max-w-[148mm] min-h-[210mm] bg-white text-black print:shadow-none print:border-0 print:m-0">
            <CardContent className="p-0">
              <PrintReceiptView data={receiptData} />
            </CardContent>
          </Card>
        </div>

        <div className="text-center print:hidden">
          <p className="text-xs text-muted-foreground">
            Halaman ini adalah halaman verifikasi resmi Yayasan Panti Asuhan Al-Hasyimi.
          </p>
        </div>
      </div>
    </div>
  );
}
