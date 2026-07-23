"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { type Profile } from "@prisma/client";
import { Icons } from "@/lib/icons";
import { ROUTES } from "@/constants/routes";
import { logoutAction } from "@/server/actions/auth/logout";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  readonly profile: Profile;
}

export function AppSidebar({ profile }: AppSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = profile.role === "ADMIN";

  const navItems = [
    {
      label: "Dashboard",
      href: ROUTES.DASHBOARD.HOME,
      icon: Icons.Dashboard,
      show: true,
    },
    {
      label: "Donatur",
      href: ROUTES.DASHBOARD.DONORS,
      icon: Icons.Users,
      show: true,
    },
    {
      label: "Donasi",
      href: ROUTES.DASHBOARD.DONATIONS,
      icon: Icons.Receipt,
      show: true,
    },
    {
      label: "Laporan Keuangan",
      href: ROUTES.DASHBOARD.REPORTS,
      icon: Icons.FileText,
      show: isAdmin,
    },
    {
      label: "Manajemen Staff",
      href: ROUTES.DASHBOARD.USERS,
      icon: Icons.Users, // Reused Users icon for simple layout
      show: isAdmin,
    },
    {
      label: "Pengaturan",
      href: ROUTES.DASHBOARD.SETTINGS,
      icon: Icons.Settings,
      show: isAdmin,
    },
  ];

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    const result = await logoutAction();
    if (result.success) {
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
    } else {
      setIsLoggingOut(false);
    }
  };

  const activeLinkClass =
    "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-l-4 border-emerald-600 transition-all duration-150";
  const inactiveLinkClass =
    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-950 dark:hover:text-zinc-100 transition-all duration-150 border-l-4 border-transparent";

  const renderSidebarContent = (onClose?: () => void) => (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950 border-r border-zinc-150 dark:border-zinc-900 w-64">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 p-1 bg-white rounded-lg shadow-sm border border-zinc-100 dark:bg-zinc-800 dark:border-zinc-800 flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo"
              width={32}
              height={32}
              priority
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white leading-none">
              Hasy<span className="text-emerald-600 dark:text-emerald-400">Donate</span>
            </h2>
            <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block mt-0.5">
              Yayasan Al-Hasyimi
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer md:hidden"
            aria-label="Close sidebar"
          >
            <Icons.Close className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems
          .filter((item) => item.show)
          .map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== ROUTES.DASHBOARD.HOME && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={isActive ? activeLinkClass : inactiveLinkClass}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`} />
                {item.label}
              </Link>
            );
          })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-sm shadow-inner uppercase">
            {profile.fullName.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate leading-tight">
              {profile.fullName}
            </p>
            <span className="inline-flex items-center px-1.5 py-0.5 mt-1 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider border border-emerald-100/50 dark:border-emerald-900/30">
              {profile.role}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 dark:hover:text-red-300 gap-3 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
        >
          <Icons.LogOut className="w-5 h-5 text-red-500" />
          <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 w-full flex items-center justify-between px-4 h-16 bg-white dark:bg-zinc-950 border-b border-zinc-150 dark:border-zinc-900">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg cursor-pointer"
            aria-label="Open sidebar"
          >
            <Icons.Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-zinc-900 dark:text-white">
              Hasy<span className="text-emerald-600 dark:text-emerald-400">Donate</span>
            </span>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center text-xs uppercase">
          {profile.fullName.slice(0, 2)}
        </div>
      </header>

      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:flex md:flex-col h-screen sticky top-0 shrink-0">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar (Drawer Overlay) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex flex-col max-w-xs w-full bg-white dark:bg-zinc-950 shadow-2xl transition-transform duration-300 ease-in-out">
            {renderSidebarContent(() => setIsOpen(false))}
          </div>
        </div>
      )}
    </>
  );
}
