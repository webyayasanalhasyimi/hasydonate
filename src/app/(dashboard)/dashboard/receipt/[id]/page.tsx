import { requireAuth } from "@/lib/auth";
import { generateReceiptAction } from "@/server/actions/receipt/generate-receipt";
import { ReceiptPreview } from "@/features/receipt/components/ReceiptPreview";
import { PageContainer } from "@/components/shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Icons } from "@/lib/icons";

interface ReceiptDetailPageProps {
  readonly params: Promise<{ readonly id: string }>;
}

export default async function ReceiptDetailPage({ params }: ReceiptDetailPageProps) {
  await requireAuth();
  const { id } = await params;
  const res = await generateReceiptAction(id);

  if (!res.success) {
    // If donation not found, or proof missing, render descriptive alert
    return (
      <PageContainer>
        <div className="max-w-xl mx-auto py-10 space-y-4">
          <Alert variant="destructive">
            <Icons.Error className="h-4 w-4" />
            <AlertTitle>Gagal Memuat Kwitansi</AlertTitle>
            <AlertDescription className="mt-1">
              {res.error.message || "Terjadi kesalahan yang tidak terduga."}
            </AlertDescription>
          </Alert>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ReceiptPreview data={res.data} />
    </PageContainer>
  );
}
export type ReceiptDetailPageType = typeof ReceiptDetailPage;
