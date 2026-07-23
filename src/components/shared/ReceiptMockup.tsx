"use client";

import { useState } from "react";
import { Receipt, Heart, ShieldCheck, CheckCircle2, User, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SampleDonation {
  receiptNo: string;
  donorName: string;
  phone: string;
  address: string;
  type: "ZAKAT" | "SHADAQAH" | "SUMBANGAN_LAIN";
  amount: string;
  amountWord: string;
  date: string;
  notes: string;
}

const SAMPLES: SampleDonation[] = [
  {
    receiptNo: "KW/2026/07/0412",
    donorName: "H. Ahmad Fauzi, M.Si",
    phone: "0812-9876-5432",
    address: "Jl. Margonda Raya No. 45, Depok",
    type: "ZAKAT",
    amount: "Rp 2.500.000",
    amountWord: "Dua Juta Lima Ratus Ribu Rupiah",
    date: "23 Juli 2026",
    notes: "Zakat Mal Pendapatan Keluarga",
  },
  {
    receiptNo: "KW/2026/07/0413",
    donorName: "Siti Aminah",
    phone: "0856-1122-3344",
    address: "Perumahan Hijau Asri B/12, Tangerang",
    type: "SHADAQAH",
    amount: "Rp 500.000",
    amountWord: "Lima Ratus Ribu Rupiah",
    date: "23 Juli 2026",
    notes: "Sedekah Jumat Berkah untuk Anak Yatim",
  },
  {
    receiptNo: "KW/2026/07/0414",
    donorName: "Bambang Hermawan",
    phone: "0819-5555-7788",
    address: "Jl. Gatot Subroto Kav. 21, Jakarta Selatan",
    type: "SUMBANGAN_LAIN",
    amount: "Rp 10.000.000",
    amountWord: "Sepuluh Juta Rupiah",
    date: "23 Juli 2026",
    notes: "Sumbangan Operasional Renovasi Gedung",
  },
];

export function ReceiptMockup() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const sample = SAMPLES[selectedIdx] || SAMPLES[0]!;

  return (
    <div className="flex flex-col gap-6 w-full lg:max-w-md mx-auto">
      {/* Selector Tabs */}
      <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl">
        {SAMPLES.map((s, idx) => (
          <button
            key={s.type}
            onClick={() => setSelectedIdx(idx)}
            className={`flex-1 text-xs py-2 px-1.5 rounded-lg font-semibold transition-all ${
              selectedIdx === idx
                ? "bg-white dark:bg-zinc-700 text-primary shadow-xs"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
            }`}
          >
            {s.type.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* The Receipt Mockup */}
      <div className="relative overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl shadow-zinc-100 dark:shadow-none p-6 md:p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-2xl">
        {/* Decorative background watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <Landmark className="w-64 h-64 text-primary" />
        </div>

        {/* Receipt Header */}
        <div className="flex justify-between items-start border-b border-dashed border-zinc-200 dark:border-zinc-800 pb-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                Yayasan Al-Hasyimi
            </h4>
            </div>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px] leading-tight">
              Panti Asuhan Al-Hasyimi • Terakreditasi Kemensos
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="bg-emerald-50/50 dark:bg-emerald-950/20 text-primary border-emerald-200 dark:border-emerald-900/50 font-mono text-[10px] py-0.5 px-2">
              {sample.receiptNo}
            </Badge>
            <p className="text-[10px] text-zinc-400 mt-1">{sample.date}</p>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="space-y-4 text-xs relative z-10 flex-1">
          {/* Donor Info Row */}
          <div className="grid grid-cols-3 gap-2">
            <span className="text-zinc-500 dark:text-zinc-400">Nama Donatur</span>
            <span className="col-span-2 font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-zinc-400" />
              {sample.donorName}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-zinc-500 dark:text-zinc-400">Telepon</span>
            <span className="col-span-2 font-medium text-zinc-700 dark:text-zinc-300">{sample.phone}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-zinc-500 dark:text-zinc-400">Alamat</span>
            <span className="col-span-2 text-zinc-600 dark:text-zinc-400 leading-normal">{sample.address}</span>
          </div>

          <hr className="border-t border-zinc-100 dark:border-zinc-800/80 my-2" />

          {/* Donation Info Row */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-zinc-500 dark:text-zinc-400">Jenis Donasi</span>
            <span className="col-span-2">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-bold">
                {sample.type.replace("_", " ")}
              </Badge>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-zinc-500 dark:text-zinc-400">Jumlah Uang</span>
            <span className="col-span-2 text-lg font-black text-primary font-mono">{sample.amount}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Terbilang</span>
            <span className="col-span-2 text-zinc-600 dark:text-zinc-400 italic">
              &ldquo;{sample.amountWord}&rdquo;
            </span>
          </div>

          {/* Notes */}
          {sample.notes && (
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100 dark:border-zinc-800/60 mt-2">
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Keterangan / Doa</p>
              <p className="text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">{sample.notes}</p>
            </div>
          )}
        </div>

        {/* Receipt Footer */}
        <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-4 flex justify-between items-center relative z-10 text-[10px]">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Kwitansi Digital Sah</span>
          </div>
          <div className="text-center">
            <p className="text-zinc-400 mb-1">Penerima (Admin)</p>
            <div className="h-6 flex items-center justify-center">
              <span className="font-serif text-zinc-600 dark:text-zinc-400 italic font-bold">HasyiStaff</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
          Kwitansi otomatis dikonversi ke PDF A5 dan dikirim via WA
        </p>
      </div>
    </div>
  );
}
