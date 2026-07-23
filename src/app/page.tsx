import Image from "next/image";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { ROUTES } from "@/constants/routes";
import { Heart, Receipt, Share2, BarChart3, Lock, ArrowRight, LayoutDashboard } from "lucide-react";

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
    <div className="min-h-screen bg-linear-to-b from-emerald-50/50 via-white to-emerald-50/20 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col justify-between">
      {/* Top Accent Bar */}
      <div className="h-1.5 w-full bg-primary" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-4xl text-center space-y-8">
          {/* Logo & Header */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-28 h-28 md:w-32 md:h-32 p-2 bg-white rounded-3xl shadow-xl shadow-emerald-100/50 dark:shadow-none dark:bg-zinc-800 border border-emerald-100/20 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105">
              <Image
                src="/logo.png"
                alt="Yayasan Al-Hasyimi Logo"
                fill
                priority
                className="object-contain p-2"
              />
            </div>
            <div className="space-y-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-primary border border-emerald-100 dark:border-emerald-900/30">
                <Lock className="w-3.5 h-3.5" /> Portal Internal Staff
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Hasy<span className="text-primary">Donate</span>
              </h1>
              <p className="text-base md:text-lg max-w-xl mx-auto text-zinc-600 dark:text-zinc-400 font-medium">
                Sistem Informasi Pengelolaan Donasi & Kwitansi Resmi
                <br />
                <span className="text-zinc-500 dark:text-zinc-500 font-normal text-sm md:text-base">
                  Yayasan Panti Asuhan Al-Hasyimi
                </span>
              </p>
            </div>
          </div>

          {/* CTA Action */}
          <div className="flex flex-col items-center justify-center gap-3">
            <Link
              href={ctaRoute}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:bg-primary/95 transition-all duration-300 hover:-translate-y-0.5 group text-lg"
            >
              {ctaLabel}
              <CTAIcon className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Hanya personel terotorisasi yang dapat mengakses dashboard.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mt-12 text-left">
            {/* Feature 1 */}
            <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-xs hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-primary flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Pencatatan Donasi Instan
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Desain form POS-like yang cepat, mendukung pencarian donor langsung dan entri data dalam waktu kurang dari 30 detik.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-xs hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-primary flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Kwitansi Resmi A5
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Cetak kwitansi resmi berformat A5 Portrait yang sesuai dengan standar Yayasan Al-Hasyimi secara langsung.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-xs hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-primary flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Integrasi WhatsApp & PDF
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Unduh kwitansi dalam bentuk PDF berkualitas tinggi atau bagikan langsung kepada para donor melalui WhatsApp.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 shadow-xs hover:border-emerald-200 dark:hover:border-emerald-800/50 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-primary flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
                Laporan & Analisis
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Pantau total penerimaan zakat, shadaqah, dan sumbangan lainnya per hari maupun per bulan secara transparan.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center border-t border-zinc-100 dark:border-zinc-900 text-xs text-zinc-500 dark:text-zinc-500 px-4">
        <p>© {new Date().getFullYear()} Yayasan Panti Asuhan Al-Hasyimi. Hak Cipta Dilindungi Undang-Undang.</p>
        <p className="mt-1 font-medium text-amber-600/90 dark:text-amber-500/80">
          Peringatan: Sistem tertutup ini didesain khusus untuk manajemen internal yayasan.
        </p>
      </footer>
    </div>
  );
}
