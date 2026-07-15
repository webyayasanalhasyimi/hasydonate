import { AppLogo } from "./AppLogo";
import { UserMenu } from "./UserMenu";
import { type Profile } from "@prisma/client";

interface AppHeaderProps {
  readonly profile: Profile;
}

export function AppHeader({ profile }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-[var(--header-height)] flex items-center justify-between px-6">
        <AppLogo />
        <div className="flex items-center space-x-4">
          <UserMenu profile={profile} />
        </div>
      </div>
    </header>
  );
}
export type AppHeaderType = typeof AppHeader;
