import { type PaginationMeta } from "@/types/pagination";

export const getPaginationMeta = (
  page = 1,
  limit = 10,
  total = 0
): PaginationMeta => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  const totalPages = Math.max(0, Math.ceil(total / safeLimit));

  return {
    total,
    page: safePage,
    limit: safeLimit,
    totalPages,
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
  };
};

export const getPaginationSkip = (page = 1, limit = 10): number => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);
  return (safePage - 1) * safeLimit;
};
