import { requireAuth } from "@/lib/auth";
import { CreateDonaturForm } from "@/features/donatur/components/CreateDonaturForm";
import { PageContainer } from "@/components/shared";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Typography } from "@/components/shared/Typography";

export default async function NewDonaturPage() {
  await requireAuth();

  return (
    <PageContainer className="max-w-2xl">
      <div className="pb-4">
        <Typography variant="h2" as="h1">
          Tambah Donatur Baru
        </Typography>
        <Typography variant="muted" className="mt-1">
          Masukkan informasi profil donatur untuk mencatat donasi baru.
        </Typography>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Formulir Donatur</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateDonaturForm />
        </CardContent>
      </Card>
    </PageContainer>
  );
}
