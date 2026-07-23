"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Users, 
  Heart, 
  BarChart3, 
  LogIn, 
  LogOut, 
  ShieldCheck 
} from "lucide-react";

interface NavbarProps {
  readonly user: {
    readonly email?: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: ROUTES.DASHBOARD.HOME, icon: LayoutDashboard },
    { name: "Donatur", href: ROUTES.DASHBOARD.DONORS, icon: Users },
    { name: "Donasi", href: ROUTES.DASHBOARD.DONATIONS, icon: Heart },
    { name: "Laporan", href: ROUTES.DASHBOARD.REPORTS, icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-8 p-1 bg-white rounded-lg border border-emerald-100 dark:border-zinc-800 shadow-xs flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Logo Al-Hasyimi"
                  width={24}
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-zinc-900 dark:text-white text-lg tracking-tight">
                Hasy<span className="text-primary">Donate</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <div className="hidden md:flex items-center ml-8 space-x-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-emerald-50 dark:bg-emerald-950/50 text-primary"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Right items */}
          <div className="hidden md:flex items-center gap-4">
            {user && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-primary border border-emerald-100/30 dark:border-emerald-900/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Staff Portal
              </span>
            )}
            
            <ThemeToggle />

            {user ? (
              <Link href={ROUTES.DASHBOARD.HOME}>
                <Button className="font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl px-4 py-2 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href={ROUTES.AUTH.LOGIN}>
                <Button className="font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl px-4 py-2 flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Masuk Portal
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 px-4 py-4 space-y-3">
          {user && (
            <div className="space-y-1.5 pb-3 border-b border-zinc-100 dark:border-zinc-900">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/50 text-primary"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="pt-1.5">
            {user ? (
              <div className="space-y-2">
                <p className="text-xs text-zinc-400 px-4">
                  Masuk sebagai: <span className="font-semibold text-zinc-600 dark:text-zinc-300">{user.email}</span>
                </p>
                <Link href={ROUTES.DASHBOARD.HOME} onClick={() => setIsOpen(false)}>
                  <Button className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl flex items-center justify-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <Link href={ROUTES.AUTH.LOGIN} onClick={() => setIsOpen(false)}>
                <Button className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Masuk Portal
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
