"use client";

import React, { useState } from "react";
import { type UserListItemDto } from "../types";
import { RoleBadge } from "./RoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface UserListProps {
  readonly users: readonly UserListItemDto[];
  readonly nextCursor?: string | undefined;
  readonly onLoadMore: () => void;
  readonly loadingMore: boolean;
  readonly searchQuery: string;
  readonly onSearchChange: (val: string) => void;
  readonly onToggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
  readonly currentUserId?: string | undefined;
}

export function UserList({
  users,
  nextCursor,
  onLoadMore,
  loadingMore,
  searchQuery,
  onSearchChange,
  onToggleStatus,
  currentUserId,
}: UserListProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    await onToggleStatus(id, currentStatus);
    setTogglingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Search Input Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card border border-border rounded-xl p-4">
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari pengguna berdasarkan nama atau email..."
          className="w-full"
        />
      </div>

      {/* Desktop & Tablet Table (Hidden on Mobile) */}
      <div className="hidden sm:block bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Nama Lengkap</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Email</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Peran</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Status</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase">Terdaftar</th>
                <th className="p-4 text-xs font-bold text-muted-foreground uppercase text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted/10 transition-colors">
                  <td className="p-4 font-semibold text-foreground">{user.fullName}</td>
                  <td className="p-4 text-foreground">{user.email}</td>
                  <td className="p-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="p-4">
                    <UserStatusBadge isActive={user.isActive} />
                  </td>
                  <td className="p-4 text-muted-foreground text-xs">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="p-4 text-center space-x-1 whitespace-nowrap">
                    <Link
                      href={`/dashboard/users/${user.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      Detail
                    </Link>
                    <Link
                      href={`/dashboard/users/${user.id}/edit`}
                      className={buttonVariants({ variant: "outline", size: "sm" })}
                    >
                      Ubah
                    </Link>
                    {user.id !== currentUserId && (
                      <Button
                        variant={user.isActive ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggle(user.id, user.isActive)}
                        disabled={togglingId === user.id}
                        className="h-8"
                      >
                        {togglingId === user.id
                          ? "Memproses..."
                          : user.isActive
                          ? "Nonaktifkan"
                          : "Aktifkan"}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-xs text-muted-foreground">
                    Tidak ditemukan pengguna yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Grid Cards (Hidden on Larger Screens) */}
      <div className="sm:hidden space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="border border-border">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-sm font-bold text-foreground">{user.fullName}</CardTitle>
                <div className="flex gap-1">
                  <RoleBadge role={user.role} />
                  <UserStatusBadge isActive={user.isActive} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>Email: <span className="text-foreground">{user.email}</span></p>
                <p>
                  Terdaftar:{" "}
                  <span className="text-foreground">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <Link
                  href={`/dashboard/users/${user.id}`}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Detail
                </Link>
                <Link
                  href={`/dashboard/users/${user.id}/edit`}
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  Ubah
                </Link>
                {user.id !== currentUserId && (
                  <Button
                    variant={user.isActive ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggle(user.id, user.isActive)}
                    disabled={togglingId === user.id}
                    className="h-8"
                  >
                    {togglingId === user.id ? "..." : user.isActive ? "Nonaktifkan" : "Aktifkan"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {users.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-6">Tidak ditemukan pengguna yang cocok.</p>
        )}
      </div>

      {/* Pagination Load More Controls */}
      {nextCursor && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" size="sm" onClick={onLoadMore} disabled={loadingMore}>
            {loadingMore ? "Memuat..." : "Muat Lebih Banyak"}
          </Button>
        </div>
      )}
    </div>
  );
}
export type UserListType = typeof UserList;
