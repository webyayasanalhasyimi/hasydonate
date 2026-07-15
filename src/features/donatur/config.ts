export const DONATUR_ROUTES = {
  LIST: "/dashboard/donatur",
  NEW: "/dashboard/donatur/new",
  DETAIL: (id: string) => `/dashboard/donatur/${id}`,
} as const;
