"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDonationPOS } from "../context/donation-pos-context";
import { searchDonaturAction } from "@/server/actions/donatur/search-donatur";
import { type DonaturListItemDto } from "@/features/donatur/types";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateDonaturForm } from "@/features/donatur/components/CreateDonaturForm";
import { Icons } from "@/lib/icons";
import { formatIDR, formatDate } from "@/lib/utils/index";
import { toast } from "sonner";

export function DonaturSelector() {
  const { selectedDonor, setSelectedDonor, errors, setErrors } = useDonationPOS();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<readonly DonaturListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setIsOpen(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      const res = await searchDonaturAction(searchQuery, { limit: 5 });
      setIsLoading(false);

      if (res.success) {
        setResults(res.data.items);
        setIsOpen(res.data.items.length > 0);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSelect = (donor: DonaturListItemDto) => {
    setSelectedDonor(donor);
    setSearchQuery("");
    setResults([]);
    setIsOpen(false);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.donorId;
      return next;
    });
  };

  const handleQuickCreateSuccess = (donor: {
    id: string;
    fullName: string;
    phoneNumber: string;
    address: string;
  }) => {
    const listItem: DonaturListItemDto = {
      id: donor.id,
      fullName: donor.fullName,
      phoneNumber: donor.phoneNumber,
      address: donor.address,
      totalDonations: 0,
      lastDonationAt: null,
    };
    setSelectedDonor(listItem);
    setDialogOpen(false);
    setSearchQuery("");
    setErrors((prev) => {
      const next = { ...prev };
      delete next.donorId;
      return next;
    });
    toast.success("Donatur baru otomatis terpilih");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground">
          Informasi Donatur <span className="text-destructive">*</span>
        </label>
        {errors.donorId && (
          <span className="text-xs text-destructive font-medium">{errors.donorId}</span>
        )}
      </div>

      {selectedDonor ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{selectedDonor.fullName}</span>
                <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full border border-border">
                  {selectedDonor.phoneNumber}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{selectedDonor.address}</p>
              <div className="flex items-center gap-4 pt-1 text-[11px] text-muted-foreground font-medium">
                <span>Total: {formatIDR(selectedDonor.totalDonations)}</span>
                <span>
                  Terakhir:{" "}
                  {selectedDonor.lastDonationAt ? formatDate(selectedDonor.lastDonationAt) : "-"}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDonor(null)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Icons.Trash className="h-4 w-4 mr-1" />
              Ganti
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2.5 text-muted-foreground">
                <Icons.Search className="h-4 w-4" />
              </span>
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Cari donatur berdasarkan nama atau nomor WhatsApp..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {isLoading && (
                <span className="absolute right-3 top-2.5">
                  <Icons.Spinner className="h-4 w-4 animate-spin text-muted-foreground" />
                </span>
              )}
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger className={buttonVariants({ variant: "outline", className: "shrink-0" })}>
                <Icons.Plus className="h-4 w-4 mr-2" />
                Donatur Baru
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>Tambah Donatur Baru</DialogTitle>
                </DialogHeader>
                <CreateDonaturForm
                  onSuccess={handleQuickCreateSuccess}
                  onCancel={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {isOpen && results.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <ul className="p-1 divide-y divide-border">
                {results.map((donor) => (
                  <li key={donor.id}>
                    <button
                      type="button"
                      className="w-full text-left p-3 hover:bg-muted focus:bg-muted focus:outline-none transition-colors rounded-md"
                      onClick={() => handleSelect(donor)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{donor.fullName}</span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {donor.phoneNumber}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{donor.address}</p>
                      <div className="flex items-center gap-4 mt-1 text-[10px] text-muted-foreground font-medium">
                        <span>Total Donasi: {formatIDR(donor.totalDonations)}</span>
                        <span>
                          Terakhir: {donor.lastDonationAt ? formatDate(donor.lastDonationAt) : "-"}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {searchQuery.trim().length >= 2 && !isLoading && results.length === 0 && (
            <div className="absolute z-50 w-full mt-1 p-4 bg-popover text-popover-foreground border border-border rounded-lg shadow-lg text-center space-y-2">
              <p className="text-sm text-muted-foreground">Donatur tidak ditemukan</p>
              <Button size="sm" onClick={() => setDialogOpen(true)}>
                <Icons.Plus className="h-4 w-4 mr-2" />
                Daftarkan &quot;{searchQuery}&quot; Baru
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
