import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { ROUTES } from "@/constants/routes";
import { Navbar } from "@/components/layout/Navbar";
import { ReceiptMockup } from "@/components/shared/ReceiptMockup";
import { 
  Heart, 
  Receipt, 
  Share2, 
  BarChart3, 
  Lock, 
  ArrowRight, 
  LayoutDashboard,
  Zap,
  ShieldAlert,
  Server,
  FileCheck
} from "lucide-react";

export default async function Home() {
  let user = null;
  try {
    const supabase = await createServerSupabase();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Failed to fetch user session:", error);
  }

  const ctaRoute = user ? ROUTES.DASHBOARD.HOME : ROUTES.AUTH.LOGIN;
  const ctaLabel = user ? "Buka Dashboard" : "Masuk ke Portal";
  const CTAIcon = user ? LayoutDashboard : ArrowRight;

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 via-white to-zinc-50/50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col justify-between overflow-hidden relative">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative Glowing Blobs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-[350px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 -translate-x-12 -translate-y-12 w-[300px] h-[300px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <Navbar user={user} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 max-w-7xl mx-auto w-full relative z-10">
        
        {/* Split Grid for Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          
          {/* Left Column: Heading and Description */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              {/* Internal Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-primary border border-emerald-100 dark:border-emerald-900/30">
                <Lock className="w-3.5 h-3.5" /> Portal Internal Staff
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                Permudah Manajemen <span className="text-primary bg-clip-text">Donasi</span> Yayasan
              </h1>
              
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
                Sistem POS & Pencatatan Donasi terintegrasi untuk Yayasan Panti Asuhan Al-Hasyimi. 
                Mempercepat input data donor, cetak nota kwitansi resmi A5, dan bagi instan via WhatsApp.
              </p>
            </div>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href={ctaRoute}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:bg-primary/95 transition-all duration-300 hover:-translate-y-0.5 group text-lg"
              >
                {ctaLabel}
                <CTAIcon className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              {user ? (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Anda telah masuk sebagai staff terotorisasi.
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Akses dibatasi hanya untuk staff Front-End/Admin.
                </div>
              )}
            </div>

            {/* System Status Indicators */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 max-w-lg">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Server className="w-4 h-4 text-emerald-500" />
                <span>Server Operasional</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Pencatatan &lt; 30 Detik</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <FileCheck className="w-4 h-4 text-blue-500" />
                <span>Format Kwitansi A5</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Mockup Showcase */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <ReceiptMockup />
          </div>

        </div>

        {/* Section 2: Process Steps Flow */}
        <div className="w-full mt-24 border-t border-zinc-200/50 dark:border-zinc-800/50 pt-16">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
              Alur Kerja POS Cepat & Efisien
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
              Proses input terpadu yang dirancang khusus untuk kenyamanan operasional admin di lapangan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 relative">
              <div className="absolute top-4 right-4 text-4xl font-black text-zinc-100 dark:text-zinc-800 font-mono select-none">
                01
              </div>
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-base">
                Pencarian & Input
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Ketik nama atau nomor telepon untuk mencari data donatur lama, atau buat donatur baru tanpa menutup form input donasi.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 relative">
              <div className="absolute top-4 right-4 text-4xl font-black text-zinc-100 dark:text-zinc-800 font-mono select-none">
                02
              </div>
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-base">
                Simpan Transaksi
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Tentukan nominal dan jenis donasi (Zakat, Sedekah, atau Sumbangan). Sistem akan menghasilkan nomor kwitansi unik otomatis.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-zinc-900/40 p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 relative">
              <div className="absolute top-4 right-4 text-4xl font-black text-zinc-100 dark:text-zinc-800 font-mono select-none">
                03
              </div>
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-base">
                Cetak & Bagikan
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Kwitansi otomatis dikonversi ke PDF A5. Anda bisa langsung mencetaknya ke printer kasir/A5 atau kirim via link WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Feature Grid Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-5xl mx-auto mt-24">
          {/* Card 1 */}
          <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 hover:border-emerald-300 dark:hover:border-emerald-800/50 transition-all duration-300 group flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-primary flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Pencatatan Donasi Instan
              </h3>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Dirancang seperti sistem kasir POS yang minim klik. Pencarian instan mendeteksi donor terdaftar secara seketika.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 hover:border-emerald-300 dark:hover:border-emerald-800/50 transition-all duration-300 group flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-primary flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Kwitansi Resmi A5 Portrait
              </h3>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Format cetak disesuaikan dengan nota fisik Yayasan Al-Hasyimi lengkap dengan watermark, nomor seri kwitansi, dan penutup tanda tangan.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 hover:border-emerald-300 dark:hover:border-emerald-800/50 transition-all duration-300 group flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-primary flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Integrasi WhatsApp & PDF
              </h3>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Unduh salinan PDF digital berkualitas tinggi secara otomatis, atau kirimkan pesan notifikasi WhatsApp template langsung ke nomor donor.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 hover:border-emerald-300 dark:hover:border-emerald-800/50 transition-all duration-300 group flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-primary flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Laporan & Analisis Real-Time
              </h3>
              <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Kelompokkan donasi berdasarkan Zakat, Shadaqah, atau Sumbangan Lain. Grafik visual memudahkan pemantauan aliran dana harian/bulanan.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 text-center border-t border-zinc-200/50 dark:border-zinc-900/80 text-xs text-zinc-500 dark:text-zinc-500 px-4 mt-16 relative z-10 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto space-y-2">
          <p>© {new Date().getFullYear()} Yayasan Panti Asuhan Al-Hasyimi. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="font-semibold text-amber-600/90 dark:text-amber-500/80 max-w-md mx-auto leading-relaxed">
            Peringatan: Sistem ini didesain khusus untuk manajemen internal yayasan. Segala bentuk penyalahgunaan akses akan ditindaklanjuti.
          </p>
        </div>
      </footer>
    </div>
  );
}
