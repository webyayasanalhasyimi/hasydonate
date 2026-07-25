import "@/lib/env";
import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/providers/AppProvider";

export const metadata: Metadata = {
  title: "Al-Hasyimi Donate - Donation Management System",
  description: "Internal Donation Management Information System for Yayasan Panti Asuhan Al-Hasyimi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
