export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
  },
  DASHBOARD: {
    HOME: "/dashboard",
    DONORS: "/dashboard/donors",
    DONATIONS: "/dashboard/donations",
    REPORTS: "/dashboard/reports",
    USERS: "/dashboard/users",
    SETTINGS: "/dashboard/settings",
  },
  RECEIPT: (id: string): string => `/receipts/${id}`,
} as const;
