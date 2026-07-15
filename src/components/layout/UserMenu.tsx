"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/lib/icons";
import { logoutAction } from "@/server/actions/auth/logout";
import { ROUTES } from "@/constants/routes";
import { type Profile } from "@prisma/client";

interface UserMenuProps {
  readonly profile: Profile;
}

export function UserMenu({ profile }: UserMenuProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    const result = await logoutAction();
    if (result.success) {
      router.push(ROUTES.AUTH.LOGIN);
      router.refresh();
    } else {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-8 w-8 rounded-full bg-muted flex items-center justify-center font-semibold text-primary hover:bg-muted/80 cursor-pointer outline-hidden">
        {profile.fullName.slice(0, 2).toUpperCase()}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-foreground">{profile.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">{profile.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-xs text-muted-foreground font-semibold">
          ROLE: {profile.role}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="text-red-600 focus:text-red-600 cursor-pointer flex items-center gap-2"
        >
          <Icons.LogOut className="h-4 w-4" />
          <span>{isLoading ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
