import React from "react";
import { type UserDetailDto } from "../types";
import { RoleBadge } from "./RoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

interface UserDetailProps {
  readonly user: UserDetailDto;
}

export function UserDetail({ user }: UserDetailProps) {
  const formatVal = (val: unknown): string => {
    if (typeof val === "boolean") return val ? "Aktif" : "Nonaktif";
    if (val === null || val === undefined) return "Kosong";
    return String(val);
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Detail Pengguna</h1>
          <p className="text-xs text-muted-foreground">Profil detail sistem, peran, dan riwayat aktivitas audit.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/users" className={buttonVariants({ variant: "outline" })}>
            Kembali
          </Link>
          <Link href={`/dashboard/users/${user.id}/edit`} className={buttonVariants({ variant: "default" })}>
            Ubah Profil
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Informasi Akun
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-semibold">Nama Lengkap</label>
              <p className="text-sm font-bold text-foreground">{user.fullName}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-semibold">Email</label>
              <p className="text-sm text-foreground">{user.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-semibold">Peran</label>
              <div>
                <RoleBadge role={user.role} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground font-semibold">Status Keanggotaan</label>
              <div>
                <UserStatusBadge isActive={user.isActive} />
              </div>
            </div>
            <div className="border-t border-border/60 pt-3 space-y-2 text-xs text-muted-foreground">
              <p>
                Dibuat:{" "}
                <span className="text-foreground font-medium">
                  {new Date(user.createdAt).toLocaleString("id-ID")}
                </span>
              </p>
              <p>
                Diperbarui:{" "}
                <span className="text-foreground font-medium">
                  {new Date(user.updatedAt).toLocaleString("id-ID")}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Audit Log Card */}
        <Card className="lg:col-span-2 border border-border">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Riwayat Audit Aktivitas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {user.auditLogs.map((log) => (
                <div key={log.id} className="p-4 space-y-2 hover:bg-muted/10 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {log.action}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="text-xs text-foreground">
                    Oleh: <span className="font-semibold">{log.actorName}</span>
                  </p>

                  {/* Render Diff for updates */}
                  {log.action === "UPDATE_USER" && log.newValue && (
                    <div className="bg-muted/30 border border-border rounded-lg p-3 text-[11px] font-mono space-y-1 text-muted-foreground">
                      <p className="font-bold text-foreground border-b border-border pb-1 mb-1">
                        Rincian Perubahan Bidang:
                      </p>
                      {Object.entries(log.newValue).map(([key, val]) => {
                        const oldVal = log.oldValue ? log.oldValue[key] : null;
                        return (
                          <div key={key} className="flex flex-col sm:flex-row sm:justify-between border-b border-dashed border-border/40 py-1">
                            <span className="font-bold text-foreground uppercase">{key}:</span>
                            <span>
                              {formatVal(oldVal)} &rarr;{" "}
                              <span className="text-primary font-bold">{formatVal(val)}</span>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Render Diff for creations */}
                  {log.action === "CREATE_USER" && (
                    <p className="text-xs text-muted-foreground italic">
                      Pengguna didaftarkan pertama kali dalam sistem.
                    </p>
                  )}
                </div>
              ))}
              {user.auditLogs.length === 0 && (
                <p className="p-6 text-center text-xs text-muted-foreground">
                  Belum ada catatan aktivitas audit untuk pengguna ini.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export type UserDetailType = typeof UserDetail;
