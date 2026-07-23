import { type ReportTrendItemDto } from "../../types";

export function aggregateTrend(
  donations: ReadonlyArray<{ readonly amount: unknown; readonly donationDate: Date }>,
  dateStart: Date,
  dateEnd: Date
): readonly ReportTrendItemDto[] {
  const trendMap: Record<string, { amount: number; count: number }> = {};
  
  // Calculate total days between start and end
  const start = new Date(dateStart);
  start.setHours(0, 0, 0, 0);
  const end = new Date(dateEnd);
  end.setHours(23, 59, 59, 999);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Cap at 366 days max to avoid infinite loops or memory explosions
  const totalDays = Math.min(diffDays, 366);

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    trendMap[dateStr] = { amount: 0, count: 0 };
  }

  for (const donation of donations) {
    const d = new Date(donation.donationDate);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;
    if (trendMap[dateStr]) {
      trendMap[dateStr].amount += Number(donation.amount);
      trendMap[dateStr].count += 1;
    }
  }

  return Object.entries(trendMap)
    .map(([date, val]) => ({
      date,
      amount: val.amount,
      count: val.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
export type AggregateTrendType = typeof aggregateTrend;
