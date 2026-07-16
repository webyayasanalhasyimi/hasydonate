export const DONATION_ROUTES = {
  LIST: "/dashboard/donation",
  NEW: "/dashboard/donation/new",
  DETAIL: (id: string) => `/dashboard/donation/${id}`,
} as const;
