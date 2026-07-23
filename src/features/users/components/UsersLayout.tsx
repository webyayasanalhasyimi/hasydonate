"use client";

import React, { useState, useEffect, useTransition } from "react";
import { type UserListItemDto } from "../types";
import { getUsersAction } from "@/server/actions/users/get-users";
import { toggleUserStatusAction } from "@/server/actions/users/toggle-user-status";
import { getCurrentUserAction } from "@/server/actions/auth/get-current-user";
import { UserList } from "./UserList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Icons } from "@/lib/icons";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface WidgetState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: string | null;
}

export function UsersLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  const [usersState, setUsersState] = useState<WidgetState<readonly UserListItemDto[]>>({
    data: null,
    loading: true,
    error: null,
  });

  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [loadingMore, setLoadingMore] = useState(false);
  const [, startTransition] = useTransition();

  const loadUsers = async (query: string, cursor?: string) => {
    if (!cursor) {
      setUsersState((prev) => ({ ...prev, loading: true, error: null }));
    } else {
      setLoadingMore(true);
    }

    const res = await getUsersAction({ limit: 10, cursor, query });

    if (!cursor) {
      if (res.success) {
        setUsersState({ data: res.data.items, loading: false, error: null });
        setNextCursor(res.data.nextCursor);
      } else {
        setUsersState({
          data: null,
          loading: false,
          error: res.error.message || "Gagal memuat daftar pengguna.",
        });
        setNextCursor(undefined);
      }
    } else {
      setLoadingMore(false);
      if (res.success) {
        setUsersState((prev) => ({
          ...prev,
          data: prev.data ? [...prev.data, ...res.data.items] : res.data.items,
        }));
        setNextCursor(res.data.nextCursor);
      }
    }
  };

  useEffect(() => {
    async function loadMe() {
      const res = await getCurrentUserAction();
      if (res.success && res.data) {
        setCurrentUserId(res.data.profile.id);
      }
    }
    loadMe();
  }, []);

  useEffect(() => {
    startTransition(() => {
      loadUsers(searchQuery);
    });
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (nextCursor) {
      loadUsers(searchQuery, nextCursor);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const res = await toggleUserStatusAction(id, !currentStatus);
    if (res.success) {
      toast.success(
        `Pengguna berhasil ${!currentStatus ? "diaktifkan" : "dinonaktifkan"}.`
      );
      // Reload current search
      loadUsers(searchQuery);
    } else {
      toast.error(res.error.message || "Gagal mengubah status pengguna.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Manajemen Pengguna</h1>
          <p className="text-xs text-muted-foreground">
            Kelola hak akses pengguna internal (Administrator dan Front Admin).
          </p>
        </div>
        <Link href="/dashboard/users/new" className={buttonVariants({ variant: "default" })}>
          <Icons.Plus className="h-4 w-4 mr-2" />
          Tambah Pengguna
        </Link>
      </div>

      {/* Main Listing View */}
      {usersState.loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : usersState.error ? (
        <Alert variant="destructive" className="flex flex-col gap-2 items-start justify-center p-6">
          <Icons.Error className="h-5 w-5 shrink-0" />
          <AlertTitle className="text-sm font-bold">Gagal Memuat Pengguna</AlertTitle>
          <AlertDescription className="text-xs">{usersState.error}</AlertDescription>
          <Button size="sm" variant="outline" className="mt-2" onClick={() => loadUsers(searchQuery)}>
            Coba Lagi
          </Button>
        </Alert>
      ) : (
        <UserList
          users={usersState.data || []}
          nextCursor={nextCursor}
          onLoadMore={handleLoadMore}
          loadingMore={loadingMore}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleStatus={handleToggleStatus}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}
export type UsersLayoutType = typeof UsersLayout;
