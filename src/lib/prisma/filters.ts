export const buildSearchFilter = (
  search: string | undefined,
  fields: readonly string[]
): Record<string, unknown> | undefined => {
  if (!search) {
    return undefined;
  }

  const normalized = search.trim();
  if (normalized.length === 0) {
    return undefined;
  }

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: normalized,
        mode: "insensitive",
      },
    })),
  };
};

export const buildDateRangeFilter = (
  startDate: string | Date | undefined,
  endDate: string | Date | undefined
): Record<string, unknown> | undefined => {
  if (!startDate && !endDate) {
    return undefined;
  }

  const dateFilter: Record<string, unknown> = {};

  if (startDate) {
    dateFilter.gte = typeof startDate === "string" ? new Date(startDate) : startDate;
  }

  if (endDate) {
    dateFilter.lte = typeof endDate === "string" ? new Date(endDate) : endDate;
  }

  return dateFilter;
};
