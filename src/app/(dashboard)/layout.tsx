import { type ReactNode } from "react";
import { requireAuth } from "@/lib/auth";

interface DashboardLayoutProps {
  readonly children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Enforce server-side authentication
  await requireAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {children}
    </div>
  );
}
