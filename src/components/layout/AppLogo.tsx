import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function AppLogo() {
  return (
    <Link href={ROUTES.DASHBOARD.HOME} className="flex items-center space-x-2">
      <span className="text-xl font-bold text-green-600 tracking-tight">HasyDonate</span>
    </Link>
  );
}
export type AppLogoType = typeof AppLogo;
