import { type ReactNode } from "react";
import { requireAuth } from "@/lib/auth";
import { AppSidebar } from "@/components/layout/AppSidebar";

interface DashboardLayoutProps {
  readonly children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Enforce server-side authentication
  const { profile } = await requireAuth();

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950">
      <AppSidebar profile={profile} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
